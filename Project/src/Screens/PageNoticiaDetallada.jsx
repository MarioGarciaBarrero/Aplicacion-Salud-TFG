import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import moment from 'moment';

const PageNoticiaDetallada = ({ route }) => {
  // Recibimos los datos de la noticia desde la ruta
  const { noticia } = route.params;

  //console.log(noticia);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título de la noticia */}
      <Text style={styles.title}>{noticia.Titulo}</Text>

      {/* Fecha de publicación */}
      <Text style={styles.date}>Publicado el: {moment(noticia.FechaPublicacion).format('DD-MM-YYYY HH:mm:ss')}</Text>

      {/* Desarrollo completo de la noticia */}
      <Text style={styles.content}>{noticia.Noticia}</Text>

      {/* Público objetivo */}
      <Text style={styles.targetAudience}>
        Público objetivo: <Text style={styles.italicText}>{noticia.EdadesObjetivo}</Text>
      </Text>
    </ScrollView>
  );
};

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'justify',
    color: '#555',
    marginBottom: 20,
  },
  targetAudience: {
    fontSize: 14,
    color: '#777',
    textAlign: 'right',
    marginTop: 20,
    fontStyle: 'italic',
  },
  italicText: {
    fontStyle: 'italic',
    fontSize: 13,
  },
});

export default PageNoticiaDetallada;
