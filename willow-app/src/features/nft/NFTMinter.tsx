import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { mintNFT } from '../../services/blockchain/web3';
import { uploadToIPFS } from '../../services/api/storage';

export default function NFTMinter() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleMint = async () => {
    if (!image || !name) return;
    
    setIsMinting(true);
    try {
      // 1. Upload to IPFS
      const ipfsHash = await uploadToIPFS(image);
      
      // 2. Mint NFT on blockchain
      const tx = await mintNFT({
        name,
        description,
        imageUrl: ipfs://${ipfsHash}
      });
      
      alert(NFT Minted! TX Hash: ${tx});
    } catch (error) {
      console.error('Minting error:', error);
      alert('Minting failed');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text>Select Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="NFT Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, { height: 100 }]}
      />

      <TouchableOpacity 
        onPress={handleMint} 
        disabled={isMinting}
        style={styles.mintButton}
      >
        <Text style={styles.buttonText}>
          {isMinting ? 'Minting...' : 'Mint NFT'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imagePicker: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  mintButton: {
    backgroundColor: '#4B8DF8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
