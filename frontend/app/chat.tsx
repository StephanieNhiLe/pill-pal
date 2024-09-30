import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const ChatScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState(''); // State for the input message
  const [messages, setMessages] = useState([]); // State for message history
  const [image, setImage] = useState(null); // State for the selected image
  const [isLoading, setIsLoading] = useState(false); // State to simulate AI response

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
  const handleSendMessage = () => {
    if (message.trim() || image) {
      // Create a new user message object
      const newMessage = { text: message, image: image, sender: 'user' };

      // Update the messages array with the new user message
      setMessages([...messages, newMessage]);

      // Simulate an AI response with the user's message
      simulateAiResponse(newMessage);

      // Clear the selected image but keep the message in the input field
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
      allowsEditing: true,
      aspect: [4, 3],
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
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
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
        <Text style={styles.title}>PillPal</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.content}>
        {messages.map((item, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            {/* Render text message */}
            {item.text ? <Text style={styles.messageText}>{item.text}</Text> : null}

            {/* Render image message */}
            {item.image ? <Image source={{ uri: item.image }} style={styles.messageImage} /> : null}
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#1241C4" />
            <Text style={styles.loadingText}>AI is generating a response...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
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
});

export default ChatScreen;
