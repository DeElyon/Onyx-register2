import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/firestore';
import { useAuth } from '../../context/AuthContext';

interface Participant {
  id: string;
  name: string;
  isSpeaking: boolean;
  isModerator: boolean;
}

export default function AudioRoom({ roomId }: { roomId: string }) {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const roomRef = collection(db, 'audioRooms', roomId, 'participants');
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Participant[];
      setParticipants(users);
    });
    return unsubscribe;
  }, [roomId]);

  const toggleMic = async () => {
    if (!user) return;
    const participantRef = doc(db, 'audioRooms', roomId, 'participants', user.uid);
    await updateDoc(participantRef, {
      isSpeaking: !isMuted
    });
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Audio Room</Text>
      
      <View style={styles.participantsContainer}>
        {participants.map(participant => (
          <View key={participant.id} style={styles.participantCard}>
            <Ionicons 
              name="person-circle" 
              size={40} 
              color={participant.isSpeaking ? '#4B8DF8' : '#888'} 
            />
            <Text style={styles.participantName}>
              {participant.name}
              {participant.isModerator && ' (Host)'}
            </Text>
            {participant.isSpeaking && (
              <View style={styles.speakingIndicator} />
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.micButton, isMuted && styles.micButtonMuted]}
        onPress={toggleMic}
      >
        <Ionicons 
          name={isMuted ? 'mic-off' : 'mic'} 
          size={28} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  participantsContainer: {
    flex: 1,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  participantName: {
    marginLeft: 10,
    flex: 1,
  },
  speakingIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4B8DF8',
  },
  micButton: {
    alignSelf: 'center',
    backgroundColor: '#4B8DF8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  micButtonMuted: {
    backgroundColor: '#ff4444',
  },
});
