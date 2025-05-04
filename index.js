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

// NUEVO: elementos para notificar estado de la fila
const filaEstado = document.createElement("div");
filaEstado.innerHTML = `
    <h3>Clientes</h3>
    <label for="numeroPersonas">¿Cuántas personas hay en la fila?</label>
    <input type="number" id="numeroPersonas" min="0" />
    <button id="informarFila">Informar estado de la fila</button>
    <div id="mensajeFila"></div>
`;
document.body.appendChild(filaEstado);

const inputFila = document.getElementById("numeroPersonas");
const botonFila = document.getElementById("informarFila");
const mensajeFila = document.getElementById("mensajeFila");

// NUEVO: lógica para calificar atención
const botonCalificarAgradable = document.getElementById("calificarAgradable");
const botonCalificarDesagradable = document.getElementById("calificarDesagradable");
const inputOpinionId = document.getElementById("surtidorOpinionId");
const mensajeOpinion = document.getElementById("mensajeOpinion");

const opiniones = {};  // {1: {agradable: 0, desagradable: 0}, ...}

function registrarOpinion(id, tipo) {
    if (!opiniones[id]) {
        opiniones[id] = { agradable: 0, desagradable: 0 };
    }
    opiniones[id][tipo]++;
}

function mostrarOpinion(id) {
    const o = opiniones[id];
    if (!o) {
        mensajeOpinion.textContent = `No hay opiniones registradas para el surtidor ${id}.`;
        mensajeOpinion.style.color = "gray";
        return;
    }

    mensajeOpinion.textContent = `Surtidor ${id} - Agradable: ${o.agradable}, Desagradable: ${o.desagradable}`;
    mensajeOpinion.style.color = "green";
}

botonCalificarAgradable.addEventListener("click", () => {
    const id = parseInt(inputOpinionId.value);
    if (isNaN(id) || !surtidores[id]) {
        mensajeOpinion.textContent = "Ingresa un ID de surtidor válido.";
        mensajeOpinion.style.color = "red";
        return;
    }

    registrarOpinion(id, "agradable");
    mostrarOpinion(id);
});

botonCalificarDesagradable.addEventListener("click", () => {
    const id = parseInt(inputOpinionId.value);
    if (isNaN(id) || !surtidores[id]) {
        mensajeOpinion.textContent = "Ingresa un ID de surtidor válido.";
        mensajeOpinion.style.color = "red";
        return;
    }

    registrarOpinion(id, "desagradable");
    mostrarOpinion(id);
});

let click = false;

const surtidores = {
    1: { litros: 1000, horario: { apertura: "08:00", cierre: "20:00" } },
    2: { litros: 800, horario: { apertura: "09:00", cierre: "18:00" } }
};

function renderizarSurtidores() {
    const dataArray = Object.entries(surtidores).map(([id, s]) => ({
        id,
        litros: s.litros
    }));

    const mensajes = gasolinera(true, dataArray);

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

// lógica para mostrar estado de la fila
botonFila.addEventListener("click", () => {
    const numero = parseInt(inputFila.value);
    if (isNaN(numero) || numero < 0) {
        mensajeFila.textContent = "Por favor ingresa un número válido de personas.";
        mensajeFila.style.color = "red";
        return;
    }

    let mensaje = "";
    if (numero === 0) {
        mensaje = "No hay personas en la fila.";
    } else if (numero <= 3) {
        mensaje = `Hay pocas personas en la fila (${numero}).`;
    } else if (numero <= 6) {
        mensaje = `Hay una fila moderada (${numero} personas).`;
    } else {
        mensaje = `La fila está larga (${numero} personas).`;
    }

    mensajeFila.textContent = mensaje;
    mensajeFila.style.color = "green";
});
