import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import ChatScreen from './chat';
import TrackerScreen from './tracker';
import ProfileScreen from './profile';
import AddMedLogForm from './AddMedLogForm';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Tracker') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Med Log') {
            iconName = focused ? 'bandage' : 'bandage-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1241C4',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [{ display: 'flex' }, null],
      })}
    //   tabBarOptions={{
    //     activeTintColor: '#1241C4',
    //     inactiveTintColor: 'gray',
    //   }}
    
    >
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ headerShown: false }}  
      />
      <Tab.Screen 
        name="Tracker" 
        component={TrackerScreen} 
        options={{ headerShown: false }}  
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: false }}  
      />
      <Tab.Screen 
        name="Med Log" 
        component={AddMedLogForm} 
        options={{ headerShown: false }}  
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;