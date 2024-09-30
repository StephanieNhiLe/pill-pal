// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1241C4',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Default header visibility for all tabs
      })}
    >
      {/* Home Screen */}
      <Tabs.Screen name="index" options={{ title: 'Home' }} />

      {/* Chat Screen */}
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />

      {/* Profile Screen - Hide Header */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false, // Set this to false to hide the header for the Profile screen
        }}
      />
    </Tabs>
  );
}
