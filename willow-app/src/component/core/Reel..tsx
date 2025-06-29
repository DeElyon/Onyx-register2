import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicon } from '@expo/vector-icons';

interface ReelProps {
    reel: {
        id: string;
        videoUrl: string;
        likes: number;
        caption: string;
        user: {
            username: string;
            avatar: string;
        };
    };
    isActive: boolean;
}

export default function Reel({ reel, isActive }: ReelProps) {
    const videoref = useRef<Video>(null);

    useEffect(() => {
        if (isActive) {
            videoRef.current?.playAsync();
        } else {
            videoRef.current?.pauseAsync();
        }
    }, [isActive]);

    return (
        <View style={style.container}>
            <Video
            ref={videoRef}
            source={{ uri: reel.videoUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            isLooping
            shouldPlay={false}
             />

        <View style={style.overlay}>
            {/* Right Action Bar */}
            <View style={styles.rightBar}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart" size={32} color="white" />
                    <Text style={styles.actionText}>{reel.likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.actionButton}>
                    <Ionicons name="chatbubble" size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="arrow-redo" size={28} color="white" />
                </TouchableOpacity>
            </View>

        {/* Bottom Caption */}
        <View style={styles.bottomBar}>
            <Text style={styles.username}>@{reel.user.username}</Text>
            <Text style={styles.caption}>{reel.caption}</Text>
        </View>
    </View>
    </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 16,
    },
    rightBar: {
        postion: 'absolute',
        right: 16,
        bottom: 100,
        alignItems: 'center',
    },
    actionButton: {
        marginBottom: 24,
        alignItems: 'center',
    },
    actionText: {
        color: 'white',
        marginTop: 4,
    },
    bottomBar: {
        marginBottom: 50,
    },
    username: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    caption: {
        color: 'white',
        marginTop: 8,
    },
});