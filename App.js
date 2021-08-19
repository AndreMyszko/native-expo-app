import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import {Camera} from 'expo-camera';

export default function App() {

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);

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

  return (
    <SafeAreaView style={styles.container}>
      <Camera 
        style={{ flex: 1 }}
        type={type}
      >
        <View style={{flex: 1, backgroundColor: 'Transparent', flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
            }}
            onPress={ () => {
              setType(
                type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 13, color: '#FFF'}}>Switch Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
