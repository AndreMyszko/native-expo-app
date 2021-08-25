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

import Alfabeto from './assets/img/AlfabetoLibras.png'
import Numeros from './assets/img/NumerosLibras.png'
import ManualVideo from './assets/img/ManualVideoSensor.png'
import ManualSwitch from './assets/img/ManualSwitchCamera.png'
import ManualText from './assets/img/ManualTextArea.png'
import ManualClear from './assets/img/ManualClearText.png'
import ManualStart from './assets/img/ManualStartStop.png'

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
          <FontAwesome name="info-circle" size={40} color="#3FC5F6"/>
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
        editable={false}
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
          <ScrollView style={{backgroundColor: '#000'}}>
            <View>
              <TouchableOpacity style={{backgroundColor: '#FF5C5C', borderRadius: 5, alignSelf: 'flex-end', position: 'absolute', top: 10, right: 10, paddingHorizontal: 6,}} onPress={ () => setInfoModal(false)}>
                <FontAwesome name="close" size={40} color="#FFF" style={{}} />
              </TouchableOpacity>
            </View>
            <View style={[styles.infoContent, {marginTop: 23}]}>
              <Text style={{color: '#FFF', fontSize: 25,}}><FontAwesome name="map" size={20} color="#FFF"/> GLOSSÁRIO</Text>
              <Image source={Alfabeto} style={{
                height: 420,
                width: 340,
                marginTop: 10,
              }}/>
              <Image source={Numeros} style={{
                height: 165,
                width: 340,
              }}/>
            </View>
            <View style={[styles.infoContent, {marginTop: 20, paddingTop: 30, backgroundColor: '#222', width: '100%'}]}>
              <Text style={{color: '#FFF', fontSize: 25,}}><FontAwesome name="book" size={30} color="#FFF"/> MANUAL </Text>
              <Text style={{color: '#FFF', fontSize: 15, width: 340, marginBottom: 10}}>Bem vindo ao manual simplificado e-libras de aprendizado de sinais básicos em libras, aqui irá encontrar o que precisa saber para utilizar este aplicativo! </Text>

              <View style={{backgroundColor: '#000', padding: 10, borderRadius: 8,}}>
                <Text style={{color: '#FFF', fontSize: 18,}}><FontAwesome name="image" size={50} color="#FFF"/> Imagem </Text>
                <Text style={{color: '#FFF', fontSize: 15, width: 340}}>Apenas o movimento da sua mão direita será considerado para o retorno em texto, como mostra a imagem abaixo: </Text>
                <Image source={ManualVideo} style={{
                  height: 165,
                  width: 340,
                  marginTop: 10,
                  marginBottom: 10,
                }}/>
                <Text style={{color: '#FFF', fontSize: 18, marginTop:10,}}><FontAwesome name="refresh" size={25} color="#FFF"/> Switch de Câmera </Text>
                <Text style={{color: '#FFF', fontSize: 15, width: 340}}>O botão responsável pela troca de câmera entre frontal ou traseira está localizado na parte inferior da tela, como mostra a imagem abaixo: </Text>
                <Image source={ManualSwitch} style={{
                  height: 130,
                  width: 340,
                  marginTop: 10,
                  marginBottom: 10,
                }}/>
              </View>

              <View style={{backgroundColor: '#000', padding: 10, borderRadius: 8, width: 360, marginTop: 10,}}>
                <Text style={{color: '#FFF', fontSize: 18,}}><FontAwesome name="file-text" size={50} color="#FFF"/> Texto </Text>
                <Text style={{color: '#FFF', fontSize: 15, width: 340}}>Quando um sinal é captado pela câmera, este será transformado em texto e apresentado na parte inferior da tela, como mostra a imagem abaixo: </Text>
                <Image source={ManualText} style={{
                  height: 130,
                  width: 340,
                  marginTop: 10,
                  marginBottom: 10,
                }}/>
                <Text style={{color: '#FFF', fontSize: 18, marginTop:10,}}><FontAwesome name="trash" size={25} color="#FFF"/> Limpar Texto </Text>
                <Text style={{color: '#FFF', fontSize: 15, width: 340}}>Também é possível limpar o campo de texto pressionando o botão localizado ao lado direito inferior da tela, como mostra a imagem abaixo: </Text>
                <Image source={ManualClear} style={{
                  height: 130,
                  width: 340,
                  marginTop: 10,
                  marginBottom: 10,
                }}/>
              </View>

              <View style={{backgroundColor: '#000', padding: 10, borderRadius: 8, width: 360, marginTop: 10, marginBottom: 10,}}>
                <Text style={{color: '#FFF', fontSize: 18,}}><FontAwesome name="play" size={25} color="#FFF"/> <FontAwesome name="stop" size={25} color="#FFF"/> Start e Pause </Text>
                <Text style={{color: '#FFF', fontSize: 15, width: 340}}>O botão de start e pause são os mesmo, se encontram na mesma posição, como mostra a imagem abaixo: </Text>
                <Image source={ManualStart} style={{
                  height: 130,
                  width: 340,
                  marginTop: 10,
                  marginBottom: 10,
                }}/>
              </View>

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
  infoContent: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
