import React, { useContext, useEffect } from "react"
import {StyleSheet,View,SafeAreaView,Text,TouchableOpacity,Button,} from "react-native"
import { GameContext } from "../context/GameContext"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, updateDoc, query, collection, where, getDocs } from "firebase/firestore";
import { app } from "../firebaseconfig";


const Block = ({ index, guess, word, guessed, }: { index: number, guess: string, word: string, guessed: boolean, }) => {

    const { wordSelected } = useContext(GameContext);

    const letter = guess[index]
    const wordLetter = word[index]
    const blockStyles: any[] = [styles.guessSquare]
    const textStyles: any[] = [styles.guessLetter]

    if (letter === wordLetter && guessed) {
        blockStyles.push(styles.guessCorrect)
        textStyles.push(styles.guessedLetter)
    } else if (word.includes(letter) && guessed) {
        blockStyles.push(styles.guessInWord)
        textStyles.push(styles.guessedLetter)
    } else if (guessed) {
        blockStyles.push(styles.guessNotInWord)
        textStyles.push(styles.guessedLetter)
    }
    return (
        <View style={blockStyles}>
            <Text style={textStyles}>{letter}</Text>
        </View>
    )
}

const GuessRow = ({guess,word,guessed,}: { guess:string, word:string, guessed:boolean,}) => {
    return (
        <View style={styles.guessRow}>
            <Block index={0} guess={guess} word={word} guessed={guessed} />
            <Block index={1} guess={guess} word={word} guessed={guessed} />
            <Block index={2} guess={guess} word={word} guessed={guessed} />
            <Block index={3} guess={guess} word={word} guessed={guessed} />
            <Block index={4} guess={guess} word={word} guessed={guessed} />
        </View>
    )
}

const KeyboardRow = ({letters,onKeyPress}: {letters: string[],onKeyPress: (letter: string) => void,}) => (
    <View style={styles.keyboardRow}>
        {letters.map(letter => (
            <TouchableOpacity onPress={() => onKeyPress(letter)} key={letter}>
                <View style={styles.key}>
                    <Text style={styles.keyLetter}>{letter}</Text>
                </View>
            </TouchableOpacity>
        ))}
    </View>
)

