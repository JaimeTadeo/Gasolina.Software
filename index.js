import gasolinera from "./src/gasolinera.js";
import { generarTicket } from "./src/ticket.js";
import { calificarSurtidor, obtenerCalificaciones } from "./src/gasolineraAdmin.js";
import { 
    agregarGasolina, 
    notificarCamionLlegado, 
    modificarHorario,
    reportarFila,
    obtenerReporteFilas,
    notificarAdministrador 
} from "./src/gasolineraAdmin.js";
import { reportarSurtidorSinGasolina } from './src/reportarSurtidor.js';

document.querySelectorAll('.btn-reportar').forEach(boton => {
  boton.addEventListener('click', () => {
    const idSurtidor = boton.id.split('-')[2]; // Extrae "S1" o "S2"
    reportarSurtidorSinGasolina(idSurtidor);
    alert(`Surtidor ${idSurtidor} reportado sin gasolina`);
  });
});
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
const btnPositivo = document.getElementById("btnPositivo");
const btnNegativo = document.getElementById("btnNegativo");
const selectCalificacion = document.getElementById("surtidorCalificacion");

// Elementos para gestión de filas
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
    1: { 
        litros: 1000, 
        horario: { apertura: "08:00", cierre: "20:00" }, 
        filas: [],
        calificaciones: { positivas: 0, negativas: 0 } // <-- Añade esto
    },
    2: { 
        litros: 800, 
        horario: { apertura: "09:00", cierre: "18:00" }, 
        filas: [],
        calificaciones: { positivas: 0, negativas: 0 } // <-- Añade esto
    }
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

// Eventos principales
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

// Gestión de horarios
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

// Sistema de gestión de filas
botonFila.addEventListener("click", () => {
    const numero = parseInt(inputFila.value);
    const id = parseInt(selectSurtidor.value);

    try {
        // Registrar en el sistema
        reportarFila(surtidores, id, numero);
        
        // Notificar al administrador
        notificarAdministrador(`Nuevo reporte: Surtidor ${id} - ${numero} personas`);
        
        // Actualizar UI
        mensajeFila.innerHTML = `
            <span style="color: green;">✓ Reporte exitoso:</span>
            Surtidor ${id} - ${numero} personas
        `;

        // Generar análisis
        const estadoActual = obtenerReporteFilas(surtidores);
        const surtidoresActivos = Object.entries(estadoActual)
            .filter(([_, s]) => s.filas.length > 0)
            .sort((a, b) => b.filas.slice(-1)[0].personas - a.filas.slice(-1)[0].personas);

        let analisisHTML = "<h4>Estado actual:</h4>";
        
        if (surtidoresActivos.length > 0) {
            surtidoresActivos.forEach(([id, data]) => {
                const ultimoReporte = data.filas.slice(-1)[0];
                analisisHTML += `
                    <div class="surtidor-info">
                        <strong>Surtidor ${id}:</strong>
                        <span>${ultimoReporte.personas} personas</span>
                        <small>(${ultimoReporte.hora.toLocaleTimeString()})</small>
                    </div>
                `;
            });
            
            const masConcurrido = surtidoresActivos[0];
            analisisHTML += `
                <div class="destacado">
                    🚦 Más concurrido: Surtidor ${masConcurrido[0]} 
                    (${masConcurrido[1].filas.slice(-1)[0].personas} personas)
                </div>
            `;
        } else {
            analisisHTML += "<p>✅ Todos los surtidores están disponibles</p>";
        }
        
        recomendacionDiv.innerHTML = analisisHTML;

    } catch (error) {
        mensajeFila.innerHTML = `
            <span style="color: red;">✗ Error:</span> ${error.message}
        `;
    } finally {
        inputFila.value = "";
    }
});

// Función auxiliar para formato de hora
function formatoHoraAmigable(fecha) {
    return fecha.toLocaleTimeString("es-ES", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true
    });
    

// Nuevos elementos
const btnPositivo = document.getElementById("btnPositivo");
const btnNegativo = document.getElementById("btnNegativo");
const selectCalificacion = document.getElementById("surtidorCalificacion");
const mensajeCalificacion = document.getElementById("mensajeCalificacion");
const estadoCalificaciones = document.getElementById("estadoCalificaciones");

// Eventos de calificación
btnPositivo.addEventListener("click", () => manejarCalificacion(true));
btnNegativo.addEventListener("click", () => manejarCalificacion(false));

function manejarCalificacion(esPositiva) {
    try {
        const id = parseInt(selectCalificacion.value);
        calificarSurtidor(surtidores, id, esPositiva);
        
        // Actualizar UI
        const calificaciones = obtenerCalificaciones(surtidores, id);
        const porcentaje = calcularPorcentaje(calificaciones);
        
        mensajeCalificacion.innerHTML = `
            <span style="color: green;">✓ Calificación registrada</span>
        `;
        
        estadoCalificaciones.innerHTML = `
            <p>Surtidor ${id}:</p>
            <progress value="${porcentaje}" max="100"></progress>
            <span>${porcentaje.toFixed(1)}% aprobación</span>
            <p>👍 ${calificaciones.positivas} | 👎 ${calificaciones.negativas}</p>
        `;
        
    } catch (error) {
        mensajeCalificacion.innerHTML = `
            <span style="color: red;">✗ Error: ${error.message}</span>
        `;
    }
}

function calcularPorcentaje(calificaciones) {
    const total = calificaciones.positivas + calificaciones.negativas;
    return total > 0 ? (calificaciones.positivas / total) * 100 : 0;
 }
}

// Añadir al final del archivo
function actualizarEstadoSurtidores() {
    const estado = obtenerSurtidorMasLleno(surtidores);
    const alertaDiv = document.getElementById("alertaSurtidores");
    
    let mensaje = "";
    if (estado.personas === 0) {
        mensaje = "✅ Todos los surtidores están disponibles";
        alertaDiv.style.backgroundColor = "#e6ffe6";
    } else {
        mensaje = `⚠️ Evitar surtidor ${estado.id} (${estado.personas} personas en fila)`;
        alertaDiv.style.backgroundColor = estado.personas > 5 ? "#ffe6e6" : "#fff7e6";
    }
    
    alertaDiv.innerHTML = `
        <p>${mensaje}</p>
        <small>Última actualización: ${new Date().toLocaleTimeString()}</small>
    `;
}

// Actualizar cada 30 segundos y al reportar filas
setInterval(actualizarEstadoSurtidores, 30000);
botonFila.addEventListener("click", actualizarEstadoSurtidores);