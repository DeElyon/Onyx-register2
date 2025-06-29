import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { GLView } from 'expo-gl';

export default function ARCameraScreen() {
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) return <View />;

    return (
        <GLView style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} />
            {/* AR Filter Overlays Here */}
        </GLView>
    );
}