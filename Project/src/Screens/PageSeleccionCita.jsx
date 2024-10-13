import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getDataSQL, getDataSQLShowResult } from '../Components/SQLiteComponent.jsx';
import moment from 'moment'; // Para manipular fechas
import { AuthContext } from '../Components/AuthContext'

const PageSeleccionCita = ({ route, navigation }) => {
  const { userId } = useContext(AuthContext);
  const { areaSeleccionada, centroSeleccionado } = route.params;
  const [centroArea, setCentroAreas] = useState([]);
  const [fechas, setFechas] = useState([]);
  
  const today = moment().format('YYYY-MM-DD');
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  const [selectedDay, setSelectedDay] = useState(null);
  const [lastSelectedDay, setLastSelectedDate] = useState(yesterday);
  const [filteredHoras, setFilteredHoras] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  var full = false;
  // Función para generar un arreglo de horas en intervalos de 30 minutos
  const generateTimeSlots = (start, end, parada, vuelta, duracion, centro, area) => {
    const startTime = moment(start, 'HH:mm:ss'); // Convertimos horaInicio en formato HH:mm:ss
    const endTime = moment(end, 'HH:mm:ss');
    const stopTime = moment(parada, 'HH:mm:ss');
    const backTime = moment(vuelta, 'HH:mm:ss');
    
    const slots = [];

    
    while (startTime.isBefore(endTime) && full == false) {
      const cita = comprobarCita(centro, area, selectedDay, startTime.format('HH:mm:ss'));
      if(!cita){
        if(parada != null && vuelta != null){
          if(startTime.isBefore(stopTime) || startTime.isSameOrAfter(backTime)){
            slots.push(startTime.format('HH:mm')); // Guardamos la hora en formato HH:mm:ss
            
          }

        }else{
          slots.push(startTime.format('HH:mm')); // Guardamos la hora en formato HH:mm:ss
        }
      }
      startTime.add(duracion, 'minutes');
    }
    
    full = true;
    return slots;
  };

  function comprobarCita(centro, area, fecha, hora){
      try {
        console.log(centro, area, fecha, hora);
        const resultado = getDataSQLShowResult('SELECT id FROM Cita WHERE centro_id = ? AND area_id = ? AND fecha = ? AND hora = ? AND estado != \'Cancelada\'', [centro, area, fecha, hora]);
        
        // Accede a la propiedad que contiene los resultados
        const citas = resultado._j || []; // Si _j es el array de resultados

        // Verifica si citas es un arreglo y si tiene elementos
        if (Array.isArray(citas) && citas.length > 0) {
            return true; // Se encontró la cita
        } else {
            return false; // No se encontró la cita
        }
      } catch (error) {
          console.error('Error al comprobar la cita:', error);
          return false; // Manejo del error
      }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (areaSeleccionada != null) {
          const centroInfo = await getDataSQL('SELECT * FROM Centros WHERE id = ?', areaSeleccionada.centro_id);
          setCentroAreas({
            area: areaSeleccionada.id,
            centro: centroInfo[0].id,
            centroName: centroInfo[0].name,
            horaInicio: centroInfo[0].horaInicio,
            horaFin: centroInfo[0].horaFin,
            horaParada: centroInfo[0].horaParada,
            horaVuelta: centroInfo[0].horaVuelta,
            duracion: centroInfo[0].duracionCita,
            type: centroInfo[0].type,
          });
        } else if (centroSeleccionado != null) {
          setCentroAreas({
            area: 0,
            centro: centroSeleccionado.id,
            centroName: centroSeleccionado.name,
            horaInicio: centroSeleccionado.horaInicio,
            horaFin: centroSeleccionado.horaFin,
            horaParada: centroSeleccionado.horaParada,
            horaVuelta: centroSeleccionado.horaVuelta,
            duracion: centroSeleccionado.duracionCita,
            type: centroSeleccionado.type,
          });
        }

        const fechas = await getDataSQL('SELECT * FROM Dia');
        setFechas(fechas);

      } catch (error) {
        console.error('Error fetching data:', error);
      }   
    };

    fetchData();
  }, []);

  const markedDates = {
    [selectedDay]: {
      selected: true,
      selectedColor: 'green',
    },
    ...fechas.reduce((acc, { date, festivo }) => {
      if (date && festivo === 1 && centroArea.type !== 'Hospital') {
        acc[date] = {
          disableTouchEvent: true,
          disabled: true,
        };
      }
      return acc;
    }, {}),
  };

  // Asegúrate de que `renderRows` es siempre una función.
  const renderRows = () => {
    const rows = [];
    let currentRow = [];
    
    if(lastSelectedDay != selectedDay){
      setFilteredHoras(generateTimeSlots(centroArea.horaInicio, centroArea.horaFin, centroArea.horaParada, centroArea.horaVuelta, centroArea.duracion, centroArea.centro, centroArea.area));
      setLastSelectedDate(selectedDay);
    }

    filteredHoras.forEach((hora, index) => {
      currentRow.push(
        <View key={hora.hora ? hora.hora : hora} style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => confirmarCita(centroArea.centroName, selectedDay, hora)}>
            <Text style={styles.buttonText}>{hora.hora ? hora.hora : hora}</Text> 
          </TouchableOpacity>
        </View>
      );

      // Añadir la fila cada vez que tengamos 4 botones.
      if (currentRow.length === 4 || index === filteredHoras.length - 1) {
        rows.push(
          <View key={index} style={styles.row}>
            {currentRow}
          </View>
        );
        currentRow = []; // Reiniciamos la fila.
      }
    });

    return rows;
  };

  const handleConfirm = (hora) => {
    console.log("Cita confirmada");
    crearCita(hora);
    citaConfirmada();
  };

  const handleCancel = () => {
      console.log("Cancelado");
  };

  const handleContinue = () => {
    console.log("Continuar");
    navigation.navigate('Home');
  };

  const confirmarCita = (centro, dia, hora) => {
    const time = moment(hora, 'HH:mm:ss');
    Alert.alert(
      "Confirmar Cita",
      `¿Quiere confirmar su cita?
      - Centro: ${centro} 
      - Día: ${dia} 
      - Hora: ${hora}`,
      [
        {
          text: "Cancelar",
          onPress: () => handleCancel(),
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => handleConfirm(time.format('HH:mm:ss')),
          style: "default"
        }
      ]
    );
    
  };
  
  const citaConfirmada = () => {
    Alert.alert(
      "Cita confirmada",
      `¡Gracias por confiar en nosotros!`,
      [
        {
          text: "Continuar",
          onPress: () => handleContinue(),
          style: "default"
        }
      ]
    );
  };

  const crearCita = (hora) => {
    getDataSQL('INSERT INTO Cita (user_id, centro_id, area_id, fecha, hora, estado) VALUES (?,?,?,?,?,?)', [userId, centroArea.centro, centroArea.area, selectedDay, hora, 'Pendiente']);
  }
  return (
    <View>
      <Calendar
        minDate={today}
        onDayPress={(day) => {
          if (day.dateString >= today) {
            setSelectedDay(day.dateString);
          } else {
            Alert.alert('No puedes seleccionar días anteriores a hoy.');
          }
        }}
        markedDates={markedDates}
        firstDay={1}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {renderRows()}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    margin: 5,
  },
  button: {
    backgroundColor: '#4CAF50', // Color del botón (puedes cambiarlo)
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // Color del texto del botón
    fontSize: 16,
  },
});

export default PageSeleccionCita;
