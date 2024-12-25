import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { insertDataSQL, getDataSQLAwait } from '../Components/SQLiteComponent.jsx';
import moment from 'moment';
import axios from 'axios';

export default function EditRecordDetailPage({ route, navigation }) {
  const { type, record } = route.params; // Recibimos el tipo y el registro
  
  const [formData, setFormData] = useState(record);
  const [errors, setErrors] = useState({});

  // Función para cambiar los valores del formulario
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Validaciones
  const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date); // YYYY-MM-DD
  const isValidBoolean = (value) => value === 'true' || value === 'false';
  const isValidCoordinate = (coordinate) => /^[+-]?\d+(\.\d+)?$/.test(coordinate); // Para validar latitud/longitud

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    // Validaciones específicas según el tipo
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
        if (!formData.latitude || !isValidCoordinate(formData.latitude)) {
          newErrors.latitude = 'Latitud es obligatoria y debe ser un número válido';
          valid = false;
        }
        if (!formData.longitude || !isValidCoordinate(formData.longitude)) {
          newErrors.longitude = 'Longitud es obligatoria y debe ser un número válido';
          valid = false;
        }
        if (!formData.type) {
          newErrors.type = 'Tipo es obligatorio';
          valid = false;
        }
        break;

      case 'Areas':
        if (!formData.name) {
          newErrors.name = 'Nombre es obligatorio';
          valid = false;
        }
        if (!formData.centro_id) {
          newErrors.centro_id = 'Id del centro es obligatorio';
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
        if (!formData.fechaNacimiento || !isValidDate(formData.fechaNacimiento)) {
          newErrors.fechaNacimiento = 'Fecha de nacimiento es obligatoria y debe estar en formato YYYY-MM-DD';
          valid = false;
        }
        break;

      case 'Noticias':
        if (!formData.Titulo) {
          newErrors.Titulo = 'Título es obligatorio';
          valid = false;
        }
        break;

      default:
        valid = false;
        Alert.alert('Error', 'Tipo de formulario no reconocido.');
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor, corrige los errores del formulario.');
      return;
    }

    const currentDateTime = new Date().toISOString();
    const currentDateTimeBBDDremote = moment().format('YYYY-MM-DD HH:mm:ss');

    // Query de actualización
    let query = '';
    let values = [];
    let table;

    switch (type) {
      case 'Centros':
        table = 'Centros';
        query = `UPDATE Centros SET description=?, name=?, duracionCita=?, horaFin=?, horaInicio=?, horaParada=?, horaVuelta=?, latitude=?, longitude=?, privado=?, type=?, lastUpdate = ? WHERE id=?`;
        values = [
          formData.description, formData.name, formData.duracionCita, formData.horaFin, formData.horaInicio, 
          formData.horaParada, formData.horaVuelta, formData.latitude, formData.longitude, formData.privado, 
          formData.type, currentDateTime, formData.id // id no es editable, solo se usa en el WHERE
        ];
        break;
      case 'Areas':
        table = 'Area';
        query = `UPDATE Area SET name=?, centro_id=?, lastUpdate = ? WHERE id=?`;
        values = [formData.name, formData.centro_id, currentDateTime, formData.id];
        break;
      case 'Usuarios':
        table = 'Usuario';
        query = `UPDATE Usuario SET nombre=?, apellidos=?, email=?, password=?, telefono=?, fechaNacimiento=?, admin=?, lastUpdate = ? WHERE id=?`;
        values = [
          formData.nombre, formData.apellidos, formData.email, formData.password, formData.telefono, 
          formData.fechaNacimiento, formData.admin, currentDateTime, formData.id
        ];
        break;
      case 'Noticias':
        table = 'NoticiasSalud';
        query = `UPDATE NoticiasSalud SET Titulo=?, Noticia=?, FechaPublicacion=?, EdadesObjetivo=?, lastUpdate = ? WHERE id=?`;
        values = [
          formData.Titulo, formData.Noticia, formData.FechaPublicacion, formData.EdadesObjetivo, currentDateTime, formData.id
        ];
        break;
    }

    // Llamar a la función para ejecutar el update (supón que updateDataSQL es una función que ejecuta la query)
    insertDataSQL(query, values);

    formData.lastUpdate = currentDateTimeBBDDremote;
    actualizarObjetoBBDDRemota(table, formData, formData.id);

    Alert.alert('Éxito', `${type} actualizado correctamente.`);
    navigation.navigate('EditHomePage') // Volver a la pantalla anterior
  };

  const actualizarObjetoBBDDRemota = async (table, data, objectId) => {
    try {
      const jsonData = {
        table: table,
        data: data,
        id: objectId
      };
  
      console.log('Datos a enviar:', jsonData);
  
      // Envía el JSON a la API
      const response = await axios.post(process.env.API_URL + '/update', jsonData);
      console.log('Datos insertados correctamente:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error en la respuesta del servidor:', error.response.data);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        console.error('Error al configurar la solicitud:', error.message);
      }
      console.error('Error al insertar datos:', error.config);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editando {type}</Text>
      
      {/* Mostrar el ID solo como lectura */}
      <Text style={styles.label}>ID: {formData.id}</Text>

      {/* Renderizar el formulario basado en el tipo */}
      {renderForm(type, formData, handleInputChange, errors)}
      
      <Button title="Guardar Cambios" onPress={handleSubmit} />
    </View>
  );
}

