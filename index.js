import gasolinera from "./src/gasolinera.js";
import { generarTicket } from "./src/ticket.js";
import { calificarSurtidor, obtenerCalificaciones, obtenerSurtidorMasLleno } from "./src/gasolineraAdmin.js";
import {
    agregarGasolina,
    notificarCamionLlegado,
    modificarHorario,
    reportarFila,
    obtenerReporteFilas,
    notificarAdministrador
} from "./src/gasolineraAdmin.js";
import { reportarSurtidorSinGasolina } from './src/reportarSurtidor.js';
// import { gestionarSurtidoresFavoritos, notificarDisponibilidad } from './src/gasolineraNotificaciones.js';
const botonMostrarDisponibilidad = document.getElementById("mostrarDisponibilidad");
const resultadoDiv = document.getElementById("resultado");
const botonAgregarGasolina = document.getElementById("agregarGasolina");
const inputSurtidorIdAdmin = document.getElementById("surtidorId");
const inputCantidadLitros = document.getElementById("cantidadLitros");
const errorAgregarGasolinaDiv = document.getElementById("error");
const botonModificarHorario = document.getElementById("modificarHorario");
const errorModificarHorarioDiv = document.getElementById("errorHorario");
const botonNotificarCamion = document.getElementById("notificarCamion");
const inputPersonasEnFila = document.getElementById("numeroPersonas");
const botonInformarFila = document.getElementById("informarFila");
const mensajeConfirmacionFilaAdminDiv = document.getElementById("mensajeFila");
const selectSurtidorReporteFila = document.getElementById("surtidorSeleccionado");
const systemNotificationsDiv = document.getElementById("systemNotifications");
const reportesFilasUsuarioViewDiv = document.getElementById("adminFilaReportes");
const btnCalificarPositivo = document.getElementById("btnPositivo");
const btnCalificarNegativo = document.getElementById("btnNegativo");
const selectSurtidorCalificacion = document.getElementById("surtidorCalificacion");
const mensajeCalificacionDiv = document.getElementById("mensajeCalificacion");
const estadoCalificacionesDiv = document.getElementById("estadoCalificaciones");
const horariosSurtidoresClienteDiv = document.getElementById("horariosSurtidoresCliente");
const alertaSurtidoresDiv = document.getElementById("alertaSurtidores");
const inputSurtidorFavoritoId = document.getElementById("surtidorFavoritoId");
const botonMarcarFavorito = document.getElementById("marcarFavorito");
const botonVerificarFavoritos = document.getElementById("verificarFavoritos");
const notificacionesFavoritosDiv = document.getElementById("notificaciones");
const botonSolicitarTicket = document.getElementById("solicitarTicket");
const numeroTicketSpan = document.getElementById("numeroTicket");
const mensajeTicketDiv = document.getElementById("mensajeTicket");


let isAvailabilityShown = false;

const surtidores = {
    1: {
        id: 1,
        nombre: "Surtidor Principal",
        litros: 1000,
        horario: { apertura: "08:00", cierre: "20:00" },
        filas: [],
        calificaciones: { positivas: 0, negativas: 0 }
    },
    2: {
        id: 2,
        nombre: "Surtidor Secundario",
        litros: 800,
        horario: { apertura: "09:00", cierre: "18:00" },
        filas: [],
        calificaciones: { positivas: 0, negativas: 0 }
    }
};

function displaySystemNotification(message, type = 'info') {
    const notificationElement = document.createElement("p");
    notificationElement.classList.add("notification-item");
    if (type === 'warning') notificationElement.classList.add('warning');
    if (type === 'success') notificationElement.classList.add('success');

     if (message.includes("El camión de gasolina llegó")) {
         message = "🚛 " + message;
     }
      if (message.includes("sin gasolina")) {
          message = "⚠️ " + message;
      }

    notificationElement.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

    const maxNotifications = 5;
    while (systemNotificationsDiv.children.length >= maxNotifications) {
        systemNotificationsDiv.removeChild(systemNotificationsDiv.lastChild);
    }

    systemNotificationsDiv.prepend(notificationElement);

    const initialMessage = systemNotificationsDiv.querySelector('p');
    if (initialMessage && initialMessage.textContent === 'No hay notificaciones recientes.') {
         systemNotificationsDiv.removeChild(initialMessage);
    }
}


