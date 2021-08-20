import React, {useState, useEffect, useRef} from 'react';
import { StatusBar, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
import {Camera} from 'expo-camera';
import {FontAwesome} from '@expo/vector-icons';

export default function App() {

  const camRef = useRef(null);
  
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View/>;
  }
  if (hasPermission === false) {
    return <Text> Acesso Negado! </Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
      console.log(data);
    }
  }

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="#000"/>
    <SafeAreaView style={styles.container}>
      <Camera 
        style={{ flex: 1 }}
        type={type}
        ref={camRef}
      >
        <View style={{flex: 1, backgroundColor: 'Transparent', flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              padding: 5,
              backgroundColor: '#000',
              borderRadius: 5,
            }}
            onPress={ () => {
              setType(
                type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 20, color: '#FFF'}}><FontAwesome name="refresh" size={20} color="#FFF" />  Switch Camera</Text>
          </TouchableOpacity>
        </View>
      <TouchableOpacity style={styles.button} onPress={ takePicture }>
        <FontAwesome name="camera" size={25} color="#FFF"/>
      </TouchableOpacity>
      </Camera>

      { capturedPhoto &&
        <Modal
        animationType="slide"
        transparent={false}
        visible={open}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>
            <TouchableOpacity style={{margin: 10}} onPress={ () => setOpen(false)}>
              <FontAwesome name="window-close" size={50} color="#FF0000"/>
            </TouchableOpacity>
            <Image
              style={{ width: '100%', height: 300, borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
            />
          </View>
        </Modal>
      }

    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    margin: 20,
    borderRadius: 10,
    height: 50,
  }
});
