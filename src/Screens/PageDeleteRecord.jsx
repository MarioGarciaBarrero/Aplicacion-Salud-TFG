import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { getDataSQL, insertDataSQL } from '../Components/SQLiteComponent.jsx';

export default function PageDeleteRecord({ route, navigation }) {
    const { type } = route.params; // Recibimos el tipo de entidad (Centros, Areas, Usuarios, Noticias)
  
    const [records, setRecords] = useState([]);
    const [groupedRecords, setGroupedRecords] = useState({});
    const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda
    const [loading, setLoading] = useState(true);
  
    // Función para obtener los datos en función del tipo
    const fetchData = async () => {
      let query = '';
      switch (type) {
        case 'Centros':
          query = 'SELECT * FROM Centros';
          break;
        case 'Areas':
          query = 'SELECT * FROM Area';
          break;
        case 'Usuarios':
          query = 'SELECT * FROM Usuario';
          break;
        case 'Noticias':
          query = 'SELECT * FROM NoticiasSalud';
          break;
        default:
          Alert.alert('Error', 'Tipo no reconocido');
          return;
      }
  
      // Llamada a la función getDataSQL que ejecuta la consulta SQL
      const result = await getDataSQL(query);
      setRecords(result);
  
      // Agrupamos los registros por el campo `type`
      const grouped = result.reduce((groups, record) => {
        const key = record.type || 'Sin Tipo'; // Agrupar por `type`, o "Sin Tipo" si no tiene
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(record);
        return groups;
      }, {});
  
      setGroupedRecords(grouped);
      setLoading(false);
    };
  
    // Ejecutamos la función de obtener datos al cargar la página
    useEffect(() => {
      fetchData();
    }, []);
  
    // Función para filtrar registros basados en el texto de búsqueda
    const filterRecords = (records) => {
      if (!searchText.trim()) {
        return records;
      }
      // Filtramos los registros que coincidan con el nombre o título dependiendo del tipo
      const filtered = records.filter((record) => {
        if (type === 'Centros' || type === 'Areas') {
          return record.name.toLowerCase().includes(searchText.toLowerCase());
        } else if (type === 'Usuarios') {
          return record.nombre.toLowerCase().includes(searchText.toLowerCase()) || record.apellidos.toLowerCase().includes(searchText.toLowerCase());
        } else if (type === 'Noticias') {
          return record.Titulo.toLowerCase().includes(searchText.toLowerCase());
        }
        return false;
      });
      return filtered;
    };

    // Función para eliminar un registro
    const deleteRecord = (tipo, id) => {
        // Mostrar alerta para confirmar la eliminación
        console.log(tipo, id);
        Alert.alert(
        'Eliminar Registro',
        '¿Está seguro de que desea eliminar este registro?',
        [
            {
            text: 'Cancelar',
            style: 'cancel', // Acción de cancelar
            },
            {
            text: 'Eliminar',
            style: 'destructive', // Estilo para una acción destructiva
            onPress: () => {
                // Ejecutar la consulta de eliminación solo si el usuario confirma
                let query = '';
                
                switch (tipo) {
                case 'Centros':
                    query = `DELETE FROM Centros WHERE id = ?`;
                    break;
                case 'Areas':
                    query = `DELETE FROM Area WHERE id = ?`;
                    break;
                case 'Usuarios':
                    query = `DELETE FROM Usuario WHERE id = ?`;
                    break;
                case 'Noticias':
                    query = `DELETE FROM NoticiasSalud WHERE id = ?`;
                    break;
                default:
                    Alert.alert('Error', 'Tipo de registro no reconocido');
                    return;
                }
    
                // Ejecutar la query para eliminar el registro
                insertDataSQL(query, [id]);
    
                // Mostrar confirmación de eliminación exitosa
                Alert.alert('Éxito', `El registro ha sido eliminado correctamente.`);
                navigation.navigate('EditHomePage');
            }
            }
        ],
        { cancelable: true }
        );
    };

  
    // Renderizado de los registros agrupados por `type`
    if (loading) {
      return <Text>Cargando registros...</Text>;
    }
  
    if (Object.keys(groupedRecords).length === 0) {
      return <Text>No hay registros para mostrar.</Text>;
    }
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Selecciona un {type} para editar</Text>
  
        {/* Campo de búsqueda */}
        <TextInput
          style={styles.searchInput}
          placeholder={`Buscar ${type} por nombre...`}
          value={searchText}
          onChangeText={setSearchText}
        />
  
        {Object.keys(groupedRecords).map((groupKey) => {
          const filteredRecords = filterRecords(groupedRecords[groupKey]); // Filtrar los registros por el texto de búsqueda
  
          if (filteredRecords.length === 0) {
            return null; // No mostrar grupo si no hay resultados
          }
  
          return (
            <View key={groupKey} style={styles.groupContainer}>
              {/* Título de cada grupo (type) */}
              <Text style={styles.groupTitle}>{groupKey}</Text> 
              
              {filteredRecords.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  style={styles.recordBox}
                  onPress={() => deleteRecord(type, record.id)}
                >
                  <Text style={styles.recordText}>
                    {type === 'Centros' && `${record.name} (${record.description})`}
                    {type === 'Areas' && `${record.name}`}
                    {type === 'Usuarios' && `${record.nombre} ${record.apellidos}`}
                    {type === 'Noticias' && `${record.Titulo}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
    },
    groupContainer: {
      marginBottom: 20,
    },
    groupTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingBottom: 5,
    },
    recordBox: {
      backgroundColor: '#fff',
      padding: 15,
      marginVertical: 8,
      borderRadius: 8,
      borderColor: '#ccc',
      borderWidth: 1,
      width: '100%', // Hace que la caja ocupe el ancho completo
      justifyContent: 'center',
    },
    recordText: {
      fontSize: 18,
    }
  });