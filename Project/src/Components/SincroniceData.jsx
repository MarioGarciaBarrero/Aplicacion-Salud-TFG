import { getDataSQL , insertDataSQL } from '../Components/SQLiteComponent.jsx';
import axios from 'axios';

export default SincroniceData = async () => {
    try {

        const CentrosRDB = await axios.post('http://192.168.1.52:3000/compare-update', {
            object: 'centros',
        });

        // const AreasRDB = await axios.post('http://localhost:3000/compare-update', {
        //     object: 'area',
        // });

        // const NoticiasRDB = await axios.post('http://localhost:3000/compare-update', {
        //     object: 'noticiassalud',
        // });

        // const CitasRDB = await axios.post('http://localhost:3000/compare-update', {
        //     object: 'cita',
        // });

        // const AlergiasRDB = await axios.post('http://localhost:3000/compare-update', {
        //     object: 'alergias',
        // });

        // const ConsultasRDB = await axios.post('http://localhost:3000/compare-update', {
        //     object: 'consultasgenerales',
        // });

        // const EnfermedadesRDB = await axios.post('http://localhost:3000/compare-update', {
        //     object: 'enfermedadescronicas',
        // });

        // const ResultadosRDB = await axios.post('http://localhost:3000/compare-update', {
        //     object: 'resultados',
        // });

        // const VacunasRDB = await axios.post('http://localhost:3000/compare-update', {
        //     object: 'vacunas',
        // });


        //

        // const CentrosLDB = await getDataSQL('SELECT Id, lastUpdate FROM Centros');
        // const AreasLDB = await getDataSQL('SELECT Id, lastUpdate FROM Area');
        // const NoticiasLDB = await getDataSQL('SELECT Id, lastUpdate FROM noticiassalud');
        // const CitasLDB = await getDataSQL('SELECT Id, lastUpdate FROM Cita');
        // const AlergiasLDB = await getDataSQL('SELECT Id, lastUpdate FROM Alergias');
        // const ConsultasLDB = await getDataSQL('SELECT Id, lastUpdate FROM consultasgenerales');
        // const EnfermedadesLDB = await getDataSQL('SELECT Id, lastUpdate FROM enfermedadescronicas');
        // const ResultadosLDB = await getDataSQL('SELECT Id, lastUpdate FROM resultados');
        // const VacunasLDB = await getDataSQL('SELECT Id, lastUpdate FROM vacunas');

        // Centros
        //console.log('Tamaño ' + CentrosRDB.data.remoteData.length)
        for (let i = 0; i < CentrosRDB.data.remoteData.length; i++) {
            //console.log('SELECT Id, lastUpdate FROM Centros WHERE Id = ' + CentrosRDB.data.remoteData[i].id);
            const CentroLDB = await getDataSQL('SELECT Id, lastUpdate FROM Centros WHERE Id = ?', CentrosRDB.data.remoteData[i].id);
            //console.log(CentroLDB[0].lastUpdate);
            //console.log('Fecha R: ' + new Date(CentrosRDB.data.remoteData[i].lastUpdate) + ' || Fecha L: ' + new Date(CentroLDB[0].lastUpdate));
            if(CentroLDB[0] != null){
                if (new Date(CentrosRDB.data.remoteData[i].lastUpdate) > new Date(CentroLDB[0].lastUpdate)) {
                    //console.log('ENTRO');
                    await insertDataSQL(
                        'UPDATE Centros SET name = ?, description = ?, latitude = ?, longitude = ?, type = ?, privado = ?, duracionCita = ?, horaInicio = ?, horaFin = ?, horaParada = ?, horaVuelta = ?, lastUpdate = ? WHERE id = ?',
                        [
                          CentrosRDB.data.remoteData[i].name,
                          CentrosRDB.data.remoteData[i].description,
                          CentrosRDB.data.remoteData[i].latitude,
                          CentrosRDB.data.remoteData[i].longitude,
                          CentrosRDB.data.remoteData[i].type,
                          CentrosRDB.data.remoteData[i].privado,
                          CentrosRDB.data.remoteData[i].duracionCita,
                          CentrosRDB.data.remoteData[i].horaInicio,
                          CentrosRDB.data.remoteData[i].horaFin,
                          CentrosRDB.data.remoteData[i].horaParada,
                          CentrosRDB.data.remoteData[i].horaVuelta,
                          CentrosRDB.data.remoteData[i].lastUpdate,
                          CentrosRDB.data.remoteData[i].id
                        ]
                    );
                }
            }else{
                await insertDataSQL(
                    'INSERT INTO Centros (id, name, description, latitude, longitude, type, privado, duracionCita, horaInicio, horaFin, horaParada, horaVuelta, lastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                      CentrosRDB.data.remoteData[i].id,
                      CentrosRDB.data.remoteData[i].name,
                      CentrosRDB.data.remoteData[i].description,
                      CentrosRDB.data.remoteData[i].latitude,
                      CentrosRDB.data.remoteData[i].longitude,
                      CentrosRDB.data.remoteData[i].type,
                      CentrosRDB.data.remoteData[i].privado,
                      CentrosRDB.data.remoteData[i].duracionCita,
                      CentrosRDB.data.remoteData[i].horaInicio,
                      CentrosRDB.data.remoteData[i].horaFin,
                      CentrosRDB.data.remoteData[i].horaParada,
                      CentrosRDB.data.remoteData[i].horaVuelta,
                      CentrosRDB.data.remoteData[i].lastUpdate
                    ]
                );                  
            }
        }

        console.log('Actualización', 'Datos actualizados desde el servidor');


    } catch (error) {
        console.error('Error al realizar la comparación:', error);
    }
};




