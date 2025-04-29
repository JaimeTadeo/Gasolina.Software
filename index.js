import gasolinera from "./src/gasolinera.js";
import { agregarGasolina } from "./src/gasolineraAdmin.js";
import { notificarCamionLlegado } from "./src/gasolineraAdmin.js";
import { modificarHorario } from "./src/gasolineraAdmin.js";

const boton = document.getElementById("mostrarDisponibilidad");
const resultado = document.getElementById("resultado");
const botonAdmin = document.getElementById("agregarGasolina");
const inputSurtidor = document.getElementById("surtidorId");
const inputCantidad = document.getElementById("cantidadLitros");
const errorDiv = document.getElementById("error");
const mensajeCamion = document.getElementById("mensajeCamion");
const botonCamion = document.getElementById("notificarCamion");
const horariosSurtidores = document.getElementById("horariosSurtidores");
const botonModificarHorario = document.getElementById("modificarHorario");
const errorHorario = document.getElementById("errorHorario");

let click = false;

const surtidores = {
    1: { litros: 1000, horario: { apertura: "08:00", cierre: "20:00" } },
    2: { litros: 800, horario: { apertura: "09:00", cierre: "18:00" } }
};

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


function renderizarHorarios() {
    horariosSurtidores.innerHTML = "";
    for (const id in surtidores) {
        const surtidor = surtidores[id];
        const div = document.createElement("div");
        div.textContent = `Surtidor ${id}: Apertura ${surtidor.horario.apertura}, Cierre ${surtidor.horario.cierre}`;
        horariosSurtidores.appendChild(div);
    }
}

// Inicializar horarios
renderizarHorarios();

botonModificarHorario.addEventListener("click", () => {
    const id = parseInt(document.getElementById("surtidorHorarioId").value);
    const apertura = document.getElementById("nuevaApertura").value;
    const cierre = document.getElementById("nuevoCierre").value;

    try {
        modificarHorario(surtidores, id, apertura, cierre);
        errorHorario.textContent = "";
        renderizarHorarios();
    } catch (error) {
        errorHorario.textContent = error.message;
    }
});