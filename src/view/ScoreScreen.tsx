import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ScoreScreen({ navigation }) {
  
  const [Jugador, setJugador] = useState('');
  const [Puntaje, setPuntaje] = useState(0);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const JugadorGuardado = await AsyncStorage.getItem('jugador');
        if (JugadorGuardado) {
          setJugador(JugadorGuardado);
        }

        const PuntajeGuardado = await AsyncStorage.getItem('puntaje');
        if (PuntajeGuardado) {
          setPuntaje(parseInt(PuntajeGuardado, 10));
        }
      } catch (error) {
        console.log(error);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puntaje del Jugador</Text>
      <Text>Nombre: {Jugador}</Text>
      <Text>Puntaje: {Puntaje}</Text>
      <Button
        title="Volver a jugar"
        onPress={() => navigation.navigate("Game")}/>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});