import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import bcrypt from 'react-native-bcrypt';
import { insertDataSQL } from 'C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/src/Components/SQLiteAPI.jsx';

export default function PageAddRecord({ navigation, route }) {
  const { type } = route.params; // Recibimos el tipo de entidad (Centros, Areas, Usuarios, Noticias)
  
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Comprobaciones de formato
  const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date); // YYYY-MM-DD
  const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time); // HH:MM
  const isValidBoolean = (value) => value === 'true' || value === 'false';

  // Manejo de cambios de input
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
 
  // Validación antes de insertar datos
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    switch (type) {
      case 'Centros':
        if (!formData.description) {
          newErrors.description = 'Descripción es obligatoria';
          valid = false;
        }
        if (!formData.name) {
          newErrors.name = 'Nombre es obligatorio';
          valid = false;
        }
        if (!formData.latitude) {
            newErrors.latitude = 'Latitud es obligatoria';
            valid = false;
        }
        if (!formData.longitude) {
            newErrors.longitude = 'Longitud es obligatorio';
            valid = false;
        }
        if (!formData.type) {
            newErrors.type = 'Tipo es obligatorio';
            valid = false;
        }
        if (!formData.duracionCita) {
          newErrors.duracionCita = 'Duración de cita es obligatoria';
          valid = false;
        }
        if (!isValidTime(formData.horaFin)) {
          newErrors.horaFin = 'Hora Fin debe estar en formato HH:MM';
          valid = false;
        }
        if (!isValidTime(formData.horaInicio)) {
          newErrors.horaInicio = 'Hora Inicio debe estar en formato HH:MM';
          valid = false;
        }
        if (formData.privado !== 'true' && formData.privado !== 'false') {
          newErrors.privado = 'Privado debe ser true o false';
          valid = false;
        }
        break;

      case 'Areas':
        if (!formData.name) {
          newErrors.name = 'Nombre es obligatorio';
          valid = false;
        }
        if (!formData.centro_id) {
          newErrors.centro_id = 'Centro ID es obligatorio';
          valid = false;
        }
        break;

      case 'Usuarios':
        if (!formData.nombre) {
          newErrors.nombre = 'Nombre es obligatorio';
          valid = false;
        }
        if (!formData.apellidos) {
          newErrors.apellidos = 'Apellidos son obligatorios';
          valid = false;
        }
        if (!formData.email) {
          newErrors.email = 'Email es obligatorio';
          valid = false;
        }
        if (!isValidDate(formData.fechaNacimiento)) {
            newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
            valid = false;
        }
        if (!formData.password) {
          newErrors.password = 'Contraseña es obligatoria';
          valid = false;
        }else{
          // Encriptar la contraseña con react-native-bcrypt
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(formData.password, salt);  
            formData.password = hashedPassword;
        }
        if (formData.admin !== 'true' && formData.admin !== 'false') {
          newErrors.admin = 'Admin debe ser true o false';
          valid = false;
        }
        break;

      case 'Noticias':
        if (!formData.Titulo) {
          newErrors.Titulo = 'Título es obligatorio';
          valid = false;
        }
        if (!formData.Noticia) {
          newErrors.Noticia = 'Noticia es obligatoria';
          valid = false;
        }
        if (!isValidDate(formData.FechaPublicacion)) {
          newErrors.FechaPublicacion = 'Fecha debe estar en formato YYYY-MM-DD';
          valid = false;
        }
        if (!formData.EdadesObjetivo) {
          newErrors.EdadesObjetivo = 'Edades Objetivo es obligatorio';
          valid = false;
        }
        break;

      default:
        valid = false;
        alert('Tipo de formulario no reconocido.');
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor, corrige los errores del formulario.');
      return;
    }

    let query = '';
    let values = [];

    switch (type) {
      case 'Centros':
        query = `INSERT INTO Centros (description, name, duracionCita, horaFin, horaInicio, horaParada, horaVuelta, latitude, longitude, privado, type) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        values = [formData.description, formData.name, formData.duracionCita, formData.horaFin, formData.horaInicio, formData.horaParada, formData.horaVuelta, formData.latitude, formData.longitude, formData.privado, formData.type];
        break;
      case 'Areas':
        query = `INSERT INTO Area (name, centro_id) VALUES (?, ?)`;
        values = [formData.name, formData.centro_id];
        break;
      case 'Usuarios':
        query = `INSERT INTO Usuario (nombre, apellidos, email, password, telefono, fechaNacimiento, admin) VALUES (?,?,?,?,?,?,?)`;
        values = [formData.nombre, formData.apellidos, formData.email, formData.password, formData.telefono, formData.fechaNacimiento, formData.admin];
        break;
      case 'Noticias':
        query = `INSERT INTO NoticiasSalud (Titulo, Noticia, FechaPublicacion, EdadesObjetivo) VALUES (?,?,?,?)`;
        values = [formData.Titulo, formData.Noticia, formData.FechaPublicacion, formData.EdadesObjetivo];
        break;
    }

    // Llamada a la función insertDataSQL con la query y los valores.
    insertDataSQL(query, values);

    Alert.alert('Creacion correcta', 'Se ha registrado correctamente la información en la Base de Datos');
    navigation.navigate('EditHomePage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir {type}</Text>
      {renderForm(type, formData, handleInputChange, errors)}
      <Button title="Guardar" onPress={handleSubmit} />
    </View>
  );
}

// Función para renderizar el formulario según el tipo
const renderForm = (type, formData, handleInputChange, errors) => {
  switch (type) {
    case 'Centros':
      return (
        <>
          <TextInput style={styles.input} placeholder="Nombre" onChangeText={value => handleInputChange('name', value)} />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <TextInput style={styles.input} placeholder="Descripción" onChangeText={value => handleInputChange('description', value)} />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          <TextInput style={styles.input} placeholder="Duración Cita" onChangeText={value => handleInputChange('duracionCita', value)} />
          {errors.duracionCita && <Text style={styles.errorText}>{errors.duracionCita}</Text>}
          <TextInput style={styles.input} placeholder="Hora Fin (HH:MM)" onChangeText={value => handleInputChange('horaFin', value)} />
          {errors.horaFin && <Text style={styles.errorText}>{errors.horaFin}</Text>}
          <TextInput style={styles.input} placeholder="Hora Inicio (HH:MM)" onChangeText={value => handleInputChange('horaInicio', value)} />
          {errors.horaInicio && <Text style={styles.errorText}>{errors.horaInicio}</Text>}
          <TextInput style={styles.input} placeholder="Hora Parada (Opcional)" onChangeText={value => handleInputChange('horaParada', value)} />
          <TextInput style={styles.input} placeholder="Hora Vuelta (Opcional)" onChangeText={value => handleInputChange('horaVuelta', value)} />
          <TextInput style={styles.input} placeholder="Latitud" onChangeText={value => handleInputChange('latitude', value)} />
          {errors.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
          <TextInput style={styles.input} placeholder="Longitud" onChangeText={value => handleInputChange('longitude', value)} />
          {errors.longitude && <Text style={styles.errorText}>{errors.longitude}</Text>}
          <TextInput style={styles.input} placeholder="Privado (true/false)" onChangeText={value => handleInputChange('privado', value)} />
          {errors.privado && <Text style={styles.errorText}>{errors.privado}</Text>}
          <TextInput style={styles.input} placeholder="Tipo" onChangeText={value => handleInputChange('type', value)} />
          {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
        </>
      );

    case 'Areas':
      return (
        <>
          <TextInput style={styles.input} placeholder="Nombre" onChangeText={value => handleInputChange('name', value)} />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <TextInput style={styles.input} placeholder="Centro ID" onChangeText={value => handleInputChange('centro_id', value)} />
          {errors.centro_id && <Text style={styles.errorText}>{errors.centro_id}</Text>}
        </>
      );

    case 'Usuarios':
      return (
        <>
          <TextInput style={styles.input} placeholder="Nombre" onChangeText={value => handleInputChange('nombre', value)} />
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
          <TextInput style={styles.input} placeholder="Apellidos" onChangeText={value => handleInputChange('apellidos', value)} />
          {errors.apellidos && <Text style={styles.errorText}>{errors.apellidos}</Text>}
          <TextInput style={styles.input} placeholder="Email" onChangeText={value => handleInputChange('email', value)} />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <TextInput style={styles.input} placeholder="Contraseña" onChangeText={value => handleInputChange('password', value)} />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          <TextInput style={styles.input} placeholder="Teléfono (Opcional)" onChangeText={value => handleInputChange('telefono', value)} />
          <TextInput style={styles.input} placeholder="Fecha Nacimiento (YYYY-MM-DD)" onChangeText={value => handleInputChange('fechaNacimiento', value)} />
          {errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}
          <TextInput style={styles.input} placeholder="Admin (true/false)" onChangeText={value => handleInputChange('admin', value)} />
          {errors.admin && <Text style={styles.errorText}>{errors.admin}</Text>}
        </>
      );

    case 'Noticias':
      return (
        <>
          <TextInput style={styles.input} placeholder="Título" onChangeText={value => handleInputChange('Titulo', value)} />
          {errors.Titulo && <Text style={styles.errorText}>{errors.Titulo}</Text>}
          <TextInput style={styles.input} placeholder="Noticia" onChangeText={value => handleInputChange('Noticia', value)} />
          {errors.Noticia && <Text style={styles.errorText}>{errors.Noticia}</Text>}
          <TextInput style={styles.input} placeholder="Fecha Publicación (YYYY-MM-DD)" onChangeText={value => handleInputChange('FechaPublicacion', value)} />
          {errors.FechaPublicacion && <Text style={styles.errorText}>{errors.FechaPublicacion}</Text>}
          <TextInput style={styles.input} placeholder="Edades Objetivo (Niños, Adolescentes, Adultos, Ancianos)" onChangeText={value => handleInputChange('EdadesObjetivo', value)} />
          {errors.EdadesObjetivo && <Text style={styles.errorText}>{errors.EdadesObjetivo}</Text>}
        </>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  }
});
