const express = require('express');
const mongoose = require('mongoose');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

//Crear servidor de express
const app = express();

//DB
mongoose.set('strictQuery', false);
dbConnection();

//CORS
app.use(cors());

//Directorio Publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//File Upload middleware
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/',
		createParentPath: true,
	})
);

//Rutas
app.use('/api/auth'    , require('./routes/auth'));
app.use('/api/users'   , require('./routes/users'));
app.use('/api/images'  , require('./routes/images'));
app.use('/api/boards'  , require('./routes/boards'));
app.use('/api/columns' , require('./routes/columns'));
app.use('/api/tasks'   , require('./routes/tasks'));
app.use('/api/subtasks', require('./routes/subtasks'));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