function renderizarSurtidores() {
    const dataArray = Object.entries(surtidores).map(([id, s]) => ({
        id: parseInt(id),
        litros: s.litros
    }));

    const mensajes = gasolinera(true, dataArray);

    resultadoDiv.innerHTML = "";
    mensajes.forEach(mensaje => {
        const p = document.createElement("p");
        p.textContent = mensaje;
        resultadoDiv.appendChild(p);
    });
}

function renderizarHorariosCliente() {
    horariosSurtidoresClienteDiv.innerHTML = "<h4>Horarios de Atención:</h4>";
    for (const id in surtidores) {
        const surtidor = surtidores[id];
        const div = document.createElement("div");
        div.textContent = `Surtidor ${id}: Apertura ${surtidor.horario.apertura}, Cierre ${surtidor.horario.cierre}`;
        horariosSurtidoresClienteDiv.appendChild(div);
    }
}

function actualizarReportesFilasUsuarioView() {
    const estadoActual = obtenerReporteFilas(surtidores);

    const surtidoresConReportes = Object.entries(estadoActual)
            .filter(([, s]) => s.filas && s.filas.length > 0);

    let analisisHTML = "<h4>Estado actual:</h4>";

    if (surtidoresConReportes.length > 0) {
        surtidoresConReportes.sort(([, a], [, b]) => {
             const personasA = a.filas.slice(-1)[0]?.personas || 0;
             const personasB = b.filas.slice(-1)[0]?.personas || 0;
             return personasB - personasA;
         });

        surtidoresConReportes.forEach(([id, data]) => {
            const ultimoReporte = data.filas.slice(-1)[0];
            if (ultimoReporte) {
                 analisisHTML += `
                    <div class="surtidor-info">
                        <strong>Surtidor ${id}:</strong>
                        <span>${ultimoReporte.personas} personas</span>
                        <small>(${new Date(ultimoReporte.hora).toLocaleTimeString()})</small>
                    </div>
                `;
            }
        });

        const masConcurrido = obtenerSurtidorMasLleno(surtidores);

        if (masConcurrido && masConcurrido.id !== null && masConcurrido.personas > 0) {
             analisisHTML += `
                <div class="destacado">
                    🚦 Más concurrido: Surtidor ${masConcurrido.id}
                    (${masConcurrido.personas} personas)
                </div>
            `;
        } else {
             analisisHTML += "<p>✅ No hay reportes recientes de filas.</p>";
        }

    } else {
        analisisHTML += "<p>✅ No hay reportes recientes de filas.</p>";
    }

    reportesFilasUsuarioViewDiv.innerHTML = analisisHTML;
}


function actualizarAlertaSurtidoresUsuario() {
    const estado = obtenerSurtidorMasLleno(surtidores);
    const alertaDiv = alertaSurtidoresDiv;

    let mensaje = "";
    let bgColor = "";
    let textColor = "";

    if (estado.personas === 0) {
        mensaje = "✅ Todos los surtidores están disponibles";
        bgColor = "#e6ffe6";
        textColor = "#0a6e0a";
    } else {
        mensaje = `⚠️ Evitar surtidor ${estado.id} (${estado.personas} personas en fila)`;
        bgColor = estado.personas > 5 ? "#ffe6e6" : "#fff7e6";
        textColor = estado.personas > 5 ? "#990000" : "#a37f00";
    }

    alertaDiv.innerHTML = `
        <p>${mensaje}</p>
        <small>Última actualización: ${new Date().toLocaleTimeString()}</small>
    `;
    alertaDiv.style.backgroundColor = bgColor;
    alertaDiv.style.color = textColor;
}

