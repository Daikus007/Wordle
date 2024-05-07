import { View, Text, Button, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { app } from '../firebaseconfig';
import { updateDoc, doc } from "firebase/firestore";



export default function ScoreScreen({ navigation }) {

  const [Jugador, setJugador] = useState('');
  const [Puntaje, setPuntaje] = useState(0);
  const db = getFirestore(app);


  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Recuperar el nombre del jugador de AsyncStorage
        const JugadorGuardado = await AsyncStorage.getItem('jugador');
        if (JugadorGuardado) {
          setJugador(JugadorGuardado);

          // Recuperar el puntaje del jugador de Firestore
          const q = query(collection(db, 'jugadores'), where('nombre', '==', JugadorGuardado));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const jugadorDoc = querySnapshot.docs[0];
            const jugadorData = jugadorDoc.data();
            setPuntaje(jugadorData.puntaje);
          }
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
        onPress={() => navigation.navigate("Game")} />
    </View>
  );
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
