import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import the correct Ionicons

const WelcomeScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [selected, setSelected] = useState('home'); // Track the selected icon

  // Hide the header for this screen
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/PillPal2.png')} style={styles.logo} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.appName}>PillPal</Text>

      {/* Description */}
      <Text style={styles.description}>
        Start chatting with PillPal now.{"\n"}Ask me anything about your medication.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/chat')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Home Icon */}
        <TouchableOpacity onPress={() => setSelected('home')} style={styles.navIcon}>
          <Ionicons
            name="home"
            size={30}
            color={selected === 'home' ? '#1241C4' : '#D0D0D0'}
          />
        </TouchableOpacity>

        {/* Explore Icon */}
        <TouchableOpacity onPress={() => setSelected('search')} style={styles.navIcon}>
          <Ionicons
            name="search"
            size={30}
            color={selected === 'search' ? '#1241C4' : '#D0D0D0'}
          />
        </TouchableOpacity>

        {/* Notifications Icon */}
        <TouchableOpacity onPress={() => setSelected('notifications')} style={styles.navIcon}>
          <Ionicons
            name="notifications"
            size={30}
            color={selected === 'notifications' ? '#1241C4' : '#D0D0D0'}
          />
        </TouchableOpacity>

        {/* Profile Icon */}
        <TouchableOpacity onPress={() => setSelected('profile')} style={styles.navIcon}>
          <Ionicons
            name="person"
            size={30}
            color={selected === 'profile' ? '#1241C4' : '#D0D0D0'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 180,
  },
  logoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
  },
  appName: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#1241C4',
    marginTop: 5,
  },
  description: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    color: '#7C7C7C',
    marginHorizontal: 20,
    marginTop: 30,
  },
  button: {
    marginTop: 60,
    backgroundColor: '#1241C4',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navIcon: {
    padding: 15, // Added padding to the icons for better spacing
  },
});

export default WelcomeScreen;
