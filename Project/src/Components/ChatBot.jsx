import React, { useState, useRef  } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import axios from 'axios';

const ChatBot = () => {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const indexResponses = useRef(0); 

  const toggleChat = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 550],
  });

  const containerWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['20%', '92%'],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 16],
  });

  async function sendMessageToChatGPT(message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ` + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", 
            messages: [{ role: "user", content: message }],
        }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  const handleSend = async () => {
    if (message.trim().length > 0) {
        
        const userMessage = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setMessage('');

        try {
            // API de ChatGPT
            const responseText = await sendMessageToChatGPT(userMessage.text);

            // Respuesta de la API al chat
            const aiMessage = {
                id: Date.now().toString(),
                text: responseText,
                sender: 'ai',
            };

            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error('Error al obtener la respuesta de ChatGPT:', error);

            // Mensaje de error en caso de fallo
            const errorMessage = {
                id: Date.now().toString(),
                text: 'Hubo un error al obtener la respuesta. Por favor, intenta de nuevo.',
                sender: 'ai',
            };

            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        {
          alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start', // Alineación dinámica
          backgroundColor: item.sender === 'user' ? '#dcf8c6' : '#e1ffc7', // Colores diferentes
        },
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Animated.View
        style={[
          styles.chatContainer,
          {
            height: containerHeight,
            width: containerWidth,
            borderRadius: borderRadius,
          },
        ]}
      >
        <TouchableOpacity style={styles.toggleButton} onPress={toggleChat}>
          {expanded ? (
            <Text style={styles.buttonText}>Cerrar</Text>
          ) : (
            <Image
              source={require('../../assets/images/chatBotBlanco.png')} // Reemplaza con la ruta de tu imagen
              style={styles.buttonImage}
            />
          )}
        </TouchableOpacity>


        {expanded && (
          <View style={styles.chatContent}>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContainer}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe tu mensaje..."
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
    overflow: 'hidden',
    zIndex: 1,
  },
  toggleButton: {
    height: 80,
    backgroundColor: '#4C64D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: 8,
  },
  messageContainer: {
    maxWidth: '70%',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  messageText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4C64D8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonImage: {
    width: 50, // Ancho de la imagen
    height: 50, // Altura de la imagen
    resizeMode: 'contain', // Ajusta la imagen para que no se distorsione
  },
});

export default ChatBot;
