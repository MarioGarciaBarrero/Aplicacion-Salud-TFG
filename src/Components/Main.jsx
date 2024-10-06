import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import * as Location from 'expo-location';
import MapComponent from './MapComponent';
import { AuthContext } from './AuthContext'
import { getDataSQL } from 'C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/src/Components/SQLiteAPI.jsx';

const Main = ({navigation}) => {
  const { userId } = useContext(AuthContext); // Obtener el userId
  const [usuario, setUsuario] = useState(null); 
  const [fontsLoaded] = useFonts({
    Suse: require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/fonts/Suse.ttf'),
    Nunito: require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/fonts/Nunito.ttf')
  });

  const [selectedValue, setSelectedValue] = useState('Hospitales');

  const [hospitales, setHospitales] = useState([])
  const [centrosSalud, setCentroSalud] = useState([])
  const [farmacias, setFarmacias] = useState([])
  const [psicologos, setPsicologos] = useState([])
  const [fisios, setFisios] = useState([])

  useEffect(() => {

    const fetchData = async () => {
      try {
        const dataH = await getDataSQL('SELECT * FROM Centros WHERE Type = ?', 'Hospital');
        //console.log(dataH);
        setHospitales(dataH);

        const dataC = await getDataSQL('SELECT * FROM Centros WHERE Type = ?', 'Centro de salud');
        // console.log(dataC);
        setCentroSalud(dataC);

        const dataF = await getDataSQL('SELECT * FROM Centros WHERE Type = ?', 'Farmacia');
        // console.log(dataF);
        setFarmacias(dataF);

        const dataP = await getDataSQL('SELECT * FROM Centros WHERE Type = ?', 'Psicologo');
        // console.log(dataP);
        setPsicologos(dataP);

        const dataFT = await getDataSQL('SELECT * FROM Centros WHERE Type = ?', 'Fisioterapeuta');
        // console.log(dataFT);
        setFisios(dataFT);

        const user =  await getDataSQL('SELECT * FROM Usuario WHERE Id = ?', userId);
        console.log(user[0].admin);
        setUsuario(user);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('EditarPerfil')}>
            <Image source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/usuario.png')}/>
          </TouchableOpacity>
        {usuario !== null ? (
          <Text style={styles.nameText}>{usuario[0].nombre} {usuario[0].apellidos}</Text>
        ) : (
          <Text style={styles.nameText}>Cargando...</Text>
        )}
        </View>
          {usuario && usuario[0] && usuario[0].admin ? (
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('EditHomePage')}>
              <Text style={styles.settingsText}>BBDD</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('MisCitas')}>
            <Text style={styles.settingsText}>Mis citas</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Image source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/logoSeguridadSocial.jpg')}
            style={{width: 100, height: 100}} />
        </View>

          {/* Botón pedir cita médica */}
        <TouchableOpacity style={styles.button} 
        onPress={() => navigation.navigate('ListaCitas', { hospitales, centrosSalud, psicologos, fisios })}
        >
            <Text style={styles.buttonText}>PEDIR CITA MEDICA</Text>
        </TouchableOpacity>
        {/* Botones secundarios */}
        <View style={styles.secondaryButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Historial')}>
            <Text style={styles.secondaryButtonText}>Historial sanitario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Noticias')}>
            <Text style={styles.secondaryButtonText}>Información sanitaria personalizada</Text>
            </TouchableOpacity>
        </View>
      
      <View style={styles.title}>
          <Text style={styles.logoText}>Centros cercanos</Text>
          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            mode='dropdown'
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="Hospitales" value="Hospitales" />
            <Picker.Item label="Centros de salud" value="Centros de salud" />
            <Picker.Item label="Farmacias" value="Farmacias" />
            <Picker.Item label="Psicologos" value="Psicologos" />
            <Picker.Item label="Fisioterapeutas" value="Fisioterapeutas" />
          </Picker>
      </View>

      {/* Mapa interactivo */}
      <MapComponent tipoMarcadores={selectedValue} hospitales={hospitales} centrosSalud={centrosSalud} farmacias={farmacias} psicologos={psicologos} fisios={fisios} />
    </View>
  )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      backgroundColor: '#fff',
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    leftContainer: {
      flexDirection: 'row', // Para que el ícono y el texto estén en la misma fila
      alignItems: 'center', // Alinea el ícono y el texto verticalmente
    },
    nameText: {
      fontSize: 18,
      fontFamily: 'Nunito',
      fontWeight: 'bold'
    },
    settingsButton: {
      backgroundColor: '#4C64D8', // Color del botón de ajustes
      padding: 10,
      borderRadius: 5,
    },
    profileButton: {
      backgroundColor: '#e9e9e9', // Color del botón de ajustes
      padding: 10,
      borderRadius: 100,
    },
    settingsText: {
      color: '#fff',
      fontFamily: 'Nunito',
      fontSize: 18,
      fontWeight: 'bold'
    },
    settingsMap: {
      color: '#008bff',
      fontFamily: 'Nunito',
      fontSize: 14,
      textDecorationLine: 'underline',
      fontWeight: 'bold'      
    },
    header: {
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 25,
    },
    nameText: {
      fontSize: 20,
      fontFamily: 'Nunito',
      fontWeight: 'bold',
      paddingHorizontal: 10,
    },
    logoText: {
      fontSize: 20,
      fontFamily: 'Nunito',
      fontWeight: 'bold'
    },
    button: {
      backgroundColor: '#4C64D8', // Color azul oscuro
      padding: 15,
      marginHorizontal: 25,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'Nunito',
      fontWeight: 'bold'
    },
    secondaryButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: 20,
      marginBottom: 20,
      justifyContent: 'center'

    },
    secondaryButton: {
      backgroundColor: '#A7D2FF', // Color azul claro
      padding: 15,
      borderRadius: 10,
      flex: 1,
      marginHorizontal: 5,
      justifyContent: 'center', // Centra el contenido verticalmente
      alignItems: 'center'
    },
    secondaryButtonText: {
      color: '#000',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Nunito',
      fontWeight: 'bold'
    },
    label: {
      fontSize: 18,
      marginBottom: 10,
    },
    picker: {
      backgroundColor: '#e9e9e9',  // Color de fondo del botón
      marginLeft: 10,          // Espacio vertical
      height: 25,
      width: 180,
    },
    selectedText: {
      marginTop: 20,
      fontSize: 16,
    },
});

export default Main