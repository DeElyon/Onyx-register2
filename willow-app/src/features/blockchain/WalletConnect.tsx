import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../services/firebase/firestore';
import { WalletConnectModal, useWalletConnect } from '@walletconnect/modal-react-native';

const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_ID;
const providerMetadata = {
  name: 'Willow Social',
  description: 'Connect your wallet to Willow',
  url: 'https://willow.social',
  icons: ['https://willow.social/logo.png'],
};

export default function WalletConnect() {
  const { address, isConnected, provider, connect, disconnect } = useWalletConnect();
  const [signature, setSignature] = useState('');

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const signMessage = async () => {
    if (!isConnected) return;
    
    const message = Willow Login: ${Crypto.randomUUID()};
    const sig = await provider.request({
      method: 'personal_sign',
      params: [message, address],
    });
    
    setSignature(sig);
    await saveWalletToProfile(address, sig);
  };

  const saveWalletToProfile = async (walletAddress: string, sig: string) => {
    if (!auth.currentUser) return;
    
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      walletAddress,
      signature: sig,
      lastAuth: new Date()
    });
  };

  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <Text style={styles.address}>
            {${address.slice(0, 6)}...${address.slice(-4)}}
          </Text>
          <TouchableOpacity 
            onPress={signMessage}
            style={styles.signButton}
          >
            <Text style={styles.buttonText}>Verify Ownership</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={disconnect}
            style={styles.disconnectButton}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity 
          onPress={handleConnect}
          style={styles.connectButton}
        >
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </TouchableOpacity>
      )}

      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  address: {
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: '#4B8DF8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signButton: {
    backgroundColor: '#34d399',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  disconnectButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});