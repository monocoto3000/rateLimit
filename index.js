const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let usuarios = [];

const accountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // Intervalo
    max: 6, // Cantidad max de peticiones
    message: "Demasiadas peticiones realizadas, intenta despues de 1 hora"
  });

app.get("/usuarios", (req, res) => {
    res.status(200).json(usuarios);
});

app.post("/usuarios", accountLimiter, (req, res) => {
    const nuevoUsuario = req.body;
    if (validarUsuario(nuevoUsuario)) {
        usuarios.push(nuevoUsuario);
        res.status(201).json(nuevoUsuario);
    } else {
        res.status(400).send("El formato del usuario es incorrecto");
    }
});

function validarUsuario(usuario) {
    return (
        usuario &&
        typeof usuario.nombre === "string" &&
        typeof usuario.apellido === "string" &&
        typeof usuario.edad === "number"
    );
}

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
