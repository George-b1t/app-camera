import {
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
  const camRef = useRef(null);

  const { width } = useWindowDimensions();
  const height = Math.round((width * 16) / 9);

  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = useState(null);

  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Acesso negado!</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();

      setCapturedPhoto(data.uri);

      setOpen(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={{ width: "100%", height: height }}
        ratio="16:9"
        type={type}
        ref={camRef}
      />
      <View style={styles.fieldTakePicture}>
        <TouchableOpacity
          style={styles.buttonTakePicture}
          onPress={() => {
            setType(
              type === CameraType.back ? CameraType.front : CameraType.back
            );
          }}
        >
          <Ionicons name="camera-reverse-outline" size={20} />
        </TouchableOpacity>
        <View style={{ marginHorizontal: 10 }} />
        <TouchableOpacity
          style={styles.buttonTakePicture}
          onPress={() => takePicture()}
        >
          <Feather name="camera" size={20} />
          <Text style={{ marginLeft: 10 }}>Tirar foto</Text>
        </TouchableOpacity>
      </View>

      {capturedPhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <TouchableOpacity
              style={{
                ...styles.buttonTakePicture,
                backgroundColor: "#000",
                marginBottom: 20,
              }}
              onPress={() => setOpen(false)}
            >
              <Text style={{ color: "#fff" }}>Fechar</Text>
            </TouchableOpacity>

            <Image
              style={{ width: "100%", height: 600, borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  fieldTakePicture: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTakePicture: {
    height: 50,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
