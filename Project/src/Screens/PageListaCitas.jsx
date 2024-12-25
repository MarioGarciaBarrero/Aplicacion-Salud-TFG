import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView  } from 'react-native'
import { getDataSQL } from '../Components/SQLiteComponent.jsx';

const PageListaCitas = ({ route, navigation }) => {

    const {hospitales, centrosSalud, psicologos, fisios} = route.params;

    useEffect(() => {
      // Código para manejar el efecto
      return () => {
        // Código para limpiar el efecto
      };
    }, []);

    const combinedData = [
      { title: 'Hospitales', data: hospitales.length ? hospitales : [] },
      { title: 'Centros de Salud', data: centrosSalud.length ? centrosSalud : [] },
      { title: 'Psicologos', data: psicologos.length ? psicologos : [] },
      { title: 'Fisioterapeutas', data: fisios.length ? fisios : [] },
    ];
    

    const handlePress = (centro) => {
        //console.log(centro.type);
        if(centro.type == 'Hospital' || centro.type == 'Centro de Salud'){
          navigation.navigate('Areas', { centro });
        }else{
          navigation.navigate('Citas', { areaSeleccionada: null, centroSeleccionado: centro});
        }
      };
    
      const renderItem = ({ item }) => {
        return (
          item.privado ? (
            <TouchableOpacity style={styles.box} onPress={() => handlePress(item)}>
              <Text style={styles.boxTextTitle}>{item.name}</Text>
              <Text style={styles.boxTextDescription}>{item.description}</Text>
              <Text style={styles.boxTextPrivate}>PRIVADO</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.box} onPress={() => handlePress(item)}>
              <Text style={styles.boxTextTitle}>{item.name}</Text>
              <Text style={styles.boxTextDescription}>{item.description}</Text>
            </TouchableOpacity>
          )
        );
      };
    
      return (
        <FlatList 
          data={combinedData}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View style={styles.line} />
              <Text style={styles.titleText}>{item.title}</Text>
              <View style={styles.line} />
              <FlatList
                data={item.data}
                renderItem={renderItem}
                keyExtractor={(hospital) => hospital.id.toString()}
              />
            </View>
          )}
          keyExtractor={(item) => item.title}
        />
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
      },
      box: {
        backgroundColor: '#f8f8f8',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 2, // Sombra en Android
      },
      boxTextTitle: {
        fontSize: 16,
        fontWeight: 'bold'
      },
      boxTextDescription: {
        fontSize: 14,
        fontStyle: 'italic'
      },
      boxTextPrivate: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#8000ff',
        fontWeight: 'bold'
      },
      titleText:{
        fontSize: 24,
      },
      line: {
        borderBottomColor: '#000', // Color de la línea
        borderBottomWidth: 1, // Grosor de la línea
        width: '100%', // Ancho de la línea (puedes ajustar según lo necesites)
        marginVertical: 8, // Espaciado vertical alrededor de la línea
        marginTop: 10
      },
    });

export default PageListaCitas;