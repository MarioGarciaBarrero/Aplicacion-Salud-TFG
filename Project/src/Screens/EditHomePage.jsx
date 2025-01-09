import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getDataSQL } from '../Components/SQLiteComponent.jsx';

export default function EditHomePage({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [tamañoConexion, setTamañoConexion] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const result = await getDataSQL('SELECT email, lastConnection FROM Usuario');
        setUsuarios(result);
        setTamañoConexion(result.length * 150);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
        <ScrollView contentContainerStyle={styles.container}>
          {/* Sección Centros */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Centros</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddRecord', {type:'Centros'})}>
                <Text style={styles.buttonText}>Añadir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditRecord', {type:'Centros'})}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DeleteRecord', {type:'Centros'})}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
    
          {/* Sección Áreas */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Áreas</Text>
            <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button } onPress={() => navigation.navigate('AddRecord', {type:'Areas'})}>
                <Text style={styles.buttonText}>Añadir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditRecord', {type:'Areas'})}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DeleteRecord', {type:'Areas'})}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
    
          {/* Sección Noticias */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Noticias</Text>
            <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddRecord', {type:'Noticias'})}>
                <Text style={styles.buttonText}>Añadir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditRecord', {type:'Noticias'})}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DeleteRecord', {type:'Noticias'})}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección Usuarios */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Usuarios</Text>
            <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddRecord', {type:'Usuarios'})}>
                <Text style={styles.buttonText}>Añadir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditRecord', {type:'Usuarios'})}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DeleteRecord', {type:'Usuarios'})}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de Usuarios */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Registros de últimas conexiones</Text>
            <View style={{ maxHeight: tamañoConexion }}>
              <ScrollView style={styles.userList}>
                {usuarios.map((usuario, index) => (
                  <View key={index} style={styles.userItem}>
                    <Text style={styles.subtitleUser}>Usuario:</Text>
                    <Text style={styles.userName}>{usuario.email}</Text>
                    <Text style={styles.subtitleUser}>Última conexión:</Text>
                    <Text style={styles.userLastConnection}>{usuario.lastConnection}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

        </ScrollView>
      );
    }
    
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    width: '90%',
    borderRadius: 15,
    elevation: 5, // sombra para Android
    shadowColor: '#000', // sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#70b5f9',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  userList: {
    marginTop: 10,
  },
  userItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  subtitleUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  userName: {
    fontSize: 16,
    marginBottom: 5,
  },
  userLastConnection: {
    fontSize: 14,
    color: '#888',
  },
});