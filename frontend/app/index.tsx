import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/PillPal.png')} style={styles.logo} />
      </View>

      {/* Title */}
      <Text style={styles.appName}>Welcome to</Text>
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
        <View style={styles.navIcon}></View>
        <View style={styles.navIcon}></View>
        <View style={styles.navIcon}></View>
        <View style={styles.navIcon}></View>
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
    paddingTop: 120,
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
    marginTop: 40,
    fontSize: 26,  // Increased font size
    fontWeight: '400',
    color: '#333333',
  },
  appName: {
    fontSize: 38,  // Increased font size for the app name
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
  },
  description: {
    textAlign: 'center',
    fontSize: 18,  // Slightly increased font size for readability
    lineHeight: 24,  // Improved line height for better text spacing
    color: '#7C7C7C',
    marginHorizontal: 50,  // Reduced horizontal margin to make text tighter
    marginTop: 20,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#000000',
    borderRadius: 30,  // More rounded corners for the button
    paddingVertical: 18,  // Increased vertical padding
    paddingHorizontal: 60,  // Increased horizontal padding for a larger button
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,  // Slightly increased button text size
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 25,  // Increased padding for a taller navbar
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',  // Added border to separate navbar from the screen
  },
  navIcon: {
    width: 30,  // Increased icon size
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D0D0D0',
  },
});

export default WelcomeScreen;
