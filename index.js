import gasolinera from "./src/gasolinera.js";

const boton = document.getElementById("mostrarDisponibilidad");
const resultado = document.getElementById("resultado");

let click = false;
let litrosDisponibles = 1000; // Puedes cambiarlo si quieres

boton.addEventListener("click", () => {
    click = true;
    const mensaje = gasolinera(click, litrosDisponibles);
    resultado.textContent = mensaje;
});