function calcularPorcentaje(calificaciones) {
    const total = calificaciones.positivas + calificaciones.negativas;
    return total > 0 ? (calificaciones.positivas / total) * 100 : 0;
}

function manejarCalificacion(esPositiva) {
    try {
        const id = parseInt(selectSurtidorCalificacion.value);

        calificarSurtidor(surtidores, id, esPositiva);

        actualizarEstadoCalificacionesUI(id);

        mensajeCalificacionDiv.innerHTML = `
            <span style="color: green;">✓ Calificación registrada para Surtidor ${id}</span>
        `;

    } catch (error) {
        mensajeCalificacionDiv.innerHTML = `
            <span style="color: red;">✗ Error: ${error.message}</span>
        `;
    }
}

function actualizarEstadoCalificacionesUI(id = null) {
     estadoCalificacionesDiv.innerHTML = "";

     if (id !== null) {
         const calificaciones = obtenerCalificaciones(surtidores, id);
         const porcentaje = calcularPorcentaje(calificaciones);
         estadoCalificacionesDiv.innerHTML = `
            <p>Surtidor ${id}:</p>
            <progress value="${porcentaje}" max="100"></progress>
            <span>${porcentaje.toFixed(1)}% aprobación</span>
            <p>👍 ${calificaciones.positivas} | 👎 ${calificaciones.negativas}</p>
        `;
     } else {
         let html = "<h4>Reputación actual:</h4>";
         for (const surtidorId in surtidores) {
             const calificaciones = obtenerCalificaciones(surtidores, surtidorId);
             const porcentaje = calcularPorcentaje(calificaciones);
              html += `
                 <p>Surtidor ${surtidorId}: ${porcentaje.toFixed(1)}% aprobación
                 (👍 ${calificaciones.positivas} | 👎 ${calificaciones.negativas})</p>
             `;
         }
         estadoCalificacionesDiv.innerHTML = html;
     }
 }


botonMostrarDisponibilidad.addEventListener("click", () => {
    isAvailabilityShown = true;
    renderizarSurtidores();
    renderizarHorariosCliente();
    actualizarAlertaSurtidoresUsuario();
    actualizarReportesFilasUsuarioView();
});

botonAgregarGasolina.addEventListener("click", () => {
    const id = parseInt(inputSurtidorIdAdmin.value, 10);
    const cantidad = parseFloat(inputCantidadLitros.value);

    errorAgregarGasolinaDiv.textContent = "";

    try {
        agregarGasolina(surtidores, id, cantidad);
        renderizarSurtidores();
        inputSurtidorIdAdmin.value = "";
        inputCantidadLitros.value = "";
        errorAgregarGasolinaDiv.style.color = "black";
        errorAgregarGasolinaDiv.textContent = `Gasolina agregada exitosamente a Surtidor ${id}.`;

    } catch (error) {
        errorAgregarGasolinaDiv.textContent = error.message;
        errorAgregarGasolinaDiv.style.color = "red";
    }
});

botonNotificarCamion.addEventListener("click", () => {
    notificarCamionLlegado((mensaje) => {
        displaySystemNotification(mensaje, 'success');
        notificarAdministrador(`Admin envió notificación a usuarios: "${mensaje}"`);
    });
});

botonModificarHorario.addEventListener("click", () => {
    const id = parseInt(document.getElementById("surtidorHorarioId").value);
    const apertura = document.getElementById("nuevaApertura").value;
    const cierre = document.getElementById("nuevoCierre").value;

    errorModificarHorarioDiv.textContent = "";

    try {
        modificarHorario(surtidores, id, apertura, cierre);
        errorModificarHorarioDiv.style.color = "black";
        errorModificarHorarioDiv.textContent = `Horario del Surtidor ${id} modificado exitosamente.`;
        renderizarHorariosCliente();

    } catch (error) {
        errorModificarHorarioDiv.textContent = error.message;
        errorModificarHorarioDiv.style.color = "red";
    }
});

