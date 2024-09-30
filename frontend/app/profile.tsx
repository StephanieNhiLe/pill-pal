import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Linking, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useRouter, useNavigation } from 'expo-router';

import Profile from '../assets/images/profile.png';

const ProfileScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [selected, setSelected] = useState('home'); // Track the selected icon

  // State to manage profile details
  const [age, setAge] = useState('28');
  const [weight, setWeight] = useState('70 kg');
  const [height, setHeight] = useState('175 cm');
  const [emergencyContact, setEmergencyContact] = useState('+1 234 567 8901');
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode

  React.useEffect(() => {
    // Hide the header when this screen is focused
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Function to handle phone call linking
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      Alert.alert('Error', 'Unable to place call. Please check your phone settings.')
    );
  };

  // Toggle between edit and view mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Navigation */}
        <View style={styles.topNavigation}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
            <Ionicons name={isEditing ? "checkmark-done" : "create-outline"} size={24} color="#1241C4" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={Profile} style={styles.profileImage} />
          <Text style={styles.profileName}>Caleb Hillson</Text>
          <Text style={styles.profileEmail}>calebhill@gmail.com</Text>
        </View>

        {/* Editable Fields */}
        <View style={styles.infoContainer}>
          {/* Age Field */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={(text) => setAge(text)}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{age}</Text>
            )}
          </View>

          {/* Weight Field */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Weight</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={(text) => setWeight(text)}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{weight}</Text>
            )}
          </View>

          {/* Height Field */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Height</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={(text) => setHeight(text)}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{height}</Text>
            )}
          </View>

          {/* Emergency Contact Field */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Emergency Contact</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={emergencyContact}
                onChangeText={(text) => setEmergencyContact(text)}
                keyboardType="phone-pad"
              />
            ) : (
              <TouchableOpacity onPress={() => handleCall(emergencyContact)}>
                <Text style={[styles.infoValue, styles.linkText]}>{emergencyContact}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Add bottom padding to avoid overlapping with bottom nav
  },
  topNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  profileEmail: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  infoContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontSize: 18,
    color: '#000000',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1241C4',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    fontSize: 18,
    padding: 5,
    width: 150,
    color: '#333',
  },
  linkText: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10, // Add elevation for Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  navIcon: {
    padding: 10, // Adjust padding for better spacing around icons
  },
});

export default ProfileScreen;
