import { getDataSQL , insertDataSQL } from '../Components/SQLiteComponent.jsx';
import axios from 'axios';

export default SincroniceData = async () => {
    try {
        const CentrosRDB = await axios.post(process.env.API_URL + '/compare-update', { // ATENCION: CAMBIAR LA IP POR LA IPV4 DE ESTE ORDENADOR
            object: 'centros',
        });

        const AreasRDB = await axios.post(process.env.API_URL + '/compare-update', {
            object: 'area',
        });

        const NoticiasRDB = await axios.post(process.env.API_URL + '/compare-update', {
            object: 'noticiassalud',
        });

        const CitasRDB = await axios.post(process.env.API_URL + '/compare-update', {
            object: 'cita',
        });

        const AlergiasRDB = await axios.post(process.env.API_URL + '/compare-update', {
            object: 'alergias',
        });

        const ConsultasRDB = await axios.post(process.env.API_URL + '/compare-update', {
            object: 'consultasgenerales',
        });

        const EnfermedadesRDB = await axios.post(process.env.API_URL + '/compare-update', {
            object: 'enfermedadescronicas',
        });

        const ResultadosRDB = await axios.post(process.env.API_URL + '/compare-update', {
            object: 'resultados',
        });

        const VacunasRDB = await axios.post(process.env.API_URL + '/compare-update', {
            object: 'vacunas',
        });


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

        // Areas
        for (let i = 0; i < AreasRDB.data.remoteData.length; i++) {
            //console.log('SELECT Id, lastUpdate FROM Area WHERE Id = ' + AreasRDB.data.remoteData[i].id);
            const AreaLDB = await getDataSQL('SELECT Id, lastUpdate FROM Area WHERE Id = ?', AreasRDB.data.remoteData[i].id);
            if (AreaLDB[0] != null) {
                if (new Date(AreasRDB.data.remoteData[i].lastUpdate) > new Date(AreaLDB[0].lastUpdate)) {
                    await insertDataSQL(
                        'UPDATE Area SET name = ?, centro_id = ?, lastUpdate = ? WHERE id = ?',
                        [
                            AreasRDB.data.remoteData[i].name,
                            AreasRDB.data.remoteData[i].centro_id,
                            AreasRDB.data.remoteData[i].lastUpdate,
                            AreasRDB.data.remoteData[i].id
                        ]
                    );
                }
            } else {
                await insertDataSQL(
                    'INSERT INTO Area (id, name, centro_id, lastUpdate) VALUES (?, ?, ?, ?)',
                    [
                        AreasRDB.data.remoteData[i].id,
                        AreasRDB.data.remoteData[i].name,
                        AreasRDB.data.remoteData[i].centro_id,
                        AreasRDB.data.remoteData[i].lastUpdate
                    ]
                );
            }
        }

        // NoticiasSalud
        for (let i = 0; i < NoticiasRDB.data.remoteData.length; i++) {
            //console.log('SELECT Id, lastUpdate FROM NoticiasSalud WHERE Id = ' + NoticiasRDB.data.remoteData[i].id);
            const NoticiaLDB = await getDataSQL('SELECT Id, lastUpdate FROM NoticiasSalud WHERE Id = ?', NoticiasRDB.data.remoteData[i].id);
            if (NoticiaLDB[0] != null) {
                if (new Date(NoticiasRDB.data.remoteData[i].lastUpdate) > new Date(NoticiaLDB[0].lastUpdate)) {
                    await insertDataSQL(
                        'UPDATE NoticiasSalud SET Titulo = ?, Noticia = ?, FechaPublicacion = ?, EdadesObjetivo = ?, lastUpdate = ? WHERE id = ?',
                        [
                            NoticiasRDB.data.remoteData[i].Titulo,
                            NoticiasRDB.data.remoteData[i].Noticia,
                            NoticiasRDB.data.remoteData[i].FechaPublicacion,
                            NoticiasRDB.data.remoteData[i].EdadesObjetivo,
                            NoticiasRDB.data.remoteData[i].lastUpdate,
                            NoticiasRDB.data.remoteData[i].id
                        ]
                    );
                }
            } else {
                await insertDataSQL(
                    'INSERT INTO NoticiasSalud (id, Titulo, Noticia, FechaPublicacion, EdadesObjetivo, lastUpdate) VALUES (?, ?, ?, ?, ?, ?)',
                    [
                        NoticiasRDB.data.remoteData[i].id,
                        NoticiasRDB.data.remoteData[i].Titulo,
                        NoticiasRDB.data.remoteData[i].Noticia,
                        NoticiasRDB.data.remoteData[i].FechaPublicacion,
                        NoticiasRDB.data.remoteData[i].EdadesObjetivo,
                        NoticiasRDB.data.remoteData[i].lastUpdate
                    ]
                );
            }
        }
        
        // ConsultasGenerales
        for (let i = 0; i < ConsultasRDB.data.remoteData.length; i++) {
            //console.log('SELECT Id, lastUpdate FROM ConsultasGenerales WHERE Id = ' + ConsultasRDB.data.remoteData[i].id);
            const ConsultaLDB = await getDataSQL('SELECT Id, lastUpdate FROM ConsultasGenerales WHERE Id = ?', ConsultasRDB.data.remoteData[i].id);
            if (ConsultaLDB[0] != null) {
                if (new Date(ConsultasRDB.data.remoteData[i].lastUpdate) > new Date(ConsultaLDB[0].lastUpdate)) {
                    await insertDataSQL(
                        'UPDATE ConsultasGenerales SET userId = ?, fechaConsulta = ?, idMedico = ?, diagnostico = ?, tratamiento = ?, lastUpdate = ? WHERE id = ?',
                        [
                            ConsultasRDB.data.remoteData[i].userId,
                            ConsultasRDB.data.remoteData[i].fechaConsulta,
                            ConsultasRDB.data.remoteData[i].idMedico,
                            ConsultasRDB.data.remoteData[i].diagnostico,
                            ConsultasRDB.data.remoteData[i].tratamiento,
                            ConsultasRDB.data.remoteData[i].lastUpdate,
                            ConsultasRDB.data.remoteData[i].id
                        ]
                    );
                }
            } else {
                await insertDataSQL(
                    'INSERT INTO ConsultasGenerales (id, userId, fechaConsulta, idMedico, diagnostico, tratamiento, lastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        ConsultasRDB.data.remoteData[i].id,
                        ConsultasRDB.data.remoteData[i].userId,
                        ConsultasRDB.data.remoteData[i].fechaConsulta,
                        ConsultasRDB.data.remoteData[i].idMedico,
                        ConsultasRDB.data.remoteData[i].diagnostico,
                        ConsultasRDB.data.remoteData[i].tratamiento,
                        ConsultasRDB.data.remoteData[i].lastUpdate
                    ]
                );
            }
        }
        
        // Alergias
        for (let i = 0; i < AlergiasRDB.data.remoteData.length; i++) {
            //console.log('SELECT Id, lastUpdate FROM Alergias WHERE Id = ' + AlergiasRDB.data.remoteData[i].id);
            const AlergiaLDB = await getDataSQL('SELECT Id, lastUpdate FROM Alergias WHERE Id = ?', AlergiasRDB.data.remoteData[i].id);
            if (AlergiaLDB[0] != null) {
                if (new Date(AlergiasRDB.data.remoteData[i].lastUpdate) > new Date(AlergiaLDB[0].lastUpdate)) {
                    await insertDataSQL(
                        'UPDATE Alergias SET userId = ?, fechaDescubrimiento = ?, alergia = ?, lastUpdate = ? WHERE id = ?',
                        [
                            AlergiasRDB.data.remoteData[i].userId,
                            AlergiasRDB.data.remoteData[i].fechaDescubrimiento,
                            AlergiasRDB.data.remoteData[i].alergia,
                            AlergiasRDB.data.remoteData[i].lastUpdate,
                            AlergiasRDB.data.remoteData[i].id
                        ]
                    );
                }
            } else {
                await insertDataSQL(
                    'INSERT INTO Alergias (id, userId, fechaDescubrimiento, alergia, lastUpdate) VALUES (?, ?, ?, ?, ?)',
                    [
                        AlergiasRDB.data.remoteData[i].id,
                        AlergiasRDB.data.remoteData[i].userId,
                        AlergiasRDB.data.remoteData[i].fechaDescubrimiento,
                        AlergiasRDB.data.remoteData[i].alergia,
                        AlergiasRDB.data.remoteData[i].lastUpdate
                    ]
                );
            }
        }
        
        // Vacunas
        for (let i = 0; i < VacunasRDB.data.remoteData.length; i++) {
            //console.log('SELECT Id, lastUpdate FROM Vacunas WHERE Id = ' + VacunasRDB.data.remoteData[i].id);
            const VacunaLDB = await getDataSQL('SELECT Id, lastUpdate FROM Vacunas WHERE Id = ?', VacunasRDB.data.remoteData[i].id);
            if (VacunaLDB[0] != null) {
                if (new Date(VacunasRDB.data.remoteData[i].lastUpdate) > new Date(VacunaLDB[0].lastUpdate)) {
                    await insertDataSQL(
                        'UPDATE Vacunas SET userId = ?, fechaVacuna = ?, nombreVacuna = ?, lastUpdate = ? WHERE id = ?',
                        [
                            VacunasRDB.data.remoteData[i].userId,
                            VacunasRDB.data.remoteData[i].fechaVacuna,
                            VacunasRDB.data.remoteData[i].nombreVacuna,
                            VacunasRDB.data.remoteData[i].lastUpdate,
                            VacunasRDB.data.remoteData[i].id
                        ]
                    );
                }
            } else {
                await insertDataSQL(
                    'INSERT INTO Vacunas (id, userId, fechaVacuna, nombreVacuna, lastUpdate) VALUES (?, ?, ?, ?, ?)',
                    [
                        VacunasRDB.data.remoteData[i].id,
                        VacunasRDB.data.remoteData[i].userId,
                        VacunasRDB.data.remoteData[i].fechaVacuna,
                        VacunasRDB.data.remoteData[i].nombreVacuna,
                        VacunasRDB.data.remoteData[i].lastUpdate
                    ]
                );
            }
        }
        
        // Resultados
        for (let i = 0; i < ResultadosRDB.data.remoteData.length; i++) {
            //console.log('SELECT Id, lastUpdate FROM Resultados WHERE Id = ' + ResultadosRDB.data.remoteData[i].id);
            const ResultadoLDB = await getDataSQL('SELECT Id, lastUpdate FROM Resultados WHERE Id = ?', ResultadosRDB.data.remoteData[i].id);
            if (ResultadoLDB[0] != null) {
                if (new Date(ResultadosRDB.data.remoteData[i].lastUpdate) > new Date(ResultadoLDB[0].lastUpdate)) {
                    await insertDataSQL(
                        'UPDATE Resultados SET userId = ?, fechaResultado = ?, tipoPrueba = ?, resultado = ?, lastUpdate = ? WHERE id = ?',
                        [
                            ResultadosRDB.data.remoteData[i].userId,
                            ResultadosRDB.data.remoteData[i].fechaResultado,
                            ResultadosRDB.data.remoteData[i].tipoPrueba,
                            ResultadosRDB.data.remoteData[i].resultado,
                            ResultadosRDB.data.remoteData[i].lastUpdate,
                            ResultadosRDB.data.remoteData[i].id
                        ]
                    );
                }
            } else {
                await insertDataSQL(
                    'INSERT INTO Resultados (id, userId, fechaResultado, tipoPrueba, resultado, lastUpdate) VALUES (?, ?, ?, ?, ?, ?)',
                    [
                        ResultadosRDB.data.remoteData[i].id,
                        ResultadosRDB.data.remoteData[i].userId,
                        ResultadosRDB.data.remoteData[i].fechaResultado,
                        ResultadosRDB.data.remoteData[i].tipoPrueba,
                        ResultadosRDB.data.remoteData[i].resultado,
                        ResultadosRDB.data.remoteData[i].lastUpdate
                    ]
                );
            }
        }
        
        // EnfermedadesCronicas
        for (let i = 0; i < EnfermedadesRDB.data.remoteData.length; i++) {
            //console.log('SELECT Id, lastUpdate FROM EnfermedadesCronicas WHERE Id = ' + EnfermedadesRDB.data.remoteData[i].id);
            const EnfermedadLDB = await getDataSQL('SELECT Id, lastUpdate FROM EnfermedadesCronicas WHERE Id = ?', EnfermedadesRDB.data.remoteData[i].id);
            if (EnfermedadLDB[0] != null) {
                if (new Date(EnfermedadesRDB.data.remoteData[i].lastUpdate) > new Date(EnfermedadLDB[0].lastUpdate)) {
                    await insertDataSQL(
                        'UPDATE EnfermedadesCronicas SET userId = ?, fechaDescubrimiento = ?, enfermedad = ?, lastUpdate = ? WHERE id = ?',
                        [
                            EnfermedadesRDB.data.remoteData[i].userId,
                            EnfermedadesRDB.data.remoteData[i].fechaDescubrimiento,
                            EnfermedadesRDB.data.remoteData[i].enfermedad,
                            EnfermedadesRDB.data.remoteData[i].lastUpdate,
                            EnfermedadesRDB.data.remoteData[i].id
                        ]
                    );
                }
            } else {
                await insertDataSQL(
                    'INSERT INTO EnfermedadesCronicas (id, userId, fechaDescubrimiento, enfermedad, lastUpdate) VALUES (?, ?, ?, ?, ?)',
                    [
                        EnfermedadesRDB.data.remoteData[i].id,
                        EnfermedadesRDB.data.remoteData[i].userId,
                        EnfermedadesRDB.data.remoteData[i].fechaDescubrimiento,
                        EnfermedadesRDB.data.remoteData[i].enfermedad,
                        EnfermedadesRDB.data.remoteData[i].lastUpdate
                    ]
                );
            }
        }

        // Citas
        for (let i = 0; i < CitasRDB.data.remoteData.length; i++) {
            //console.log('SELECT Id, lastUpdate FROM Cita WHERE Id = ' + CitasRDB.data.remoteData[i].id);
            const CitaLDB = await getDataSQL('SELECT Id, lastUpdate FROM Cita WHERE Id = ?', CitasRDB.data.remoteData[i].id);
            if (CitaLDB[0] != null) {
                if (new Date(CitasRDB.data.remoteData[i].lastUpdate) > new Date(CitaLDB[0].lastUpdate)) {
                    await insertDataSQL(
                        'UPDATE Cita SET user_id = ?, centro_id = ?, area_id = ?, fecha = ?, hora = ?, estado = ?, lastUpdate = ? WHERE id = ?',
                        [
                            CitasRDB.data.remoteData[i].user_id,
                            CitasRDB.data.remoteData[i].centro_id,
                            CitasRDB.data.remoteData[i].area_id,
                            CitasRDB.data.remoteData[i].fecha,
                            CitasRDB.data.remoteData[i].hora,
                            CitasRDB.data.remoteData[i].estado,
                            CitasRDB.data.remoteData[i].lastUpdate,
                            CitasRDB.data.remoteData[i].id
                        ]
                    );
                }
            } else {
                await insertDataSQL(
                    'INSERT INTO Cita (id, user_id, centro_id, area_id, fecha, hora, estado, lastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        CitasRDB.data.remoteData[i].id,
                        CitasRDB.data.remoteData[i].user_id,
                        CitasRDB.data.remoteData[i].centro_id,
                        CitasRDB.data.remoteData[i].area_id,
                        CitasRDB.data.remoteData[i].fecha,
                        CitasRDB.data.remoteData[i].hora,
                        CitasRDB.data.remoteData[i].estado,
                        CitasRDB.data.remoteData[i].lastUpdate
                    ]
                );
            }
        }


        console.log('Datos actualizados desde el servidor');


    } catch (error) {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error en la respuesta del servidor:', error.response.data);
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            // Algo sucedió al configurar la solicitud que desencadenó un error
            console.error('Error al configurar la solicitud:', error.message);
        }
        console.error('Error al realizar la comparación:', error.config);
    }
};




