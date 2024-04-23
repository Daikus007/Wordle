import React from 'react'
import { GameProvider } from './src/context/GameContext'
import GameScreen from './src/view/GameScreen'
import AppNavigation from './src/routes/AppNavigation'

export default function App() {
  return (
    <GameProvider>
      <AppNavigation/>
    </GameProvider>
  )
}
