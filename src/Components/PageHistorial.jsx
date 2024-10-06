import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext';
import { getDataSQL } from 'C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/src/Components/SQLiteAPI.jsx';

const PageHistorial = () => {
  const { userId } = useContext(AuthContext);
  const [selectedSection, setSelectedSection] = useState('Consultas');
  const [data, setData] = useState([]);

  const loadData = async (section) => {
    let query = '';
    switch (section) {
      case 'Consultas':
        query = 'SELECT * FROM ConsultasGenerales WHERE userId = ?';
        break;
      case 'Alergias':
        query = 'SELECT * FROM Alergias WHERE userId = ?';
        break;
      case 'Vacunas':
        query = 'SELECT * FROM Vacunas WHERE userId = ?';
        break;
      case 'Resultados':
        query = 'SELECT * FROM Resultados WHERE userId = ?';
        break;
      case 'Enfermedades':
        query = 'SELECT * FROM EnfermedadesCronicas WHERE userId = ?';
        break;
    }
    const result = await getDataSQL(query, [userId]);
    setData(result);
  };

  useEffect(() => {
    loadData(selectedSection); // Load data when the section changes
  }, [selectedSection]);

  return (
    <View style={styles.container}>
        <View style={styles.buttonContainer}>
            {['Consultas', 'Resultados'].map((section) => (
            <TouchableOpacity
                key={section}
                style={[
                styles.button,
                { backgroundColor: selectedSection === section ? '#4C64D8' : '#80b2e5' } // Color del botón
                ]}
                onPress={() => setSelectedSection(section)}
            >
                <Text style={styles.buttonText}>{section}</Text>
            </TouchableOpacity>
            ))}
        </View>
      <View style={styles.buttonContainer2}>
        {['Alergias', 'Vacunas', 'Enfermedades'].map((section) => (
          <TouchableOpacity
            key={section}
            style={[
              styles.button,
              { backgroundColor: selectedSection === section ? '#4C64D8' : '#80b2e5' } // Color del botón
            ]}
            onPress={() => setSelectedSection(section)}
          >
            <Text style={styles.buttonText}>{section}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.dataContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.box}>
            {selectedSection === 'Consultas' && (
              <>
                <Text style={styles.label}>Fecha Consulta: {item.fechaConsulta}</Text>
                <Text style={styles.label}>ID Médico: {item.idMedico}</Text>
                <Text style={styles.label}>Diagnóstico: {item.diagnostico}</Text>
                <Text style={styles.label}>Tratamiento: {item.tratamiento}</Text>
              </>
            )}
            {selectedSection === 'Alergias' && (
              <>
                <Text style={styles.label}>Alergia: {item.alergia}</Text>
                <Text style={styles.label}>Fecha Descubrimiento: {item.fechaDescubrimiento}</Text>
              </>
            )}
            {selectedSection === 'Vacunas' && (
              <>
                <Text style={styles.label}>Nombre Vacuna: {item.nombreVacuna}</Text>
                <Text style={styles.label}>Fecha Vacuna: {item.fechaVacuna}</Text>
              </>
            )}
            {selectedSection === 'Resultados' && (
              <>
                <Text style={styles.label}>Tipo Prueba: {item.tipoPrueba}</Text>
                <Text style={styles.label}>Fecha Resultado: {item.fechaResultado}</Text>
                <Text style={styles.label}>Resultado: {item.resultado}</Text>
              </>
            )}
            {selectedSection === 'Enfermedades' && (
              <>
                <Text style={styles.label}>Enfermedad: {item.enfermedad}</Text>
                <Text style={styles.label}>Fecha Descubrimiento: {item.fechaDescubrimiento}</Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 18,
      backgroundColor: '#fff',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Distribuir el espacio entre botones
      marginBottom: 10,
    },
    buttonContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Distribuir el espacio entre botones
        marginBottom: 20,
    },
    button: {
      flex: 1, // Los botones ocuparán todo el espacio disponible
      paddingVertical: 10,
      paddingHorizontal: 8,
      marginHorizontal: 4, // Espacio entre botones
      borderRadius: 20,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
      minWidth: 100, // Ancho mínimo para pantallas pequeñas
    },
    buttonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center', // Centrar el texto en los botones
    },
    dataContainer: {
      flex: 1,
    },
    box: {
      backgroundColor: '#f1f1f1',
      padding: 15,
      marginBottom: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 3,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
  });
  
  

export default PageHistorial;
