import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { analyzeText } from '../../services/ai/openai';

export default function AIContentAssistant({ 
  onSuggestionAccepted 
}: {
  onSuggestionAccepted: (text: string) => void;
}) {
  const [inputText, setInputText] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestion = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await analyzeText(inputText);
      setSuggestion(result);
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="What's on your mind?"
        value={inputText}
        onChangeText={setInputText}
        multiline
        style={styles.input}
      />

      <TouchableOpacity 
        onPress={generateSuggestion}
        disabled={isLoading}
        style={styles.aiButton}
      >
        <Ionicons 
          name="sparkles" 
          size={20} 
          color={isLoading ? '#ccc' : '#4B8DF8'} 
        />
        <Text style={styles.buttonText}>
          {isLoading ? 'Thinking...' : 'AI Enhance'}
        </Text>
      </TouchableOpacity>

      {suggestion && (
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionText}>{suggestion}</Text>
          <TouchableOpacity
            onPress={() => {
              onSuggestionAccepted(suggestion);
              setSuggestion('');
            }}
            style={styles.acceptButton}
          >
            <Text style={styles.acceptText}>Use This</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    marginBottom: 10,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    marginLeft: 5,
    color: '#4B8DF8',
  },
  suggestionBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#4B8DF8',
    paddingLeft: 10,
    marginTop: 10,
  },
  suggestionText: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  acceptButton: {
    alignSelf: 'flex-end',
  },
  acceptText: {
    color: '#4B8DF8',
    fontWeight: 'bold',
  },
});
