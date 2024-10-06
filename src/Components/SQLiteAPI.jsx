import * as SQLite from 'expo-sqlite';

// Abrir la base de datos (si no existe, se crea automáticamente)
const db = SQLite.openDatabaseSync('SaludPublicaBBDD.db');
  
export const getDataSQL = async (sqlQuery, params = []) => {
    try {
        const result = db.getAllSync(sqlQuery, params);
        // console.log('\nConsulta realizada: ', sqlQuery);
        return result;
    } catch (error) {
        console.error('Error en la consulta', error);
    }
};

export const getDataSQLShowResult = async (sqlQuery, params = []) => {
    try {
        const result = db.getAllSync(sqlQuery, params);
        console.log('Consulta realizada:', sqlQuery, ' \nRESULTADO: ', result);
        return result;
    } catch (error) {
        console.error('Error en la consulta', error);
    }
};

export const insertDataSQL = async (sqlQuery, params = []) => {
    try {
        const result = db.runAsync(sqlQuery, params);
        // console.log('\nConsulta realizada: ', sqlQuery);
        return result;
    } catch (error) {
        console.error('Error en la insercción', error);
    }
};



//INSERTAR Centros
//db.runAsync('INSERT INTO Centros (name, description, latitude, longitude, type, privado) VALUES (?,?,?,?,?,?)', 'Farmacia Mostoles', 'Horario: 9:00-23:00', '40.328612797903034', '-3.870639229967378', 'Farmacia', false);

//AÑADIR NUEVOS CAMPOS A UNA TABLA
//db.runAsync('ALTER TABLE Centros ADD COLUMN duracionCita INT');

//ACTUALIZAR TABLA
// db.runAsync('UPDATE Usuario SET password = ? WHERE id = 2', '$2a$10$BHMLv.GYsS5hhBK0o9slHOPFbXdDRYfn8sGRltID.wRP3xsYBDUoW');
// db.runAsync('UPDATE Area SET name = ? WHERE Id = 1', 'Consulta General');
// getDataSQLShowResult('SELECT id, horaInicio, horaFin, horaParada, horaVuelta, duracionCita FROM Centros WHERE Type !=?', 'Farmacia');
// db.runAsync('UPDATE Centros SET horaInicio = ?, horaFin = ?, horaParada = ?, horaVuelta = ?, duracionCita = ? WHERE Id = 41', '09:00:00', '22:00:00', '14:00:00', '17:00:00', 60);

//BORRAR REGISTROS DE UNA TABLA
// db.runAsync('DELETE FROM Usuario WHERE id = 4');

getDataSQLShowResult('SELECT * FROM Usuario');

//INSERTAR TABLAS
// db.runAsync('CREATE TABLE Usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(255) NOT NULL, apellidos VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, telefono VARCHAR(15), fechaNacimiento DATE, admin BOOLEAN DEFAULT false)');
// db.runAsync('CREATE TABLE Area (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL, centro_id INT, FOREIGN KEY (centro_id) REFERENCES Centros(id))');
// db.runAsync('CREATE TABLE Dia (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE NOT NULL, festivo BOOLEAN NOT NULL)');
// db.runAsync('CREATE TABLE Horario (id INTEGER PRIMARY KEY AUTOINCREMENT, hora TIME, duracion INTEGER)');
// db.runAsync('CREATE TABLE Cita (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INT, centro_id INT, area_id INT, fecha DATE, hora TIME, estado VARCHAR(255) DEFAULT \'Pendiente\')');

// db.runAsync('CREATE TABLE ConsultasGenerales (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, fechaConsulta DATE NOT NULL, idMedico INTEGER NOT NULL, diagnostico TEXT, tratamiento TEXT)');
// db.runAsync('CREATE TABLE Alergias (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, fechaDescubrimiento DATE NOT NULL, alergia TEXT NOT NULL)');
// db.runAsync('CREATE TABLE Vacunas (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, fechaVacuna DATE NOT NULL, nombreVacuna TEXT NOT NULL)');
// db.runAsync('CREATE TABLE Resultados (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, fechaResultado DATE NOT NULL, tipoPrueba TEXT NOT NULL, resultado TEXT NOT NULL)');
// db.runAsync('CREATE TABLE EnfermedadesCronicas (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, fechaDescubrimiento DATE NOT NULL, enfermedad TEXT NOT NULL)');

//db.runAsync('CREATE TABLE NoticiasSalud (id INTEGER PRIMARY KEY AUTOINCREMENT, Titulo TEXT NOT NULL, Noticia TEXT NOT NULL, FechaPublicacion DATE NOT NULL, EdadesObjetivo TEXT NOT NULL)');

//db.runAsync('DROP TABLE EnfermedadesCronicas');

// db.runAsync('ALTER TABLE Usuario ADD COLUMN fechaNacimiento DATE');

//INSERTAR CITAS
// db.runAsync('DELETE FROM Cita WHERE id = 1');
//db.runAsync('INSERT INTO Cita (user_id, centro_id, area_id, fecha, hora, estado) VALUES (?,?,?,?,?,?)', 0,1,1,'2024-10-01', '08:30:00');
//getDataSQLShowResult('SELECT * FROM Cita WHERE centro_id = 1 AND area_id = 1 AND fecha = "2024-10-01" AND hora = "08:30:00"');
//getDataSQLShowResult('SELECT * FROM Cita WHERE centro_id = ? AND area_id = ? AND fecha = ? AND hora = ?', 1, 1, "2024-10-01", "08:30:00");

//getDataSQLShowResult('SELECT * FROM Cita');
// db.runAsync('DELETE FROM Cita WHERE id > 1');

