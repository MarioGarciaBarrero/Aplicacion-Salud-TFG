import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Main from './Main';
import PageListaCitas from './PageListaCitas';  
import PageAreas from './PageAreas';
import PageSeleccionCita from './PageSeleccionCita';
import LoginRegister from './LogInRegister';
import PageProfile from './PageProfile';
import PageMisCitas from './PageMisCitas';
import PageHistorial from './PageHistorial';
import PageNoticias from './PageNoticias';
import PageNoticiaDetallada from './PageNoticiaDetallada';
import EditHomePage from './EditHomePage';
import AddRecord from './PageAddRecord';
import EditRecord from './PageEditRecord';
import EditRecordDetailPage from './EditRecordDetailPage';
import PageDeleteRecord from './PageDeleteRecord';

const Stack = createNativeStackNavigator();

function Index () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginRegister'>
        <Stack.Screen
          name="LogIn"
          component={LoginRegister}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ListaCitas" 
          component={PageListaCitas} 
          options={{ title:'Seleccione un centro' }}
        />
        <Stack.Screen 
          name="Areas" 
          component={PageAreas} 
          options={{ title:'Seleccione una Area' }}
        />
        <Stack.Screen 
          name="Citas" 
          component={PageSeleccionCita} 
          options={{ title:'Seleccione Fecha y Hora' }}
        />
        <Stack.Screen 
          name="EditarPerfil" 
          component={PageProfile} 
          options={{ title:'Mi Perfil' }}
        />
        <Stack.Screen 
          name="MisCitas" 
          component={PageMisCitas} 
          options={{ title:'Mis Citas' }}
        />
        <Stack.Screen 
          name="Historial" 
          component={PageHistorial} 
          options={{ title:'Mis Historial Sanitario' }}
        />
        <Stack.Screen 
          name="Noticias" 
          component={PageNoticias} 
          options={{ title:'Noticias' }}
        />
        <Stack.Screen 
          name="NoticiaDetallada" 
          component={PageNoticiaDetallada} 
          options={{ title:'Noticia Detallada' }}
        />
        <Stack.Screen 
          name="EditHomePage" 
          component={EditHomePage} 
          options={{ title:'Objeto a Editar' }}
        />
        <Stack.Screen 
          name="AddRecord" 
          component={AddRecord} 
          options={{ title:'Añadir Registros' }}
        />
        <Stack.Screen 
          name="EditRecord" 
          component={EditRecord} 
          options={{ title:'Editar Registros' }}
        />
        <Stack.Screen 
          name="EditRecordDetailPage" 
          component={EditRecordDetailPage} 
          options={{ title:'Editar Registro' }}
        />
        <Stack.Screen 
          name="DeleteRecord" 
          component={PageDeleteRecord} 
          options={{ title:'Eliminar Registro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index