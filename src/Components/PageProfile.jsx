import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from './AuthContext'; // Asumiendo que el AuthContext está bien implementado
import { getDataSQL } from 'C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/src/Components/SQLiteAPI.jsx';

const PageProfile = () => {
  const { userId } = useContext(AuthContext); // Obtener el id del usuario del contexto
  const [userData, setUserData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    contrasena: '',
  });

  const [editField, setEditField] = useState(null); // Para gestionar qué campo se está editando

  // Obtener los datos actuales del usuario al cargar la pantalla
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getDataSQL('SELECT * FROM Usuario WHERE id= ?', [userId]);
        if (user.length > 0) {
          setUserData({
            nombre: user[0].nombre,
            apellidos: user[0].apellidos,
            email: user[0].email,
            telefono: user[0].telefono,
            contrasena: user[0].password,
          });
        }
      } catch (error) {
        Alert.alert('Error', 'Hubo un problema al cargar los datos del usuario.');
      }
    };

    fetchUserData();
  }, [userId]);

  // Manejo de cambios de valores en los campos de edición
  const handleChange = (key, value) => {
    setUserData({ ...userData, [key]: value });
  };

  // Función para actualizar los datos del usuario en la base de datos
  const handleSave = async () => {
    try {
      // Aquí puedes hacer la consulta a la base de datos para actualizar los datos del usuario
      await getDataSQL(
        `UPDATE Usuario SET nombre = ?, apellidos = ?, email = ?, telefono = ?, password = ? WHERE id = ?`,
        [userData.nombre, userData.apellidos, userData.email, userData.telefono, userData.contrasena, userId]
      );
      Alert.alert('Éxito', 'Los datos han sido actualizados.');
      setEditField(null); // Salir del modo de edición
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al actualizar los datos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {/* Nombre */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nombre:</Text>
        {editField === 'nombre' ? (
          <TextInput
            style={styles.input}
            value={userData.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
          />
        ) : (
          <Text style={styles.value}>{userData.nombre}</Text>
        )}
        <TouchableOpacity onPress={() => setEditField(editField === 'nombre' ? null : 'nombre')}>
          <Text style={styles.editButton}>{editField === 'nombre' ? 'Guardar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Apellidos */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Apellidos:</Text>
        {editField === 'apellidos' ? (
          <TextInput
            style={styles.input}
            value={userData.apellidos}
            onChangeText={(text) => handleChange('apellidos', text)}
          />
        ) : (
          <Text style={styles.value}>{userData.apellidos}</Text>
        )}
        <TouchableOpacity onPress={() => setEditField(editField === 'apellidos' ? null : 'apellidos')}>
          <Text style={styles.editButton}>{editField === 'apellidos' ? 'Guardar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Email */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Correo Electrónico:</Text>
        {editField === 'email' ? (
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={(text) => handleChange('email', text)}
          />
        ) : (
          <Text style={styles.value}>{userData.email}</Text>
        )}
        <TouchableOpacity onPress={() => setEditField(editField === 'email' ? null : 'email')}>
          <Text style={styles.editButton}>{editField === 'email' ? 'Guardar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Teléfono */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Teléfono:</Text>
        {editField === 'telefono' ? (
          <TextInput
            style={styles.input}
            value={userData.telefono}
            onChangeText={(text) => handleChange('telefono', text)}
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.value}>{userData.telefono}</Text>
        )}
        <TouchableOpacity onPress={() => setEditField(editField === 'telefono' ? null : 'telefono')}>
          <Text style={styles.editButton}>{editField === 'telefono' ? 'Guardar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Contraseña */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Contraseña:</Text>
        {editField === 'contrasena' ? (
          <TextInput
            style={styles.input}
            value={userData.contrasena}
            onChangeText={(text) => handleChange('contrasena', text)}
            secureTextEntry
          />
        ) : (
          <Text style={styles.value}>********</Text>
        )}
        <TouchableOpacity onPress={() => setEditField(editField === 'contrasena' ? null : 'contrasena')}>
          <Text style={styles.editButton}>{editField === 'contrasena' ? 'Guardar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>

      <Button title="Guardar Cambios" onPress={handleSave} />
    </View>
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
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    fontSize: 18,
    flex: 2,
    paddingRight: 10,
  },
  input: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    padding: 5,
    marginRight: 10,
  },
  editButton: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default PageProfile;
