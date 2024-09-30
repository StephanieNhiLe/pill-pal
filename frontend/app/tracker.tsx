import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { Calendar, DateObject } from 'react-native-multi-date-picker';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
// import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Tracker = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reminder, setReminder] = useState('5 hours till your evening med intake!');
  const [medications, setMedications] = useState([]);
  const [medInfo, setMedInfo] = useState({});

  useEffect(() => { 
    const fetchMedInfo = async () => {
      try {
        const response = await fetch('http://192.168.50.143:8000/get_medication_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chunks: [] }),
        });
        const data = await response.json();
        setMedInfo(data);
      } catch (error) {
        console.error('Error fetching medication information:', error);
      }
    };

    fetchMedInfo();
  }, []);

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
      <Text style={styles.subsubHeader}>Medication Intake Log</Text>
      {Object.keys(medInfo).length === 0 ? (
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
        <ScrollView horizontal style={styles.medicationList}>
          <Text style={styles.medicationHeader}>Medication Intake Log</Text>
          {Object.entries(medInfo).map(([name, info], index) => (
            <View key={index} style={styles.medicationItem}>
              <Text>{name}</Text>
              <Text>Dosage: {info.dosage}</Text>
              <Text>Time: {info.time}</Text>
              <Button title="Confirm" onPress={() => handleTakeMed(index)} />
              <Button title="Set Reminder" onPress={() => handleSetReminder(index)} />
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
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
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