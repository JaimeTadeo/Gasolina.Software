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

// NUEVO: elementos para notificar estado de la fila y recomendaciones
const filaEstado = document.createElement("div");
filaEstado.innerHTML = `
    <h3>Clientes</h3>
    <label for="numeroPersonas">¿Cuántas personas hay en la fila?</label>
    <input type="number" id="numeroPersonas" min="0" />
    <select id="surtidorSeleccionado">
        <option value="1">Surtidor 1</option>
        <option value="2">Surtidor 2</option>
    </select>
    <button id="informarFila">Informar estado de la fila</button>
    <div id="mensajeFila"></div>
    <div id="recomendacionSurtidor"></div>
`;
document.body.appendChild(filaEstado);

const inputFila = document.getElementById("numeroPersonas");
const botonFila = document.getElementById("informarFila");
const mensajeFila = document.getElementById("mensajeFila");
const selectSurtidor = document.getElementById("surtidorSeleccionado");
const recomendacionDiv = document.getElementById("recomendacionSurtidor");

let click = false;

const surtidores = {
    1: { litros: 1000, horario: { apertura: "08:00", cierre: "20:00" }, filas: [] },
    2: { litros: 800, horario: { apertura: "09:00", cierre: "18:00" }, filas: [] }
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

// NUEVO: lógica para notificar sobre filas, hora pico y sugerencias
botonFila.addEventListener("click", () => {
    const numero = parseInt(inputFila.value);
    const id = parseInt(selectSurtidor.value);

    if (isNaN(numero) || numero < 0) {
        mensajeFila.textContent = "Por favor ingresa un número válido de personas.";
        mensajeFila.style.color = "red";
        return;
    }

    surtidores[id].filas.push({ personas: numero, hora: new Date() });

    let mensaje = "";
    if (numero === 0) {
        mensaje = `Surtidor ${id}: No hay personas en la fila.`;
    } else if (numero <= 3) {
        mensaje = `Surtidor ${id}: Pocas personas en la fila (${numero}).`;
    } else if (numero <= 6) {
        mensaje = `Surtidor ${id}: Fila moderada (${numero} personas).`;
    } else {
        mensaje = `Surtidor ${id}: ¡Fila muy larga! (${numero} personas).`;
    }

    mensajeFila.textContent = mensaje;
    mensajeFila.style.color = "green";

    // Calcular cuál surtidor tiene más fila actualmente
    const surtidorMasLleno = Object.entries(surtidores).reduce((a, b) => {
        return (a[1].filas.slice(-1)[0]?.personas || 0) > (b[1].filas.slice(-1)[0]?.personas || 0) ? a : b;
    });

    const nombreMasLleno = surtidorMasLleno[0];
    const filaMasLleno = surtidorMasLleno[1].filas.slice(-1)[0]?.personas || 0;

    // Calcular hora pico (más personas) y hora baja (menos personas)
    const historial = surtidores[id].filas;
    if (historial.length > 1) {
        const horaPico = historial.reduce((a, b) => (a.personas > b.personas ? a : b));
        const horaBaja = historial.reduce((a, b) => (a.personas < b.personas ? a : b));

        recomendacionDiv.innerHTML = `
            <p>Recomendación:</p>
            <ul>
                <li>El surtidor más lleno ahora es el ${nombreMasLleno} con ${filaMasLleno} personas.</li>
                <li>Hora pico estimada del surtidor ${id}: ${horaPico.hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${horaPico.personas} personas)</li>
                <li>Hora baja estimada del surtidor ${id}: ${horaBaja.hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${horaBaja.personas} personas)</li>
            </ul>
        `;
    }
});
