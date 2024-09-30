import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
// import { Calendar, DateObject } from 'react-native-multi-date-picker';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const Tracker = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reminder, setReminder] = useState('5 hours till your evening med intake!');
  const [medications, setMedications] = useState([
    { id: 1, name: 'Ibuprofen', taken: false },
    { id: 2, name: 'Paracetamol', taken: false },
    { id: 3, name: 'Aspirin', taken: false },
  ]);

  const handleDateChange = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleTakeMed = (id: number) => {
    setMedications(medications.map(med => med.id === id ? { ...med, taken: true } : med));
  };

  const handleSetReminder = (id: number) => {
    // Logic to set reminder
    alert(`Reminder set for medication ID: ${id}`);
  };

  return (
    <View style={styles.tracker}>
      <Text style={styles.header}>Your Medication Tracker</Text>
      <Text style={styles.subHeader}>Sept 2024</Text>
      <Calendar
        onDayPress={handleDateChange}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
      />
      <View style={styles.reminder}>
        <Text style={styles.reminderHeader}>Reminder</Text>
        <Text>{reminder}</Text>
      </View>
      <View style={styles.medicationList}>
        <Text style={styles.medicationHeader}>List of Drug Intake</Text>
        {medications.map(med => (
          <View key={med.id} style={styles.medicationItem}>
            <Text>{med.name}</Text>
            <Button title="Confirm" onPress={() => handleTakeMed(med.id)} />
            <Button title="Set Reminder" onPress={() => handleSetReminder(med.id)} />
          </View>
        ))}
      </View>
    </View>
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
  reminderHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  medicationList: {
    marginVertical: 20,
  },
  medicationHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  medicationItem: {
    marginVertical: 10,
  },
});

export default Tracker;