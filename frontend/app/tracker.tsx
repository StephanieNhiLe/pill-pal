import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useMedication } from '@/components/MedicationContext';

const Tracker = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminder, setReminder] = useState('5 hours till your evening med intake!');
  const { medications } = useMedication();
  const [remindedMeds, setRemindedMeds] = useState({});
  const [takenMeds, setTakenMeds] = useState({});
  const [availableMeds, setAvailableMeds] = useState(medications);

  useEffect(() => {
    // Initialize remindedMeds and takenMeds for the current date
    const today = new Date().toISOString().split('T')[0];
    if (!remindedMeds[today]) {
      setRemindedMeds(prev => ({ ...prev, [today]: {} }));
    }
    if (!takenMeds[today]) {
      setTakenMeds(prev => ({ ...prev, [today]: {} }));
    }
  }, []);

  useEffect(() => {
    // Update available medications whenever remindedMeds changes
    const updatedMeds = remove_medications(medications, remindedMeds, selectedDate);
    setAvailableMeds(updatedMeds);
  }, [remindedMeds, medications, selectedDate]);

  const getWeekDates = (startDate) => {
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    return weekDates;
  };

  const remove_medications = (medications, reminded_meds, currentDate) => {
    const weekDates = getWeekDates(currentDate);
    const reminded_med_names = new Set();

    weekDates.forEach(date => {
      if (reminded_meds[date]) {
        Object.keys(reminded_meds[date]).forEach(name => reminded_med_names.add(name));
      }
    });

    return medications.filter(med => !reminded_med_names.has(med.name));
  };

  const handleDateChange = (day) => {
    setSelectedDate(day.dateString);
  };

  const addMedToWeek = (med) => {
    const weekDates = getWeekDates(selectedDate);

    setRemindedMeds(prev => {
      const newRemindedMeds = { ...prev };
      weekDates.forEach(date => {
        if (!newRemindedMeds[date]) {
          newRemindedMeds[date] = {};
        }
        newRemindedMeds[date][med.name] = med;
      });
      return newRemindedMeds;
    });
  };

  const handleSetReminder = (med) => {
    addMedToWeek(med);
  };

  const handleTakeMed = (medName) => {
    setTakenMeds(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [medName]: true
      }
    }));
  };

  const renderMedicationList = (meds, isRemindedList = false) => {
    return Object.values(meds).map((med, index) => {
      const isTaken = takenMeds[selectedDate]?.[med.name];
      return (
        <View key={index} style={[styles.medicationItem, isTaken && styles.takenMedication]}>
          <Text style={styles.medName}>{med.name}</Text>
          <Text>Dosage: {med.dosage}</Text>
          <Text>Time: {med.time}</Text>
          <View style={styles.buttonContainer}>
            {isRemindedList ? (
              <TouchableOpacity
                style={[styles.button, isTaken && styles.disabledButton]}
                onPress={() => handleTakeMed(med.name)}
                disabled={isTaken}
              >
                <Text style={styles.buttonText}>{isTaken ? 'Taken' : 'Confirm'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSetReminder(med)}
              >
                <Text style={styles.buttonText}>Set Reminder</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    });
  };

  const getMarkedDates = () => {
    const markedDates = {};
    Object.keys(remindedMeds).forEach(date => {
      if (Object.keys(remindedMeds[date]).length > 0) {
        markedDates[date] = { marked: true, dotColor: 'blue' };
      }
    });
    if (selectedDate) {
      markedDates[selectedDate] = { 
        ...(markedDates[selectedDate] || {}),
        selected: true,
        selectedColor: 'blue'
      };
    }
    return markedDates;
  };

  return (
    <ScrollView style={styles.tracker}>
      <Text style={styles.header}>Your Medication Tracker</Text>
      <Calendar
        onDayPress={handleDateChange}
        markedDates={getMarkedDates()}
      />
      <View style={styles.reminder}>
        <Text style={styles.subsubHeader}>Reminder</Text>
        <Text>{reminder}</Text>
      </View>
      <Text style={styles.subsubHeader}>Medications for {selectedDate}</Text>
      {Object.keys(remindedMeds[selectedDate] || {}).length === 0 ? (
        <Text>No medications scheduled for this date.</Text>
      ) : (
        <ScrollView style={styles.medicationList}>
          {renderMedicationList(remindedMeds[selectedDate], true)}
        </ScrollView>
      )}
      <Text style={styles.subsubHeader}>New Medications from Prescription</Text>
      {availableMeds.length === 0 ? (
        <View style={styles.noMedLogContainer}>
          <Text style={styles.noMedLogText}>No new medications available.</Text>
          <Text style={{padding: 8}}>You can chat with PillPal AI to add more medications or add them manually.</Text>
          <TouchableOpacity
            style={styles.functionButton}
            onPress={() => navigation.navigate('ChatScreen')}
          >
            <Text style={styles.functionText}>Chat with PillPal AI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.functionButton}
            onPress={() => navigation.navigate('AddMedLogForm')}
          >
            <Text style={styles.functionText}>Add Medication Log</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.medicationList}>
          {renderMedicationList(availableMeds)}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tracker: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
  },
  reminder: {
    marginVertical: 20,
  },
  subsubHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  medicationList: {
    marginVertical: 20,
  },
  medicationItem: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1241C4',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  noMedLogContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  noMedLogText: {
    fontSize: 18,
    marginBottom: 10,
  },
  functionButton: {
    backgroundColor: '#1241C4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  functionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  takenMedication: {
    opacity: 0.5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default Tracker;
