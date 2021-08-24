import React, {
  useState, 
  useEffect, 
  useRef,
} from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal, 
  Image, 
  TextInput,
  ScrollView,
} from 'react-native';
import {Camera} from 'expo-camera';
import {FontAwesome} from '@expo/vector-icons';

export default function App() {

  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);
  
  const [infoModal, setInfoModal] = useState(null);
  const [openInfo, setOpenInfo] = useState(null);

  const [text, onChangeText] = React.useState(null);

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
      setOpenCamera(true);
      console.log(data);
    }
  }

  async function goToInfoPage() {
    setInfoModal(true);
    setOpenInfo(true);
    console.log("*info modal*");
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
        <TouchableOpacity style={[styles.button, {alignSelf: 'flex-end'}]} onPress={ goToInfoPage }>
          <FontAwesome name="info-circle" size={30} color="#000"/>
        </TouchableOpacity>

        <View style={styles.bottomCenter}>

          <TouchableOpacity style={styles.button}>
            <FontAwesome name="trash" size={20} color="#000"/>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, {width:70, height:70,}]} onPress={ takePicture }>
            <FontAwesome name="video-camera" size={40} color="#000"/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} 
            onPress={ () => {
              setType(
                type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
              );
            }}>
            <FontAwesome name="refresh" size={20} color="#000"/>
          </TouchableOpacity>

        </View>

      </Camera>

      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="aguardando para traduzir..."
      />

      { capturedPhoto &&
        <Modal
        animationType="slide"
        transparent={false}
        visible={openCamera}
        >
          <View style={{ flex: 1, backgroundColor:'#000', justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{ width: '100%', height: 300, borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
            />
            <Text>
              <TouchableOpacity style={{backgroundColor: '#64F093', borderRadius: 5}} onPress={ () => setOpenCamera(false)}>
                <FontAwesome name="check" size={45} color="#FFF"/>
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: '#FF5C5C', borderRadius: 5}} onPress={ () => setOpenCamera(false)}>
                <FontAwesome name="close" size={45} color="#FFF" style={{width: 47, textAlign: 'center'}}/>
              </TouchableOpacity>
            </Text>
          </View>
        </Modal>
      }

      { infoModal &&
        <Modal
        animationType="slide"
        transparent={false}
        visible={openInfo}
        >
          <ScrollView>
            <View>
              <Text>Hello World!</Text>
              <Text>By: Wololooo</Text>
            </View>
          </ScrollView>
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
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 180,
    width: 40,
    height: 40,
    margin: 5,
    marginBottom: 0,
  },
  bottomCenter: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 150,
  },
  input: {
    height: 40,
    paddingHorizontal: 15,
  },
});
