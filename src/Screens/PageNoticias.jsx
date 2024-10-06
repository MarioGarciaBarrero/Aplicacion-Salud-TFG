import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../Components/AuthContext';
import { getDataSQL } from '../Components/SQLiteComponent.jsx';
import { TouchableOpacity } from 'react-native';

const PageNoticias = ({ navigation }) => {
  const { userId } = useContext(AuthContext);  // Obtener el userId
  const [userAgeGroup, setUserAgeGroup] = useState('');  // Grupo de edad del usuario
  const [news, setNews] = useState([]);  // Noticias filtradas
  const [error, setError] = useState(null);  // Estado para manejar errores

  // Función para calcular la edad en base a la fecha de nacimiento
  const calculateAge = (fechaNacimiento) => {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Función para clasificar la edad en un grupo
  const getAgeGroup = (age) => {
    if (age >= 0 && age <= 14) return 'Niños';
    if (age >= 15 && age <= 22) return 'Adolescentes';
    if (age >= 23 && age <= 65) return 'Adultos';
    if (age >= 66) return 'Ancianos';
    return '';
  };

  // Función para cargar los datos del usuario
  const loadUserData = async () => {
    try {
      // Obtener la fecha de nacimiento del usuario desde la base de datos
      const user = await getDataSQL('SELECT fechaNacimiento FROM Usuario WHERE id = ?', [userId]);

      if (user.length > 0) {
        const fechaNacimiento = user[0].fechaNacimiento;
        const age = calculateAge(fechaNacimiento);  // Calcular la edad
        const ageGroup = getAgeGroup(age);  // Determinar el grupo de edad
        setUserAgeGroup(ageGroup);  // Guardar el grupo de edad

        // Ahora que tenemos el grupo de edad, cargar las noticias relevantes
        loadNews(ageGroup);
      }
    } catch (error) {
      console.error('Error al obtener la fecha de nacimiento del usuario:', error);
      setError('Error al obtener la fecha de nacimiento del usuario.');
    }
  };

  // Función para cargar las noticias en base al grupo de edad
  const loadNews = async (ageGroup) => {
    try {
      const noticias = await getDataSQL('SELECT * FROM NoticiasSalud');

      // Filtrar noticias según el grupo de edad
      const filteredNews = noticias.filter((noticia) => {
        const edadesObjetivo = noticia.EdadesObjetivo.split(', ');  // Separar las edades objetivo
        return edadesObjetivo.includes(ageGroup);  // Verificar si el grupo de edad del usuario está en las edades objetivo
      });

      setNews(filteredNews);  // Guardar las noticias filtradas
    } catch (error) {
      console.error('Error al obtener las noticias:', error);
      setError('Error al obtener las noticias.');
    }
  };

  // Ejecutar la carga de datos cuando el componente se monte
  useEffect(() => {
    loadUserData();  // Cargar datos del usuario al montar el componente
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Noticias de Salud</Text>
      {error ? (  
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView style={styles.newsContainer}>
          {news.length > 0 ? (
            news.map((noticia, index) => (
              <View key={index} style={styles.newsBox}>
                <TouchableOpacity onPress={() => navigation.navigate('NoticiaDetallada', {noticia})}>
                    <Text style={styles.newsTitle}>{noticia.Titulo}</Text>
                    <Text style={styles.newsSnippet}>
                    {noticia.Noticia ? noticia.Noticia.substring(0, 100) : ''}...
                    </Text>  
                    <Text style={styles.newsDate}>Fecha de publicación: {noticia.FechaPublicacion}</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>No hay noticias disponibles para su grupo de edad.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  newsContainer: {
    flex: 1,
  },
  newsBox: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newsSnippet: {
    fontSize: 16,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  newsDate: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
  },
});

export default PageNoticias;