//INSERTAR AREAS
// db.runAsync('DELETE FROM Area WHERE centro_id = 3');
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Consulta general', 1);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Pediatría', 1);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Ginecología', 1);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Radiología', 1);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Rehabilitación', 1);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Psiquiatría', 1);

// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Medicina de Familia', 4);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Enfermería', 4);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Medicina de Familia', 8);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Enfermería', 8);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Medicina de Familia', 9);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Enfermería', 9);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Medicina de Familia', 10);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Enfermería', 10);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Medicina de Familia', 11);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Enfermería', 11);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Medicina de Familia', 12);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Enfermería', 12);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Medicina de Familia', 13);
// db.runAsync('INSERT INTO Area (name, centro_id) VALUES (?,?)', 'Enfermería', 13);
//getDataSQLShowResult('SELECT * FROM Area');


//INSERTAR USUARIOS
// db.runAsync('INSERT INTO Usuario (nombre, apellidos, email, password, telefono, fechaNacimiento, admin) VALUES (?,?,?,?,?,?,?)', 'Mario', 'García Barrero', 'm.garciaba.2019@alumnos.urjc.es', '1234', '616879471', false);
// db.runAsync('INSERT INTO Usuario (nombre, apellidos, email, password, telefono, fechaNacimiento, admin) VALUES (?,?,?,?,?,?,?)', 'Admin', 'Test', 'admin@admin.com', '1234', '123456789', true);
//getDataSQLShowResult('SELECT * FROM Usuario');


// INSERTAR DIAS
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-01'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-02'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-03'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-04'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-05'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-06'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-07'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-08'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-09'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-10'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-11'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-12'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-13'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-14'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-15'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-16'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-17'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-18'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-19'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-20'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-21'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-22'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-23'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-24'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-25'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-26'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-27'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-28'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-29'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-30'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-10-31'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-01'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-02'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-03'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-04'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-05'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-06'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-07'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-08'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-09'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-10'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-11'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-12'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-13'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-14'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-15'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-16'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-17'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-18'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-19'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-20'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-21'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-22'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-23'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-24'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-25'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-26'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-27'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-28'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-29'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-11-30'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-01'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-02'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-03'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-04'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-05'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-06'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-07'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-08'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-09'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-10'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-11'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-12'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-13'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-14'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-15'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-16'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-17'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-18'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-19'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-20'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-21'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-22'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-23'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-24'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-25'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-26'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-27'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-28'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-29'), 1);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-30'), 0);
// db.runAsync('INSERT INTO Dia (date, festivo) VALUES (?,?)', ('2024-12-31'), 0);
// getDataSQLShowResult('SELECT * FROM Dia');


//INSERTAR HORARIO
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '08:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '08:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '09:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '09:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '10:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '10:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '11:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '11:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '12:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '12:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '13:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '13:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '14:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '14:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '15:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '15:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '16:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '16:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '17:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '17:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '18:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '18:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '19:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '19:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '20:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '20:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '21:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '21:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '22:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '22:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '23:00:00', 60);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '23:30:00', 30);
// db.runAsync('INSERT INTO Horario (hora, duracion) VALUES (?,?)', '00:00:00', 60);
// getDataSQLShowResult('SELECT * FROM Horario');


// INSERTAR CONSULTAS GENERALES
// db.runAsync('INSERT INTO ConsultasGenerales (userId, fechaConsulta, idMedico, diagnostico, tratamiento) VALUES (?, ?, ?, ?, ?)', 3, '2024-09-01', 101, 'Gripe leve', 'Paracetamol 500mg cada 8 horas');
// getDataSQLShowResult('SELECT * FROM ConsultasGenerales');

// INSERTAR CONSULTAS ALERGIA
// db.runAsync('INSERT INTO Alergias (userId, fechaDescubrimiento, alergia) VALUES (?, ?, ?)', 3, '2023-05-15', 'Polen');
// getDataSQLShowResult('SELECT * FROM Alergias');

// INSERTAR CONSULTAS VACUNAS
// db.runAsync('INSERT INTO Vacunas (userId, fechaVacuna, nombreVacuna) VALUES (?, ?, ?)', 3, '2022-11-20', 'Vacuna antigripal');
// getDataSQLShowResult('SELECT * FROM Vacunas');

// INSERTAR CONSULTAS RESULTADOS
// db.runAsync('INSERT INTO Resultados (userId, fechaResultado, tipoPrueba, resultado) VALUES (?, ?, ?, ?)', 3, '2024-08-18', 'Hemograma', 'Resultados normales');
// getDataSQLShowResult('SELECT * FROM Resultados');

// INSERTAR CONSULTAS ENFERMEDADES
// db.runAsync('INSERT INTO EnfermedadesCronicas (userId, fechaDescubrimiento, enfermedad) VALUES (?, ?, ?)', 3, '2020-03-10', 'Hipertensión');
// getDataSQLShowResult('SELECT * FROM EnfermedadesCronicas');

// INSERTAR NOTICIAS
// db.runAsync('INSERT INTO NoticiasSalud (Titulo, Noticia, FechaPublicacion, EdadesObjetivo) VALUES (?,?,?,?)', 'Nueva campaña de vacunación contra la neumonía para mayores de 65 años','Las autoridades sanitarias han lanzado una nueva campaña de vacunación contra la neumonía, destinada exclusivamente a personas mayores de 65 años. La neumonía es una de las principales causas de complicaciones graves en los ancianos, por lo que la vacunación es fundamental para reducir los riesgos. Las vacunas estarán disponibles de manera gratuita en todos los centros de salud durante los próximos tres meses.','2024-10-01','Ancianos');
// getDataSQLShowResult('SELECT * FROM NoticiasSalud');