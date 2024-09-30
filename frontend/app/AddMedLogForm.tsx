import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddMedLogForm = () => {
  const navigation = useNavigation();
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  const handleAddMedLog = () => {
    if (medName && dosage && time) {
      // Logic to add medication log
      Alert.alert('Medication Log Added', `Name: ${medName}, Dosage: ${dosage}, Time: ${time}`);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Your Medication Log</Text>
      <TextInput
        style={styles.input}
        placeholder="Medication Name"
        value={medName}
        onChangeText={setMedName}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosage"
        value={dosage}
        onChangeText={setDosage}
      />
      <TextInput
        style={styles.input}
        placeholder="Time"
        value={time}
        onChangeText={setTime}
      />
      <Button title="Add Medication Log" onPress={handleAddMedLog} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddMedLogForm;