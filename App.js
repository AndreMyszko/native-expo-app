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
              left: 5,
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
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              padding: 5,
              backgroundColor: '#000',
              borderRadius: 5,
            }}
          >
            <Text><FontAwesome name="cog" size={26} color="#FFF" /></Text>
          </TouchableOpacity>

        </View>
      <TouchableOpacity style={styles.button} onPress={ takePicture }>
        <FontAwesome name="video-camera" size={25} color="#FFF"/>
      </TouchableOpacity>
      </Camera>

      { capturedPhoto &&
        <Modal
        animationType="slide"
        transparent={false}
        visible={open}
        >
          <View style={{ flex: 1, backgroundColor:'#000', justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{ width: '100%', height: 300, borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
            />
            <Text>
              <TouchableOpacity style={{backgroundColor: '#64F093', borderRadius: 5}} onPress={ () => setOpen(false)}>
                <FontAwesome name="check" size={45} color="#FFF"/>
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: '#FF5C5C', borderRadius: 5}} onPress={ () => setOpen(false)}>
                <FontAwesome name="close" size={45} color="#FFF" style={{width: 47, textAlign: 'center'}}/>
              </TouchableOpacity>
            </Text>
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
    alignSelf: 'center',
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 180,
    width: 55,
    height: 55,
  }
});
