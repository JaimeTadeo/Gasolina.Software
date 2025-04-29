import gasolinera from "./src/gasolinera.js";
import { agregarGasolina } from "./src/gasolineraAdmin.js";
import { notificarCamionLlegado } from "./src/gasolineraAdmin.js";

const boton = document.getElementById("mostrarDisponibilidad");
const resultado = document.getElementById("resultado");

const botonAdmin = document.getElementById("agregarGasolina");
const inputSurtidor = document.getElementById("surtidorId");
const inputCantidad = document.getElementById("cantidadLitros");
const errorDiv = document.getElementById("error");
const mensajeCamion = document.getElementById("mensajeCamion");
const botonCamion = document.getElementById("notificarCamion");

let click = false;

const surtidores = [
    { id: 1, litros: 500 },
    { id: 2, litros: 300 },
    { id: 3, litros: 800 }
];

function renderizarSurtidores() {
    const mensajes = gasolinera(true, surtidores);

    resultado.innerHTML = "";
    mensajes.forEach(mensaje => {
        const p = document.createElement("p");
        p.textContent = mensaje;
        resultado.appendChild(p);
    });
}

boton.addEventListener("click", () => {
    click = true;
    renderizarSurtidores();
    boton.style.display = "none";
});

botonAdmin.addEventListener("click", () => {
    const id = parseInt(inputSurtidor.value, 10);
    const cantidad = parseFloat(inputCantidad.value);

    errorDiv.textContent = "";

    try {
        agregarGasolina(surtidores, id, cantidad);
        renderizarSurtidores();
        inputSurtidor.value = "";
        inputCantidad.value = "";
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.color = "red";
    }
});

botonCamion.addEventListener("click", () => {
    notificarCamionLlegado((mensaje) => {
        mensajeCamion.textContent = mensaje;
    });
});
