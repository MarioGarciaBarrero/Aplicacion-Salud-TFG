import { StyleSheet, Text, View } from 'react-native';
import Index from './src/Components/Indice.jsx'
import {NavigationContainer} from '@react-navigation/native';
import { AuthProvider } from './src/Components/AuthContext.jsx'; // Asegúrate de que la ruta sea correcta

export default function App() {
  return (
    <AuthProvider>
        <Index />
    </AuthProvider>


  )
}