// Función para renderizar el formulario basado en el tipo
const renderForm = (type, formData, handleInputChange, errors) => {
  switch (type) {
    case 'Centros':
      return (
          <>
          <Text style={styles.textEdit} >Nombre</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre" 
            value={formData.name} 
            onChangeText={value => handleInputChange('name', value)} 
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.textEdit} >Descripción</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Descripción" 
            value={formData.description} 
            onChangeText={value => handleInputChange('description', value)} 
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          
          
          <Text style={styles.textEdit} >Duración de Cita</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Duración de Cita" 
            value={formData.duracionCita} 
            onChangeText={value => handleInputChange('duracionCita', value)} 
          />
          
          <Text style={styles.textEdit} >Hora Fin (HH:MM)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Hora Fin (HH:MM)" 
            value={formData.horaFin} 
            onChangeText={value => handleInputChange('horaFin', value)} 
          />
          
          <Text style={styles.textEdit} >Hora Inicio (HH:MM)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Hora Inicio (HH:MM)" 
            value={formData.horaInicio} 
            onChangeText={value => handleInputChange('horaInicio', value)} 
          />
          
          <Text style={styles.textEdit} >Latitud</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Latitud" 
            value={formData.latitude} 
            onChangeText={value => handleInputChange('latitude', value)} 
          />
          {errors.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
          
          <Text style={styles.textEdit} >Longitud</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Longitud" 
            value={formData.longitude} 
            onChangeText={value => handleInputChange('longitude', value)} 
          />
          {errors.longitude && <Text style={styles.errorText}>{errors.longitude}</Text>}
          
          <Text style={styles.textEdit} >Tipo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Tipo" 
            value={formData.type} 
            onChangeText={value => handleInputChange('type', value)} 
          />
          {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
        </>
      );
      
    case 'Usuarios':
      return (
        <>
        <Text style={styles.textEdit} >Nombre</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre" 
            value={formData.nombre} 
            onChangeText={value => handleInputChange('nombre', value)} 
          />
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
          
          <Text style={styles.textEdit} >Apellidos</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Apellidos" 
            value={formData.apellidos} 
            onChangeText={value => handleInputChange('apellidos', value)} 
          />
          {errors.apellidos && <Text style={styles.errorText}>{errors.apellidos}</Text>}
          
          <Text style={styles.textEdit} >Fecha de Nacimiento (YYYY-MM-DD)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Fecha de Nacimiento (YYYY-MM-DD)" 
            value={formData.fechaNacimiento} 
            onChangeText={value => handleInputChange('fechaNacimiento', value)} 
          />
          {errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}
          
          <Text style={styles.textEdit} >Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            value={formData.email} 
            onChangeText={value => handleInputChange('email', value)} 
          />
          
          <Text style={styles.textEdit} >Contraseña</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Contraseña" 
            value={formData.password} 
            onChangeText={value => handleInputChange('password', value)} 
          />
          
          <Text style={styles.textEdit} >Teléfono (Opcional)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Teléfono (Opcional)" 
            value={formData.telefono} 
            onChangeText={value => handleInputChange('telefono', value)} 
          />
          
          <Text style={styles.textEdit} >Admin (true/false)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Admin (true/false)" 
            value={formData.admin} 
            onChangeText={value => handleInputChange('admin', value)} 
          />
        </>
      );

    case 'Noticias':
      return (
        <>
            <Text style={styles.textEdit} >Título</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Título" 
            value={formData.Titulo} 
            onChangeText={value => handleInputChange('Titulo', value)} 
          />
          {errors.Titulo && <Text style={styles.errorText}>{errors.Titulo}</Text>}
          
          <Text style={styles.textEdit} >Noticia</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Noticia" 
            value={formData.Noticia} 
            onChangeText={value => handleInputChange('Noticia', value)} 
          />
          
          <Text style={styles.textEdit} >Fecha de Publicación (YYYY-MM-DD)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Fecha de Publicación (YYYY-MM-DD)" 
            value={formData.FechaPublicacion} 
            onChangeText={value => handleInputChange('FechaPublicacion', value)} 
          />

          <Text style={styles.textEdit} >Edades Objetivo (Niños, Adolescentes, Adultos, Ancianos)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Edades Objetivo (Niños, Adolescentes, Adultos, Ancianos)" 
            value={formData.EdadesObjetivo} 
            onChangeText={value => handleInputChange('EdadesObjetivo', value)} 
          />
        </>
      );

      case 'Areas':
      return (
        <>
          <Text style={styles.textEdit} >Nombre</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre" 
            value={formData.name} 
            onChangeText={value => handleInputChange('name', value)} 
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          
          <Text style={styles.textEdit} >Id del centro</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Id del centro" 
            value={formData.centro_id} 
            onChangeText={value => handleInputChange('centro_id', value)} 
          />
          {errors.centro_id && <Text style={styles.errorText}>{errors.name}</Text>}
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
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  textEdit: {
    fontWeight: 'bold',
  }
});
