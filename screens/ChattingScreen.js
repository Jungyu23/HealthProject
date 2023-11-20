import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, KeyboardAvoidingView, Platform, FlatList, SafeAreaView
 } from 'react-native';
import axios from 'axios';

const ChattingScreen = () => {
    const OPENAI_API_URL = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
    const API_KEY = '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';
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
  
    const sendMessageToGPT = async () => {
        if (!inputText.trim()) return;
  
        const userMessage = { text: inputText, isUser: true };
        setMessages([...messages, userMessage]);
  
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
            setMessages(messages => [...messages, userMessage, botMessage]);
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
        }
        setInputText('');
    };
  
    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.message, item.isUser ? styles.user : styles.bot]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                inverted
            />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Write a message"
                />
                <Button title="Send" onPress={sendMessageToGPT} />
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
        backgroundColor: '#e5e5ea',
    },
    messageText: {
        color: '#fff',
    },
})
  
export default ChattingScreen;