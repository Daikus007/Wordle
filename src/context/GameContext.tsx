import { Context, createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ContextProps { 
    wordSelected: string
    SaveGame: (value: Score) => Promise<void>
    getGame: () => Promise<void>
    listScores: any[]
}

export const GameContext = createContext({} as ContextProps);

interface Score { 
    name: string,
    score: number
}

export const GameProvider = ({ children }) => {

    const words = ["test", "hola", "perro"]
    const [wordSelected, setWordSelected] = useState(words[1]);
    const [listScores, setListScores] = useState([])

    useEffect(() => { 
        console.log("listScores updated ", listScores)
    }, [listScores])

    useEffect(() => {
        getGame()
    }, [])


    const SaveGame = async (value: Score) => {
        try {
            setListScores(prevScores => {
                const updatedScores = [...prevScores, value];
                AsyncStorage.setItem("listScores", JSON.stringify(updatedScores)).catch(console.error);
                return updatedScores;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const getGame = async () => { 
        try {
            const response = await AsyncStorage.getItem("listScores")
            if (response !== null) return setListScores(JSON.parse(response))
        } catch (error) {
            console.log(error)
        }
    }
    return <GameContext.Provider
        value={{
            wordSelected,
            listScores,
            SaveGame,
            getGame,
        }}>
        {children}

    </GameContext.Provider>
}