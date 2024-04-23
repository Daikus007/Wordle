import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Button } from 'react-native';
import { GameContext } from '../context/GameContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {

    const { SaveGame, getGame } = useContext(GameContext);
    const [jugador, setJugador] = useState('');

    const InicioJugador = async () => { 
        try {
            await AsyncStorage.setItem("jugador", jugador)
            navigation.navigate("Game")
        } catch (error) {
            console.log(error)
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
