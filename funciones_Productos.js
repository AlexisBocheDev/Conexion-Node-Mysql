export function datosProductos(app, conexion){
    app.get("/", async (req, res) =>{
        const mensaje = req.query.mensaje || ""; // Obtén el mensaje de la query string
        let mostrar = "select * from productos";
        try {
            let [results] = await conexion.query(mostrar);
            return res.render("index",{results:results, mensaje});
        } catch (error) {
            console.log("Error al mostrar datos:", error);
            res.status(500).send("Error al mostrar datos");
        }
    });
}

export function insertarProductos(app, conexion){
    app.post("/registro", async (req, res) => {
        const { id_prod, nombre, cantidad, precio_prove, precio_publico} = req.body;
        console.log("Datos recibidos:", req.body);

        try {
            // Saber si el producto ya existe
            const buscar = "SELECT * FROM productos where id_prod=?";
            let [SiExiste] = await conexion.query(buscar, [id_prod]);
            console.log("variable SiExiste:", SiExiste);
            console.log("variable SiExiste.length:", SiExiste.length);
            if (SiExiste.length > 0) {
                console.log("El ID del producto ya existe");
                return res.redirect(`/?mensaje=El ID ya existe`);
            }
            // insertar el nuevo producto
            const registrar = `
                    insert into productos (id_prod,nombre,cantidad,precio_Provedor,precio_publico)
                    values (?,?,?,?,?)`;

            await conexion.query(registrar, [id_prod, nombre, cantidad, precio_prove, precio_publico]);
            return res.redirect(`/?mensaje=Se inserto el producto correctamente 👍`);
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).send("Error en el servidor, verifique");
        }
    });
}


export function MostrarDatosEliminar(app, conexion){
    app.get("/eliminarProd", async (req, res) =>{
        const mensaje = req.query.mensaje || ""; // Obtén el mensaje de la query string
        let mostrar = "select * from productos";
        try {
            let [results] =await conexion.query(mostrar);
            return res.render("eliminarProd",{results:results,mensaje});
        } catch (error) {
            console.log("Error al mostrar datos:", error);
            res.status(500).send("Error al mostrar datos");
        }
    });
} 

export function EliminarProd(app, conexion) {
    app.post("/eliminar_prod", async (req, res) =>{
        try{ 
            const datos = req.body;
            console.log("La variable datos dice:", datos);
            let id_prod = datos.id_prod;
            let eliminar = "Delete from productos where id_prod=?";
            const [validar] = await conexion.query(eliminar,[id_prod]);
            console.info("variable validar:", validar);
            console.log("variable validar.affectedRows:", validar.affectedRows);

            if(validar.affectedRows>0){
                console.log("Se elimino el producto exitosamente");
                res.redirect(`/eliminarProd?mensaje=Se elimino el producto correctamente con el ID:${id_prod} 👍`); 
            }else{
                console.log("No se encuentra el producto 😒");
                res.redirect(`/eliminarProd?mensaje=No se encuentra el Producto 😒`); 
            }
            //res.render("eliminar", { mensaje });
        }catch(error){ 
            console.log("Algo salio mal en la consulta o servidor :(",error);
            res.status(500).send("Algo salio mal en la consulta o servidor :(");  
        }
    });
}
