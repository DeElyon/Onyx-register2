import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'chats'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map(doc => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    await addDoc(collection(db, 'chats'), {
      _id,
      createdAt: serverTimestamp(),
      text,
      user
    });
  }, []);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#4B8DF8'
        },
        left: {
          backgroundColor: '#f0f0f0'
        }
      }}
    />
  );

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendContainer}>
        <Ionicons name="send" size={24} color="#4B8DF8" />
      </View>
    </Send>
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: user?.uid || '',
        name: user?.displayName || '',
        avatar: user?.photoURL || ''
      }}
      renderBubble={renderBubble}
      renderSend={renderSend}
      alwaysShowSend
      scrollToBottom
    />
  );
}

const styles = StyleSheet.create({
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
});
