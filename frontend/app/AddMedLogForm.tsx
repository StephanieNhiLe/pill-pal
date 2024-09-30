import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useMedication } from '@/components/MedicationContext';

const AddMedLogForm = () => {
  const navigation = useNavigation();
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { medications, setMedications } = useMedication();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const handleAddMedLog = () => {
    if (medName && dosage && time) {
      Alert.alert('Medication Log Added', `Name: ${medName}, Dosage: ${dosage}, Time: ${time}`);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const handleClearImage = () => {
    setImage(null);
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (image) {
      let formData = new FormData();
      const imageUri = image;
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('file', {
        uri: imageUri,
        name: filename,
        type,
      });
  
      try {
        setIsLoading(true);
        console.log('Sending message:', formData);
        const response = await fetch('http://192.168.50.143:8000/add-prescription', {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Message sent:', data[0].medication_info);
  
        // Process the received medication data
        const newMedications = Object.entries(data[0].medication_info).map(([name, info]) => ({
          name,
          dosage: info.dosage,
          time: info.time
        }));
  
        // Update the medications context
        setMedications(prevMedications => [...prevMedications, ...newMedications]);
  
        Alert.alert('Success', 'Prescription saved successfully');
      } catch (error) {
        console.error('Error sending the message:', error);
        Alert.alert('Error', 'Failed to save prescription');
      } finally {
        setIsLoading(false);
        setImage(null);
      }
    }
  };  

  const pickImage = async (source) => {
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      console.log('Image selected:', result.assets[0].uri);
    }
  };

  const handlePrescriptionAction = () => {
    if (image) {
      Alert.alert('Prescription Saved', 'Your prescription has been saved successfully.');
      console.log('Prescription saved:', image);
    } else {
      Alert.alert(
        'Add Prescription',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: () => pickImage('camera') },
          { text: 'Choose from Gallery', onPress: () => pickImage('gallery') },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
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
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosage"
        value={dosage}
        onChangeText={setDosage}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Time"
        value={time}
        onChangeText={setTime}
        editable={!isLoading}
      />
      <Button title="Add Medication Log" onPress={handleAddMedLog} disabled={isLoading} />
      
      <View style={styles.prescriptionContainer}>
        <TouchableOpacity 
          style={styles.imageContainer} 
          onPress={handlePrescriptionAction}
          disabled={isLoading}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.prescriptionImage} />
          ) : (
            <Text style={styles.noImageText}>No Image</Text>
          )}
        </TouchableOpacity>
        {image && (
          <TouchableOpacity 
            style={styles.clearImageButton} 
            onPress={handleClearImage}
            disabled={isLoading}
          >
            <Text style={styles.clearImageIcon}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {image ? (
        <TouchableOpacity 
          style={styles.prescriptionButton} 
          onPress={handleSendMessage}
          disabled={isLoading}
        >
          <Text style={styles.prescriptionButtonText}>SAVE PRESCRIPTION</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.prescriptionButton} 
          onPress={handlePrescriptionAction}
          disabled={isLoading}
        >
          <Text style={styles.prescriptionButtonText}>ADD PRESCRIPTION</Text>
        </TouchableOpacity>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
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
  prescriptionContainer: {
    height: 200,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearImageButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearImageIcon: {
    fontSize: 20,
  },
  noImageText: {
    color: '#999',
  },
  prescriptionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  prescriptionButton: {
    backgroundColor: '#1241C4',
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 2,
    width: '100%',
    marginTop: 10,
    height: 40,
  },
  prescriptionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default AddMedLogForm;