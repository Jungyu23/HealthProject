import React, { useState } from 'react';
import {
  View, TextInput, Button, Text, StyleSheet,
  KeyboardAvoidingView, Platform, FlatList, SafeAreaView
} from 'react-native';
import axios from 'axios';
import * as Speech from 'expo-speech';

const ChattingScreen = () => {
  const OPENAI_API_URL = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
  const API_KEY = 'API_KEY';
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessageToGPT = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, isUser: true };

    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          prompt: inputText,
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: { 'Authorization': `Bearer ${API_KEY}` },
        }
      );

      const botMessage = { text: response.data.choices[0].text.trim(), isUser: false };
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    } catch (error) {
      console.error('OpenAI API 호출 오류:', error);
    }

    setInputText('');
  };

  const handleEnterKeyPress = () => {
    sendMessageToGPT();
  };

  const speak = () => {
    const lastBotMessage = messages.filter(message => !message.isUser).pop();
    if (lastBotMessage) {
      Speech.speak(lastBotMessage.text, {
        onDone: () => console.log('Speech has finished'),
        onError: (error) => console.error('Speech error:', error),
        onStart: () => console.log('Speech has started'),
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.message, item.isUser ? styles.user : styles.bot]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          inverted={false}
        />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요"
            onSubmitEditing={handleEnterKeyPress} // 엔터 키를 누를 때의 이벤트 처리
          />
          <Button title="음성출력" onPress={speak} />
          <Button title="전송" onPress={sendMessageToGPT} />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  message: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#BD53E8',
  },
  messageText: {
    color: '#fff',
  },
});

export default ChattingScreen;
