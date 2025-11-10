import express from "express";
import mysql from "mysql2/promise";
import {datosProductos, insertarProductos,MostrarDatosEliminar,
        EliminarProd
 } from "./funciones_Productos.js";
import dotenv from "dotenv";

dotenv.config(); // <-- Esto carga las variables del entorno (en local o Railway)

//objeto para llamar a los metodos de express
export const app = express();
// para que sepa este servidor que vamos a utilizar el motor de plantillas ejs
app.set("view engine", "ejs");// le decimos que utilizaremos ejs como motor de plantillas
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para datos de formulario

//ruta de archivos estaticos, middleware 
app.use(express.static("public")); 
//nos ayuda a definir cual es la ruta para todas las paginas estaticas como imagenes, videos, HTML, CSS y JS

try{
    const conexion = await mysql.createConnection({
        host: process.env.MYSQLHOST || "127.0.0.1",
        port: process.env.MYSQLPORT || 3306,
        database: process.env.MYSQLDATABASE || "tienda",
        user: process.env.MYSQLUSER || "root",
        password: process.env.MYSQLPASSWORD || "Alexisroot12",
    });
    console.log("Conectado a la base de datos ✅");
    datosProductos(app, conexion)
    insertarProductos(app, conexion)
    MostrarDatosEliminar(app, conexion)
    EliminarProd(app, conexion)
}catch(error){
    console.error("❌ Error al conectar a la base de datos:", error);
}


app.get("/", function (req, res) {
    res.render("index");
});

app.get("/eliminarProd", function (req, res) {
    res.render("eliminarProd");
});


// Railway define su propio puerto en process.env.PORT
const PORT = process.env.PORT || 3002;

//configurar el puerto usado para el servidor local
app.listen(PORT, function () {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

