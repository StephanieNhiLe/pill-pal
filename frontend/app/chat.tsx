import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image, FlatList, 
  ActivityIndicator, ActionSheetIOS, Alert} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';

const ChatScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState(''); // State for the input message
  const [messages, setMessages] = useState([]); // State for message history
  const [image, setImage] = useState(null); // State for the selected image
  const [isLoading, setIsLoading] = useState(false); // State to simulate AI response
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false); // Track if the user has sent their first message

  useEffect(() => {
    // Request permissions for accessing the camera and media library
    const requestPermissions = async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        alert('Sorry, we need camera and media library permissions to make this work!');
      }
    };

    requestPermissions();
  }, []);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (message.trim() || image) {
      setHasUserSentMessage(true); // Mark that the user has sent their first message

      // Create a new user message object
      const newMessage = { text: message, image: image, sender: 'user' };
  
      // Update the messages array with the new user message
//       setMessages([...messages, newMessage]);

//       // Clear the input message and image
//       setMessage(''); // Reset the text input to empty
//       setImage(null);

//       // Simulate an AI response with the user's message
//       simulateAiResponse(newMessage);
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
  
      let formData = new FormData();
      formData.append('question', message);
      if (image) {
        const imageUri = image;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('photo', {
          uri: imageUri,
          name: filename,
          type,
        });
      }
  
      try {
        setIsLoading(true);
        console.log('Sending message:', formData);
        const response = await fetch('http://192.168.50.143:8000/ask-question', {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            // Remove 'Content-Type': 'multipart/form-data',
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const aiMessage = { text: data.response, sender: 'AI' };
        
        // Update messages state, keeping previous messages including the user's message
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error sending the message:', error);
        setIsLoading(false);
      }
  
      // Clear the message input and image
      setMessage('');
      setImage(null);
    }
  };  

  // Function to simulate an AI response
  const simulateAiResponse = (userMessage) => {
    setIsLoading(true);
    setTimeout(() => {
      // Create an AI response based on the user message
      const aiResponse = {
        text: userMessage.image ? "What pill is this?" : `AI Response to: ${userMessage.text}`,
        image: userMessage.image ? userMessage.image : null,
        sender: 'AI',
      };
      setMessages([...messages, userMessage, aiResponse]);
      setIsLoading(false);
    }, 2000); // Simulate a 2-second delay for the AI response
  };

  // Function to open the camera and capture an image
  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to open the media library and select an image
  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to handle showing options for adding a prescription
  const handleAddPrescription = () => {
    if (Platform.OS === 'ios') {
      // iOS Action Sheet
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImageFromCamera(); // Take Photo option
          } else if (buttonIndex === 2) {
            pickImageFromGallery(); // Choose from Gallery option
          }
        }
      );
    } else {
      // Android / Web Alert Dialog as a simple implementation
      Alert.alert(
        'Add Prescription',
        'Choose an option',
        [
          {
            text: 'Take Photo',
            onPress: pickImageFromCamera,
          },
          {
            text: 'Choose from Gallery',
            onPress: pickImageFromGallery,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      {/* Top Navigation with Back Button and Menu */}
      <View style={styles.topNavigation}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
  
        <Text style={styles.title}>PillPal.ai</Text>
  
        {/* "Add Prescription" Button */}
        <TouchableOpacity style={styles.addPrescriptionButton} onPress={handleAddPrescription}>
          <Text style={styles.addPrescriptionText}>Add Prescription</Text>
        </TouchableOpacity>
      </View>
  
      {/* Display Description Boxes Before First Message */}
      {!hasUserSentMessage ? (
        <ScrollView contentContainerStyle={styles.introContainer}>
          <Image source={require('../assets/images/PillPal2.png')} style={styles.logo}></Image>
          <Text style={styles.introText}>PillPal.ai helps you put a name to an unknown medication.</Text>
          <Text style={styles.introText}>It identifies prescription or OTC meds you take in solid form by mouth, like tablets or capsules.</Text>
          <Text style={styles.introText}>Simply take a photo of the pill, and PillPal.ai tells you what it might be.</Text>
          <Text style={styles.introText}>It shows you a list of close matches, or it singles out an exact possible match.</Text>
          <Text style={styles.introText}>Each result includes a pill’s picture, its brand and generic names, strength, and other info.</Text>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          {messages.map((item, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                item.sender === 'user' ? styles.userMessage : styles.aiMessage,
              ]}
            >
              {/* Render Markdown text if available */}
              {item.text ? (
                <Text style={styles.messageText}>
                  {item.text}
                </Text>
              ) : null}
  
              {/* Render Image if available */}
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.messageImage} />
              ) : null}
            </View>
          ))}
  
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1241C4" />
              <Text style={styles.loadingText}>AI is generating a response...</Text>
            </View>
          )}
        </ScrollView>
      )}
  
      {/* Floating Input Section */}
      <View style={styles.inputContainer}>
        {/* Camera Button */}
        <TouchableOpacity style={styles.iconButton} onPress={pickImageFromCamera}>
          <Ionicons name="camera" size={24} color="#1241C4" />
        </TouchableOpacity>
  
        {/* Gallery Button */}
        <TouchableOpacity style={styles.iconButton} onPress={pickImageFromGallery}>
          <Ionicons name="image" size={24} color="#1241C4" />
        </TouchableOpacity>
  
        {/* Text Input */}
        <TextInput
          style={styles.input}
          placeholder="Send a message or Take a photo"
          value={message}
          onChangeText={setMessage}
        />
  
        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  topNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  introContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 60
  },
  introText: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#7C7C7C',
    textAlign: 'center',
    width: '90%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 80, // Add margin to prevent overlap with floating bar
  },
  messageContainer: {
    marginVertical: 10,
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 16,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20, // Make the input bar float above the bottom
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 25, // More rounded corners for floating effect
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Add elevation for Android shadow effect
  },
  iconButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#1241C4',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPrescriptionButton: {
    backgroundColor: '#1241C4',
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 7,
  },
  addPrescriptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

const markdownStyles = {
  body: {
    color: '#333',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  list: {
    marginLeft: 20,
  },
  listItem: {
    marginBottom: 5,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
};

export default ChatScreen;
