import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Button, Alert } from 'react-native';
import { GameContext } from '../context/GameContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera'
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { app } from '../firebaseconfig';



export default function LoginScreen({ navigation }) {

    const { SaveGame, getGame } = useContext(GameContext);
    const [jugador, setJugador] = useState('');
    const db = getFirestore(app);



    const InicioJugador = async () => {
        if (jugador.trim() === '') {
            alert('Por favor, ingresa un nombre antes de iniciar el juego.');
        } else {
            try {
                // Verificar si el jugador ya existe en Firestore
                const q = query(collection(db, 'jugadores'), where('nombre', '==', jugador));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    // Si el jugador no existe, agregar un nuevo documento con puntaje inicial de 0
                    await addDoc(collection(db, 'jugadores'), {
                        nombre: jugador,
                        puntaje: 0,
                    });
                }

                // Guardar el jugador en AsyncStorage
                await AsyncStorage.setItem("jugador", jugador);
                // Navegar a la pantalla de juego
                navigation.navigate("Game");
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <View style={styles.container}>
            <>
                <Text style={styles.titulo}>WORDLE</Text>
                <Text style={styles.subtitulo}>Ingresa tu nombre para iniciar </Text>
                <TextInput
                    value={jugador}
                    onChangeText={setJugador}
                    placeholder='Jugador'
                    style={styles.input}/>
                <Button
                    title="Iniciar Juego"
                    onPress={InicioJugador}
                />
                <Button
                    title="Escanear"
                    onPress={() => navigation.navigate("Scan")} />
            </>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f1f1f1",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    titulo: {
        fontSize: 80,
        color: "#000",
        fontWeight: "bold"
    },
    subtitulo: {
        fontSize: 15,
        color: "gray"
    },
    input: {
        backgroundColor: '#E5E5E5',
        width: '80%',
        marginBottom: 20,
        padding: 15,
        borderRadius: 30,
        paddingStart: 30
    }
});