botonInformarFila.addEventListener("click", () => {
    const numero = parseInt(inputPersonasEnFila.value);
    const id = parseInt(selectSurtidorReporteFila.value);

    mensajeConfirmacionFilaAdminDiv.textContent = "";

    try {
        reportarFila(surtidores, id, numero);

        notificarAdministrador(`Admin reportó fila: Surtidor ${id} - ${numero} personas`);

        actualizarReportesFilasUsuarioView();

         actualizarAlertaSurtidoresUsuario();

        mensajeConfirmacionFilaAdminDiv.innerHTML = `
            <span style="color: green;">✓ Estado informado a los clientes.</span>
        `;

    } catch (error) {
        mensajeConfirmacionFilaAdminDiv.innerHTML = `
            <span style="color: red;">✗ Error al reportar fila:</span> ${error.message}
        `;
    } finally {
        inputPersonasEnFila.value = "";
        selectSurtidorReporteFila.value = "1";
    }
});

btnCalificarPositivo.addEventListener("click", () => manejarCalificacion(true));
btnCalificarNegativo.addEventListener("click", () => manejarCalificacion(false));

selectSurtidorCalificacion.addEventListener("change", () => {
     const idSeleccionado = parseInt(selectSurtidorCalificacion.value);
     actualizarEstadoCalificacionesUI(idSeleccionado);
 });

actualizarEstadoCalificacionesUI(parseInt(selectSurtidorCalificacion.value));

document.querySelectorAll('.btn-reportar').forEach(boton => {
  boton.addEventListener('click', () => {
    const idSurtidor = boton.id.split('-')[2];
    reportarSurtidorSinGasolina(idSurtidor);
    displaySystemNotification(`Surtidor ${idSurtidor} reportado sin gasolina.`, 'warning');
    notificarAdministrador(`Admin reportó Surtidor ${idSurtidor} sin gasolina.`);
  });
});

botonSolicitarTicket.addEventListener("click", () => {
    const numeroTicket = generarTicket();
    numeroTicketSpan.textContent = numeroTicket;
    mensajeTicketDiv.textContent = "Espere su turno.";
     mensajeTicketDiv.style.color = "blue";
});


actualizarAlertaSurtidoresUsuario();
actualizarReportesFilasUsuarioView();
renderizarHorariosCliente();
actualizarEstadoCalificacionesUI();


setInterval(actualizarAlertaSurtidoresUsuario, 30000);
setInterval(actualizarReportesFilasUsuarioView, 30000);


botonMarcarFavorito.addEventListener("click", () => {
    const clienteId = "cliente_1";
    const surtidorId = parseInt(inputSurtidorFavoritoId.value);

    if (isNaN(surtidorId) || (!surtidores[surtidorId])) {
        notificacionesFavoritosDiv.textContent = "✗ Por favor, ingresa un ID de surtidor válido (1 o 2).";
        notificacionesFavoritosDiv.style.color = "red";
        return;
    }

     // gestionarSurtidoresFavoritos(clienteId, surtidorId, 'agregar');

     console.log(`Funcionalidad de favoritos (marcar) - Cliente ${clienteId}, Surtidor ${surtidorId}`);
     const favoritosPlaceHolderDiv = document.getElementById("notificaciones");
     favoritosPlaceHolderDiv.innerHTML = `<p style="color: orange;">Funcionalidad de favoritos no implementada en este ejemplo. Surtidor ${surtidorId} marcado.</p>`;

});

botonVerificarFavoritos.addEventListener("click", () => {
     const clienteId = "cliente_1";

     // notificarDisponibilidad(surtidores, clienteId, (mensaje) => {
     //    const p = document.createElement("p");
     //    p.textContent = mensaje;
     //    notificacionesFavoritosDiv.appendChild(p);
     // });

     console.log(`Funcionalidad de favoritos (verificar) - Cliente ${clienteId}`);
      const favoritosPlaceHolderDiv = document.getElementById("notificaciones");
      favoritosPlaceHolderDiv.innerHTML = `<p style="color: orange;">Funcionalidad de verificar favoritos no implementada.</p>`;

});