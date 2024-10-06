// MapComponent.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_KEY } from '@env';

const MapComponent = ({ tipoMarcadores, hospitales, centrosSalud, farmacias, psicologos, fisios }) => {

  const [location, setLocation] = useState(null);
  const [locationDefault, setLocationdefault] = useState({
    latitude: 40.33465751928502,
    longitude: -3.873767602121708,
  });
  const [region, setRegion] = useState({
    latitude: 37.78825, // Coordenadas por defecto
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Define el estado para destination
  const [destination, setDestination] = useState({
    start: false,
    latitude: null,
    longitude: null,
  });
  const [destinationButton, setDestinationButton] = useState({
    mostrar: false,
    latitude: null,
    longitude: null,
  });
  const rutasOff = () => {
    setDestinationButton({
      mostrar: false
    });
    setDestination({
      start: false
    })
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso denegado para acceder a la ubicación');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      if (currentLocation) {
        setLocation(currentLocation.coords);
        setRegion({
          // latitude: currentLocation.coords.latitude,
          // longitude: currentLocation.coords.longitude,
          latitude: 40.33465751928502,
          longitude: -3.873767602121708,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    })();

  }, []);


  return (
    <View style={styles.mapContainer}>
      {location ? (
        <>
          <MapView style={styles.map} region={region} onPress={() => rutasOff()}>
            {/* Marcador de ubicación actual */}
            <Marker
              coordinate={{
                latitude: 40.33465751928502,
                longitude: -3.873767602121708,
              }}
              title="Ubicacion actual"
              description=""
              image={require('C:/Users/Mario/Documents/TFG/Computadores/my-health-system-app/assets/images/marcadorLocalizacion.png')}
            />
            
            {/* Marcadores según el tipo */}
            {tipoMarcadores === 'Hospitales' && hospitales.map((hospis, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(hospis.latitude),
                  longitude: parseFloat(hospis.longitude),
                }}
                title={hospis.name}
                description={hospis.description}
                onPress={() => setDestinationButton({
                  mostrar:true, 
                  latitude:hospis.latitude, 
                  longitude:hospis.longitude
                })}
              />
            ))}
  
            {tipoMarcadores === 'Centros de salud' && centrosSalud.map((hospis, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(hospis.latitude),
                  longitude: parseFloat(hospis.longitude),
                }}
                title={hospis.name}
                description={hospis.description}
                onPress={() => setDestinationButton({
                  mostrar:true, 
                  latitude:hospis.latitude, 
                  longitude:hospis.longitude
                })}
              />
            ))}
  
            {tipoMarcadores === 'Farmacias' && farmacias.map((hospis, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(hospis.latitude),
                  longitude: parseFloat(hospis.longitude),
                }}
                title={hospis.name}
                description={hospis.description}
                onPress={() => setDestinationButton({
                  mostrar:true, 
                  latitude:hospis.latitude, 
                  longitude:hospis.longitude
                })}
              />
            ))}
  
            {tipoMarcadores === 'Psicologos' && psicologos.map((hospis, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(hospis.latitude),
                  longitude: parseFloat(hospis.longitude),
                }}
                title={hospis.name}
                description={hospis.description}
                onPress={() => setDestinationButton({
                  mostrar:true, 
                  latitude:hospis.latitude, 
                  longitude:hospis.longitude
                })}
              />
            ))}
  
            {tipoMarcadores === 'Fisioterapeutas' && fisios.map((hospis, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(hospis.latitude),
                  longitude: parseFloat(hospis.longitude),
                }}
                title={hospis.name}
                description={hospis.description}
                onPress={() => setDestinationButton({
                  mostrar:true, 
                  latitude:hospis.latitude, 
                  longitude:hospis.longitude
                })}
              />
            ))}
  
            {destination.start && (
            <MapViewDirections
              origin={locationDefault}
              destination={destination}
              apikey={GOOGLE_MAPS_KEY}
              strokeWidth={3}
            />
          )}
          </MapView>
  
          {destinationButton.mostrar && (
            <TouchableOpacity 
            style={styles.button} 
            onPress={() => setDestination({
              start: true,
              latitude: parseFloat(destinationButton.latitude),
              longitude: parseFloat(destinationButton.longitude),
            })}>
              <Text style={styles.buttonText}>Comenzar Ruta</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text>Cargando ubicación...</Text>
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
    margin: 25,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    padding: 15,
    backgroundColor: '#A7D2FF',
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 2
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold'
  },
});

export default MapComponent;