const Keyboard = ({ onKeyPress }: { onKeyPress: (letter: string) => void }) => {
    const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
    const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
    const row3 = ["Z", "X", "C", "V", "B", "N", "M", "⌫"]

    return (
        <View style={styles.keyboard}>
            <KeyboardRow letters={row1} onKeyPress={onKeyPress} />
            <KeyboardRow letters={row2} onKeyPress={onKeyPress} />
            <KeyboardRow letters={row3} onKeyPress={onKeyPress} />
            <View style={styles.keyboardRow}>
                <TouchableOpacity onPress={() => onKeyPress("ENTER")}>
                    <View style={styles.key}>
                        <Text style={styles.keyLetter}>ENTER</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const words = ["ACTOR","BICHO","CAMPO","DURAR","ENOJO","FINCA","GAFAS","HIELO","JULIO",]

interface IGuess {
    [key: number]: string;
}

const defaultGuess: IGuess = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
}

export default function GameScreen({ navigation }: any) {
    const db = getFirestore(app);
    const [activeWord, setActiveWord] = React.useState(words[0])
    const [guessIndex, setGuessIndex] = React.useState(0)
    const [guesses, setGuesses] = React.useState<IGuess>(defaultGuess);
    const [gameComplete, setGameComplete] = React.useState(false)
    const [score, setScore] = React.useState(0);

    useEffect(() => { 
        const cargarPuntaje = async () => {
            const guardarPuntaje = await AsyncStorage.getItem("puntaje");
            if (guardarPuntaje) {
                setScore(parseInt(guardarPuntaje))
            }
        };
        cargarPuntaje();
    }, [])

    const updateScoreInFirestore = async (newScore) => {
        const jugador = await AsyncStorage.getItem("jugador");
        if (jugador) {
            const q = query(collection(db, 'jugadores'), where('nombre', '==', jugador));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const jugadorDoc = querySnapshot.docs[0];
                const jugadorRef = doc(db, "jugadores", jugadorDoc.id);
                await updateDoc(jugadorRef, {
                    puntaje: newScore
                });
            }
        }
    };

    const handleKeyPress = (letter: string) => {
        const guess: string = guesses[guessIndex]

        if (guess === activeWord) {
            const nuevoPuntaje = score + 1;
            setScore(nuevoPuntaje);

            // Actualizar el puntaje en Firestore
            updateScoreInFirestore(nuevoPuntaje);
        }

        if (letter === "ENTER") {
            if (guess.length !== 5) {
                alert("Palabra demasiado corta.")
                return
            }

            if (guess === activeWord) {
                const nuevoPuntaje = score + 1; 
                setScore(nuevoPuntaje)
                
                AsyncStorage.setItem("puntaje", nuevoPuntaje.toString())
                    .then(() => {
                        setGuessIndex(guessIndex + 1);
                        setGameComplete(true);
                        alert("Ganaste!");
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                return;
            }

            if (guessIndex < 5) {
                setGuessIndex(guessIndex + 1)
            } else {
                setGameComplete(true)
                alert("Perdiste :(")
                return
            }
        }

        if (letter === "⌫") {
            setGuesses({ ...guesses, [guessIndex]: guess.slice(0, -1) })
            return
        }

        // No agregar si la fila esta llena 
        if (guess.length >= 5) {
            return
        }

        setGuesses({ ...guesses, [guessIndex]: guess + letter })
    }

    React.useEffect(() => {
        if (!gameComplete) {
            setActiveWord(words[Math.floor(Math.random() * words.length)])
            setGuesses(defaultGuess)
            setGuessIndex(0)
        }
    }, [gameComplete])

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <GuessRow
                    guess={guesses[0]}
                    word={activeWord}
                    guessed={guessIndex > 0}/>
                <GuessRow
                    guess={guesses[1]}
                    word={activeWord}
                    guessed={guessIndex > 1}/>
                <GuessRow
                    guess={guesses[2]}
                    word={activeWord}
                    guessed={guessIndex > 2}/>
                <GuessRow
                    guess={guesses[3]}
                    word={activeWord}
                    guessed={guessIndex > 3}/>
                <GuessRow
                    guess={guesses[4]}
                    word={activeWord}
                    guessed={guessIndex > 4}/>
                <GuessRow
                    guess={guesses[5]}
                    word={activeWord}
                    guessed={guessIndex > 5}/>
            </View>
            <View>
                <Button
                    title="Ver Puntaje"
                    onPress={() => navigation.navigate('Score')}
                />
            </View>
            <View>
                {gameComplete ? (
                    <View style={styles.gameCompleteWrapper}>
                        <Text>
                            <Text style={styles.bold}>Palabra correcta:</Text> {activeWord}
                        </Text>
                        <View>
                            <Button
                                title="Reiniciar"
                                onPress={() => {
                                    setGameComplete(false)
                                }}/>
                        </View>
                    </View>
                ) : null}
                <Keyboard onKeyPress={handleKeyPress} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    guessRow: {
        flexDirection: "row",
        justifyContent: "center",
    },
    guessSquare: {
        borderColor: "#d3d6da",
        borderWidth: 2,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
    },
    guessLetter: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#878a8c",
    },
    guessedLetter: {
        color: "#fff",
    },
    guessCorrect: {
        backgroundColor: "#6aaa64",
        borderColor: "#6aaa64",
    },
    guessInWord: {
        backgroundColor: "#c9b458",
        borderColor: "#c9b458",
    },
    guessNotInWord: {
        backgroundColor: "#787c7e",
        borderColor: "#787c7e",
    },

    container: {
        justifyContent: "space-between",
        flex: 1,
    },

    //Teclado
    keyboard: { flexDirection: "column" },
    keyboardRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    key: {
        backgroundColor: "#d3d6da",
        padding: 10,
        margin: 3,
        borderRadius: 5,
    },
    keyLetter: {
        fontWeight: "500",
        fontSize: 15,
    },

    //Juego Completado
    gameCompleteWrapper: {
        alignItems: "center",
    },
    bold: {
        fontWeight: "bold",
    },
})