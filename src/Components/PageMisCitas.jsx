import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from './AuthContext';
import { getDataSQL } from 'C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/src/Components/SQLiteAPI.jsx';

const PageMisCitas = ({ navigation }) => {
    const { userId } = useContext(AuthContext);
    const [citas, setCitas] = useState([]);
  
    useEffect(() => {
      const fetchCitas = async () => {
        try {
          const citasData = await getDataSQL('SELECT * FROM Cita WHERE user_Id = ?', [userId]);
          const today = new Date();
          const citasFuturas = await Promise.all(
            citasData
              .filter(cita => new Date(cita.fecha + ' ' + cita.hora) > today)
              .map(async (cita) => {
                const centroData = await getDataSQL('SELECT name, type FROM Centros WHERE id = ?', [cita.centro_id]);
                const centroName = centroData[0]?.name || 'Centro Desconocido';
                const areaData = await getDataSQL('SELECT name FROM Area WHERE id = ?', [cita.area_id]);
                const areaName = areaData[0]?.name || centroData[0]?.type;
                return { ...cita, centroName, areaName };
              })
          );
  
          const citasOrdenadas = citasFuturas.sort((a, b) => {
            const dateA = new Date(a.fecha + ' ' + a.hora);
            const dateB = new Date(b.fecha + ' ' + b.hora);
            return dateA - dateB;
          });
  
          setCitas(citasOrdenadas);
        } catch (error) {
          Alert.alert('Error', 'Hubo un problema al cargar las citas.');
        }
      };
  
      fetchCitas();
    }, [userId]);
  
    const cancelarCita = async (citaId) => {
      try {
        await getDataSQL('UPDATE Cita SET estado = ? WHERE id = ?', ['Cancelada', citaId]);
        Alert.alert('Cita cancelada', 'La cita ha sido cancelada exitosamente.');
        navigation.navigate('Home');
      } catch (error) {
        Alert.alert('Error', 'No se pudo cancelar la cita.');
      }
    };
  
    const borrarCita = async (citaId) => {
      try {
        await getDataSQL('DELETE FROM Cita WHERE id = ?', [citaId]);
        Alert.alert('Cita eliminada', 'La cita ha sido eliminada exitosamente.');
        navigation.navigate('Home');
    } catch (error) {
        Alert.alert('Error', 'No se pudo eliminar la cita.');
    }
    };
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Mis Citas</Text>
    
        {citas.length === 0 ? (
          <Text style={styles.noAppointments}>No tienes citas futuras.</Text>
        ) : (
          citas.map((cita) => (
            <View key={cita.id} style={cita.estado === 'Cancelada' ? styles.citaBoxCancel : styles.citaBox}>
              <View style={styles.citaInfo}>
                <Text style={styles.centro}>{cita.centroName}</Text>
                <Text style={styles.area}>{cita.areaName}</Text>
                <Text style={styles.fecha}>
                  {cita.fecha} - {cita.hora}
                </Text>
                <Text style={styles.estado}>Estado: {cita.estado || 'Pendiente'}</Text>
              </View>
    
              {/* Botón de cancelar solo si la cita no está cancelada */}
              {cita.estado !== 'Cancelada' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelarCita(cita.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              )}
              {/* Botón de borrar solo si la cita está cancelada */}
              {cita.estado === 'Cancelada' && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => borrarCita(cita.id)}
                >
                  <Text style={styles.deleteButtonText}>Borrar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noAppointments: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  citaBox: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',  // Alineamos el contenido de la cita y el botón en una fila
    justifyContent: 'space-between',  // Espaciado entre la información y el botón
    alignItems: 'center',
  },
  citaBoxCancel: {
    backgroundColor: '#ffcece',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',  // Alineamos el contenido de la cita y el botón en una fila
    justifyContent: 'space-between',  // Espaciado entre la información y el botón
    alignItems: 'center',
  },
  citaInfo: {
    flex: 1,  // La información de la cita toma el espacio restante
  },
  centro: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  area: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  fecha: {
    fontSize: 16,
    marginBottom: 5,
  },
  estado: {
    fontSize: 14,
    color: '#888',
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10, // Espacio entre botones
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PageMisCitas;
