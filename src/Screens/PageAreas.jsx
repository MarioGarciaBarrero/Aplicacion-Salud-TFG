import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image  } from 'react-native'
import { getDataSQL } from '../Components/SQLiteComponent.jsx';

const PageAreas = ({ route, navigation }) => {
    const { centro } = route.params;
    const [areas, setAreas] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const area = await getDataSQL('SELECT * FROM Area WHERE centro_id = ?', [centro.id]);
          setAreas(area); 
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [centro.id]);
  
    const handlePress = (item) => {
        navigation.navigate('Citas', { areaSeleccionada: item, centroSeleccionado: null});
    };
  
    const renderItem = ({ item }) => (
      <TouchableOpacity style={styles.box} onPress={() => handlePress(item)}>
        <Text style={styles.boxTextTitle}>{item.name}</Text>
        {item.name === 'Consulta general' && (
            <Image
                source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/ConsultaGeneral.png')}
                style={styles.image}
            />
        )}
        {item.name === 'Pediatría' && (
            <Image
                source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/Pediatria.png')}
                style={styles.image}
            />
        )}
        {item.name === 'Ginecología' && (
            <Image
                source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/Ginecologia.png')}
                style={styles.image}
            />
        )}
        {item.name === 'Radiología' && (
            <Image
                source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/Radiografia.png')}
                style={styles.image}
            />
        )}
        {item.name === 'Rehabilitación' && (
            <Image
                source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/Rehabilitacion.png')}
                style={styles.image}
            />
        )}
        {item.name === 'Psiquiatría' && (
            <Image
                source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/Psiquiatria.png')}
                style={styles.image}
            />
        )}
        {item.name === 'Medicina de Familia' && (
            <Image
                source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/MedicoFamilia.png')}
                style={styles.image}
            />
        )}
        {item.name === 'Enfermería' && (
            <Image
                source={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/Enfermera.png')}
                style={styles.image}
            />
        )}
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
        <FlatList
          data={areas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    box: {
      flex: 1,
      backgroundColor: '#90CAF9', // Color azul claro similar a la imagen
      borderRadius: 10,
      padding: 20,
      marginHorizontal: 8,
      marginTop: 10,
      minWidth: 150, // Ancho mínimo para los botones
      minHeight: 100, // Alto mínimo para los botones
      justifyContent: 'center',
      alignItems: 'center',
    },
    boxTextTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#000',
    },
    image: {
        marginTop: 10,
        width: 50, // Ancho de la imagen
        height: 50, // Alto de la imagen
        resizeMode: 'contain', // Ajusta la imagen sin distorsionarla
      },
  });
  
  export default PageAreas;