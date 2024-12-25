import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDataSQL, getDataSQLShowResult, insertDataSQL } from '../Components/SQLiteComponent.jsx';
import bcrypt from 'react-native-bcrypt';
import { AuthContext } from '../Components/AuthContext'

const LogInRegister = ({navigation}) => {
    const { setUserId } = useContext(AuthContext); // Obtener el setter de userId
    const [isRegistering, setIsRegistering] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    fechaNacimiento: '',
  });

  // Función para validar formato de fecha (YYYY-MM-DD)
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Expresión regular para el formato YYYY-MM-DD
    if (!regex.test(dateString)) {
      return false; // Si no coincide con el formato, retorna falso
    }
    const [year, month, day] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return date && (date.getMonth() + 1) === parseInt(month) && date.getDate() === parseInt(day); // Verifica que la fecha sea válida
  };

  // Función de validación del formulario de registro
  const validateRegister = async () => {
    const { nombre, apellidos, email, password, telefono, fechaNacimiento } = registerData;
    let missingFields = [];
  
    if (!nombre) missingFields.push('Nombre');
    if (!apellidos) missingFields.push('Apellidos');
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Password');
    if (!telefono) missingFields.push('Teléfono');
    if (!fechaNacimiento) {
      missingFields.push('Fecha de Nacimiento');
    } else if (!isValidDate(fechaNacimiento)) {
      Alert.alert('Error', 'La fecha de nacimiento debe estar en el formato YYYY-MM-DD y ser válida');
      return;
    }
  
    if (missingFields.length > 0) {
      Alert.alert('Error', `Faltan los siguientes campos: ${missingFields.join(', ')}`);
    } else {
      try {
        
        // Encriptar la contraseña con react-native-bcrypt
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
  
        console.log('Datos a guardar:', {
          ...registerData,
          password: hashedPassword, // Se guarda la contraseña encriptada
        });
  
        Alert.alert('Registro', 'Registrado correctamente');
        insertDataSQL('INSERT INTO Usuario (nombre, apellidos, email, password, telefono, fechaNacimiento, admin) VALUES (?,?,?,?,?,?,?)', [nombre, apellidos, email, hashedPassword, telefono, fechaNacimiento, false]);
        setIsRegistering(false); // Vuelve al formulario de Login
      } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        Alert.alert('Error', 'Hubo un problema al procesar tu registro.');
      }
    }
  };

  // Función de inicio de sesión (simple ejemplo)
  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert('Error', 'Por favor, completa todos los campos de inicio de sesión');
    } else {
        const resultado = getDataSQLShowResult('SELECT * FROM Usuario WHERE email = ?', [loginData.email])
        const user = resultado._j || [];
        if (user.length > 0){
            const validPassword = bcrypt.compareSync(loginData.password, user[0].password);
            
            if (!validPassword) {
                Alert.alert('Login', 'Combinación usuario contraseña incorrecto');
            }else{
                setUserId(user[0].id);
                navigation.navigate('Home', user);
            }
        }else{

            Alert.alert('Login', 'No se ha encontrado al usuario');
        }


    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      {!isRegistering ? (
        // Formulario de Log In
        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={loginData.email}
            onChangeText={(text) => setLoginData({ ...loginData, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={loginData.password}
            onChangeText={(text) => setLoginData({ ...loginData, password: text })}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}> 
            <Text style={styles.textButton} >INICIAR SESIÓN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsRegistering(true)}>
          <Text style={styles.textButton} >REGISTRARSE</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Formulario de Registro
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registro</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre*"
            value={registerData.nombre}
            onChangeText={(text) => setRegisterData({ ...registerData, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellidos*"
            value={registerData.apellidos}
            onChangeText={(text) => setRegisterData({ ...registerData, apellidos: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email*"
            value={registerData.email}
            onChangeText={(text) => setRegisterData({ ...registerData, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password*"
            secureTextEntry
            value={registerData.password}
            onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={registerData.telefono}
            onChangeText={(text) => setRegisterData({ ...registerData, telefono: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de Nacimiento (YYYY-MM-DD)*"
            value={registerData.fechaNacimiento}
            onChangeText={(text) => setRegisterData({ ...registerData, fechaNacimiento: text })}
          />
          <TouchableOpacity style={styles.button} onPress={validateRegister}> 
            <Text style={styles.textButton} >REGISTRARSE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsRegistering(false)} > 
            <Text style={styles.textButton} >CANCELAR</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  textButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#4C64D8', // Color azul oscuro
    padding: 15,
    marginHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  }
});

export default LogInRegister;
