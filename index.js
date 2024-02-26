const express = require("express");
const fs = require("fs");

const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(cors());

// Middleware para parsear el cuerpo de las peticiones
app.use(bodyParser.json());

app.listen(5000, console.log("El servidor esta activo"));

const getRepertorio = () => {
  const fullRepertorio = fs.readFileSync("repertorio.json", "utf-8");
  const repertorio = JSON.parse(fullRepertorio);
  return repertorio;
};

app.get("/canciones", (req, res) => {
  const repertorio = getRepertorio(); // <--- Obtenemos el repertorio completo de las canciones
  res.json(repertorio);
});

app.post("/canciones", (req, res) => {
  //recibe el objeto que contiene la inforamción de la nueva canción
  //omite el id, porque lo genera de forma automática
  const { cancion, artista, tono } = req.body;

  const repertorio = getRepertorio(); // <--- Obtenemos el repertorio completo de las canciones

  //obtenemos el id del nuevo objeto  a insertar en el array
  var newId;
  try {
    newId = Number(repertorio[repertorio.length - 1].id) + 1;
  } catch (error) {
    newId = 1;
  }

  //creamos el objeto a insertar
  const nuevaCancion = {
    id: newId,
    cancion: cancion,
    artista: artista,
    tono: tono,
  };

  repertorio.push(nuevaCancion); // <--- Agregamos la nueva canción al arreglo

  fs.writeFileSync("repertorio.json", JSON.stringify(repertorio)); //<-- Guardamos los cambios en el archivo

  res.json(repertorio);
});

app.delete("/canciones/:id", async (req, res) => {
    //recupero el parametro de la cancion a eliminar
    const id = req.params.id;
      
    let repertorio = getRepertorio();// <--- Obtenemos el repertorio completo de las canciones
    
    //busco si el ID enviado existe en el arreglo del repertorio
    const cancion = repertorio.find((cancion) => cancion.id === Number(id));
   
    //Si el ID no existe, retrorno el mensaje
     if (!cancion) {
       res.status(404).json({ message: "Canción no encontrada" });
     }
  
     //si el ID existe, filtro el arreglo, quitando solo ese ID y guardo el reprtorio nuevamente
    newRepertorio = repertorio.filter((cancion) => cancion.id !== Number(id));
    fs.writeFileSync("repertorio.json", JSON.stringify(newRepertorio));

    //retorno el nuevo repertorio
    res.json(newRepertorio);
    
  });

  app.put("/canciones/:id", async (req, res) => {
    //recupero el parametro de la cancion a eliminar
    const id = req.params.id;

    const { cancion, artista, tono } = req.body;

    let repertorio = getRepertorio();// <--- Obtenemos el repertorio completo de las canciones

    const indexCancion = repertorio.findIndex((cancion) => cancion.id === Number(id));

    if(indexCancion==-1){
        res.status(404).json({ message: "Canción no encontrada" });
    }
    else{
        repertorio[indexCancion].cancion = cancion;
        repertorio[indexCancion].artista = artista;
        repertorio[indexCancion].tono = tono;
    
        fs.writeFileSync("repertorio.json", JSON.stringify(repertorio));
    }

    
    res.json(repertorio);

  })