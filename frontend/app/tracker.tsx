import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useMedication } from '@/components/MedicationContext';

const Tracker = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reminder, setReminder] = useState('5 hours till your evening med intake!');
  const { medications } = useMedication(); // Use the medications from context

  const handleDateChange = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleTakeMed = (name: string) => {
    // Logic to mark medication as taken
    alert(`Marked ${name} as taken`);
  };

  const handleSetReminder = (name: string) => {
    // Logic to set reminder
    alert(`Reminder set for ${name}`);
  };

  return (
    <ScrollView style={styles.tracker}>
      <Text style={styles.header}>Your Medication Tracker</Text>
      <Text style={styles.subHeader}>Sept 2024</Text>
      <Calendar
        onDayPress={handleDateChange}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
      />
      <View style={styles.reminder}>
        <Text style={styles.subsubHeader}>Reminder</Text>
        <Text>{reminder}</Text>
      </View>
      <Text style={styles.subsubHeader}>Today's Medication</Text>
      <Text style={styles.subsubHeader}>New Medications from Prescription</Text>
      {medications.length === 0 ? (
        <View style={styles.noMedLogContainer}>
          <Text style={styles.noMedLogText}>No medication logs yet.</Text>
          <Text style={{padding: 8}}>You can either chat with PillPal AI to help you add your med through a photo of prescription and any pills info or you can add it by yourself.</Text>
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
          {medications.map((med, index) => (
            <View key={index} style={styles.medicationItem}>
              <Text style={styles.medName}>{med.name}</Text>
              <Text>Dosage: {med.dosage}</Text>
              <Text>Time: {med.time}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleTakeMed(med.name)}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSetReminder(med.name)}
                >
                  <Text style={styles.buttonText}>Set Reminder</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
});

export default Tracker;