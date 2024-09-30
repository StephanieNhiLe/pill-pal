import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from 'react-native-vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { ProgressBar } from 'react-native-paper'; // You need to install 'react-native-paper' for the progress bar

const ProfileScreen = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const [selected, setSelected] = useState('home'); // Track the selected icon
  
    React.useEffect(() => {
      // Hide the header when this screen is focused
      navigation.setOptions({ headerShown: false });
    }, [navigation]);

  return (
    <View style={styles.container}>
        <ScrollView style={styles.scrollcontent}>
        {/* Top Navigation */}
        <View style={styles.topNavigation}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            {/* <Text style={styles.title}>Profile</Text> */}
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
            <Text style={styles.profileName}>Caleb Hillson</Text>
            <Text style={styles.profileEmail}>calebhill@gmail.com</Text>
        </View>

        {/* Preferences */}
        <TouchableOpacity style={styles.optionContainer}>
            <View style={styles.option}>
            <Ionicons name="settings-outline" size={24} color="#1241C4" />
            <Text style={styles.optionText}>Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>

        {/* Account Security */}
        <TouchableOpacity style={styles.optionContainer}>
            <View style={styles.option}>
            <Ionicons name="lock-closed-outline" size={24} color="#1241C4" />
            <View style={styles.securitySection}>
                <Text style={styles.optionText}>Account Security</Text>
                <ProgressBar progress={0.8} color="#1241C4" style={styles.progressBar} />
                <Text style={styles.securityStatus}>Excellent</Text>
            </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>

        {/* Customer Support */}
        <TouchableOpacity style={styles.optionContainer}>
            <View style={styles.option}>
            <Ionicons name="help-circle-outline" size={24} color="#1241C4" />
            <Text style={styles.optionText}>Customer Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.optionContainer}>
            <View style={styles.option}>
            <Ionicons name="log-out-outline" size={24} color="#1241C4" />
            <Text style={styles.optionText}>Logout</Text>
            </View>
        </TouchableOpacity>
        </ScrollView>
        {/* Bottom Navigation */}
        {/* <View style={styles.bottomNav}> */}
            {/* Home Icon */}
            {/* <TouchableOpacity onPress={() => router.push('/') } style={styles.navIcon}>
            <Ionicons
                name="home"
                size={30}
                color={selected === 'home' ? '#1241C4' : '#D0D0D0'}
            />
            </TouchableOpacity> */}

            {/* Explore Icon */}
            {/* <TouchableOpacity onPress={() => setSelected('search')} style={styles.navIcon}>
            <Ionicons
                name="search"
                size={30}
                color={selected === 'search' ? '#1241C4' : '#D0D0D0'}
            />
            </TouchableOpacity> */}

            {/* Notifications Icon */}
            {/* <TouchableOpacity onPress={() => setSelected('notifications')} style={styles.navIcon}>
            <Ionicons
                name="notifications"
                size={30}
                color={selected === 'notifications' ? '#1241C4' : '#D0D0D0'}
            />
            </TouchableOpacity> */}

            {/* Profile Icon */}
            {/* <TouchableOpacity onPress={() => router.push('/profile')} style={styles.navIcon}>
            <Ionicons
                name="person"
                size={30}
                color={selected === 'profile' ? '#1241C4' : '#D0D0D0'}
            />
            </TouchableOpacity> */}
        {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollcontent: {
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'center',
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
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 15,
  },
  securitySection: {
    flexDirection: 'column',
  },
  progressBar: {
    width: 150,
    height: 6,
    borderRadius: 5,
    marginVertical: 5,
  },
  securityStatus: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 5,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navIcon: {
    padding: 15, // Added padding to the icons for better spacing
  },
});

export default ProfileScreen;
