import gasolinera from "./src/gasolinera.js";
import { generarTicket, usarTicket } from "./src/ticket.js";
import {
    calificarSurtidor,
    obtenerCalificaciones,
    obtenerSurtidorMasLleno,
    agregarGasolina,
    notificarCamionLlegado,
    modificarHorario,
    reportarFila,
    obtenerReporteFilas,
    notificarAdministrador
} from "./src/gasolineraAdmin.js";
import { reportarSurtidorSinGasolina } from './src/reportarSurtidor.js';
import { buscarSurtidorPorNombre } from './src/buscarSurtidor.js';
import {
    gestionarSurtidoresFavoritos,
    verificarDisponibilidadFavoritos
} from './src/surtidoresFavoritos.js';
import { filtrarSurtidoresPorZona } from './src/gasolineraZona.js';

const botonMostrarDisponibilidad = document.getElementById("mostrarDisponibilidad");
const resultadoDiv = document.getElementById("resultado");
const botonAgregarGasolina = document.getElementById("agregarGasolina");
const inputSurtidorIdAdmin = document.getElementById("surtidorSeleccionadoAgregar");
const inputCantidadLitros = document.getElementById("cantidadLitros");
const errorAgregarGasolinaDiv = document.getElementById("error");
const botonModificarHorario = document.getElementById("modificarHorario");
const errorModificarHorarioDiv = document.getElementById("errorHorario");
const botonNotificarCamion = document.getElementById("notificarCamion");
const inputPersonasEnFila = document.getElementById("numeroPersonas");
const botonInformarFila = document.getElementById("informarFila");
const mensajeConfirmacionFilaAdminDiv = document.getElementById("mensajeFila");
const selectSurtidorReporteFila = document.getElementById("surtidorSeleccionadoFila");
const systemNotificationsDiv = document.getElementById("systemNotifications");
const reportesFilasUsuarioViewDiv = document.getElementById("adminFilaReportes");
const btnCalificarPositivo = document.getElementById("btnPositivo");
const btnCalificarNegativo = document.getElementById("btnNegativo");
const selectSurtidorCalificacion = document.getElementById("surtidorCalificacion");
const mensajeCalificacionDiv = document.getElementById("mensajeCalificacion");
const estadoCalificacionesDiv = document.getElementById("estadoCalificaciones");
const horariosSurtidoresClienteDiv = document.getElementById("horariosSurtidoresCliente");
const alertaSurtidoresDiv = document.getElementById("alertaSurtidores");
const selectSurtidorFavorito = document.getElementById("surtidorFavorito");
const botonMarcarFavorito = document.getElementById("marcarFavorito");
const botonVerificarFavoritos = document.getElementById("verificarFavoritos");
const notificacionesFavoritosDiv = document.getElementById("notificacionesFavoritos");

const inputNombreSurtidor = document.getElementById('nombreSurtidorInput');
const botonBuscar = document.getElementById('buscarSurtidorBtn');
const divResultado = document.getElementById('resultadoBusquedaSurtidor');
const suggestionsDiv = document.createElement('div');
suggestionsDiv.id = 'autocomplete-suggestions';
if (inputNombreSurtidor) {
    inputNombreSurtidor.parentNode.insertBefore(suggestionsDiv, inputNombreSurtidor.nextSibling);
}

const selectZona = document.getElementById('zonaSeleccionada');
const btnFiltrarZona = document.getElementById('filtrarPorZona');
const resultadoFiltroZonaDiv = document.getElementById('resultadoFiltroZona');

let miTicket = null;
const usarTicketBtn = document.createElement('button');
const btnSolicitarTicket = document.getElementById('solicitarTicket');
const divTiempoEstimado = document.getElementById('tiempoEstimado');
const spanNumeroTicket = document.getElementById('numeroTicket');

const surtidores = {
    1: {
        id: 1,
        nombre: "Surtidor Principal",
        litros: 1000,
        horario: { apertura: "08:00", cierre: "20:00" },
        filas: [],
        calificaciones: { positivas: 0, negativas: 0 },
        zona: "norte"
    },
    2: {
        id: 2,
        nombre: "Surtidor Secundario",
        litros: 800,
        horario: { apertura: "09:00", cierre: "18:00" },
        filas: [],
        calificaciones: { positivas: 0, negativas: 0 },
        zona: "sur"
    }
};

function displaySystemNotification(message, type = 'info') {
    const notificationElement = document.createElement("p");
    notificationElement.classList.add("notification-item", type);

    if (message.includes("El camión de gasolina llegó")) {
        message = "🚛 " + message;
    }
    if (message.includes("sin gasolina")) {
        message = "⚠️ " + message;
    }
    if (message.includes("personas en fila")) {
        message = "👥 " + message;
    }

    notificationElement.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

    const maxNotifications = 5;
    while (systemNotificationsDiv.children.length >= maxNotifications) {
        systemNotificationsDiv.removeChild(systemNotificationsDiv.lastChild);
    }

    const initialMessageP = systemNotificationsDiv.querySelector('p');
    if (initialMessageP && initialMessageP.textContent.includes('No hay notificaciones recientes.')) {
        systemNotificationsDiv.removeChild(initialMessageP);
    }

    systemNotificationsDiv.prepend(notificationElement);
}

function renderizarSurtidores() {
    const dataArray = Object.entries(surtidores).map(([id, s]) => ({
        id: parseInt(id),
        litros: s.litros,
        nombre: s.nombre
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
    let type = "";

    if (estado.personas === 0) {
        mensaje = "✅ Todos los surtidores están disponibles";
        type = "success";
    } else {
        mensaje = `⚠️ Evitar surtidor ${estado.id} (${estado.personas} personas en fila)`;
        type = estado.personas > 5 ? "error" : "warning";
    }

    alertaDiv.innerHTML = `
        <p>${mensaje}</p>
        <small>Última actualización: ${new Date().toLocaleTimeString()}</small>
    `;
    alertaDiv.className = `alerta-surtidores ${type}`;
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
    const id = parseInt(document.getElementById("surtidorHorario").value);
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
        displaySystemNotification(`Surtidor ${id} tiene ${numero} personas en fila.`, 'info');

        actualizarReportesFilasUsuarioView();
        actualizarAlertaSurtidoresUsuario();

        mensajeConfirmacionFilaAdminDiv.innerHTML = `
            <span style="color: green;">✓ Estado de fila informado a los clientes.</span>
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

document.querySelectorAll('.btn-reportar').forEach(boton => {
    boton.addEventListener('click', () => {
        const idSurtidor = boton.id.split('-')[2];
        
        try {
            reportarSurtidorSinGasolina(surtidores, idSurtidor); 
            displaySystemNotification(`Surtidor ${idSurtidor} reportado sin gasolina.`, 'warning');
            notificarAdministrador(`Admin reportó Surtidor ${idSurtidor} sin gasolina.`);
            renderizarSurtidores(); 
        } catch (error) {
            console.error("Error al reportar surtidor sin gasolina:", error.message);
            displaySystemNotification(`Error al reportar surtidor ${idSurtidor}: ${error.message}`, 'error');
        }
    });
});

btnCalificarPositivo.addEventListener("click", () => manejarCalificacion(true));
btnCalificarNegativo.addEventListener("click", () => manejarCalificacion(false));

selectSurtidorCalificacion.addEventListener("change", () => {
    const idSeleccionado = parseInt(selectSurtidorCalificacion.value);
    actualizarEstadoCalificacionesUI(idSeleccionado);
});

botonMarcarFavorito.addEventListener("click", () => {
    const clienteId = "cliente_1";
    const surtidorId = parseInt(selectSurtidorFavorito.value);

    try {
        const resultado = gestionarSurtidoresFavoritos(clienteId, surtidorId, 'agregar');

        if (resultado.success) {
            mostrarNotificacion(resultado.message, 'success');
        } else {
            mostrarNotificacion(resultado.message, 'info');
        }
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

botonVerificarFavoritos.addEventListener("click", () => {
    const clienteId = "cliente_1";

    try {
        const resultado = verificarDisponibilidadFavoritos(surtidores, clienteId);

        if (resultado.disponible) {
            mostrarNotificacion(resultado.message, 'success');
        } else {
            mostrarNotificacion(resultado.message, 'warning');
        }
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

function mostrarNotificacion(mensaje, tipo = 'info') {
    notificacionesFavoritosDiv.innerHTML = '';
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    notificacionesFavoritosDiv.appendChild(notificacion);
}

let tickets = [];
let filaDeTickets = 0;
const minutosPorPersona = 2;

if (document.getElementById('ticketInfo')) {
    usarTicketBtn.textContent = 'Usar mi ticket';
    usarTicketBtn.id = 'usarTicketBtn';
    usarTicketBtn.classList.add('ticket-btn'); // Añadir clase para estilos CSS
    document.getElementById('ticketInfo').appendChild(usarTicketBtn);
}

if (btnSolicitarTicket) {
    btnSolicitarTicket.addEventListener('click', () => {
        const nuevoTicketId = generarTicket();
        miTicket = nuevoTicketId;
        const nuevoTicketData = {
            id: nuevoTicketId,
            estado: 'pendiente'
        };
        tickets.push(nuevoTicketData);
        actualizarTicketUsuario(nuevoTicketData);
        actualizarListaTicketsAdmin();
        filaDeTickets = tickets.filter(t => t.estado !== 'atendido' && t.estado !== 'usado').length;
        actualizarTiempoEstimado();
        usarTicketBtn.disabled = false;
    });
}

if (usarTicketBtn) {
    usarTicketBtn.addEventListener('click', () => {
        const mensajeTicket = document.getElementById('mensajeTicket');

        if (miTicket === null) {
            mensajeTicket.textContent = '❌ Primero debes generar un ticket.';
            mensajeTicket.classList.add('error-message'); // Añadir clase para estilos CSS
            return;
        }

        const resultado = usarTicket(miTicket);
        if (resultado) {
            mensajeTicket.textContent = `✅ Ticket ${miTicket} usado correctamente.`;
            mensajeTicket.classList.remove('error-message'); // Remover clase de error
            mensajeTicket.classList.add('success-message'); // Añadir clase de éxito
            usarTicketBtn.disabled = true;
            if (spanNumeroTicket) {
                spanNumeroTicket.textContent = '-';
            }
            const ticketEnLista = tickets.find(t => t.id === miTicket);
            if (ticketEnLista) {
                ticketEnLista.estado = 'usado';
            }

            miTicket = null;
            actualizarListaTicketsAdmin();
            filaDeTickets = tickets.filter(t => t.estado !== 'atendido' && t.estado !== 'usado').length;
            actualizarTiempoEstimado();
        } else {
            mensajeTicket.textContent = `❌ El ticket ${miTicket} ya fue usado o no es válido.`;
            mensajeTicket.classList.remove('success-message');
            mensajeTicket.classList.add('error-message');
        }
    });
}

function actualizarListaTicketsAdmin() {
    const contenedor = document.getElementById('listaTickets');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (tickets.length === 0) {
        contenedor.innerHTML = '<p>No hay tickets todavía.</p>';
        return;
    }

    tickets.forEach(ticket => {
        const ticketDiv = document.createElement('div');
        ticketDiv.innerHTML = `
            <p>🎟️ Ticket #${ticket.id} - Estado:
                <select data-id="${ticket.id}">
                    <option value="pendiente" ${ticket.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="en proceso" ${ticket.estado === 'en proceso' ? 'selected' : ''}>En proceso</option>
                    <option value="atendiendo" ${ticket.estado === 'atendiendo' ? 'selected' : ''}>Atendiendo</option>
                    <option value="usado" ${ticket.estado === 'usado' ? 'selected' : ''}>Usado</option>
                </select>
            </p>
        `;
        contenedor.appendChild(ticketDiv);
    });

    document.querySelectorAll('#listaTickets select').forEach(select => {
        select.addEventListener('change', (e) => {
            const ticketId = parseInt(e.target.getAttribute('data-id'));
            const nuevoEstado = e.target.value;
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
                ticket.estado = nuevoEstado;
                const ticketUsuarioId = parseInt(spanNumeroTicket.innerText);
                if (ticketUsuarioId === ticket.id) {
                    actualizarTicketUsuario(ticket);
                }
                filaDeTickets = tickets.filter(t => t.estado !== 'atendido' && t.estado !== 'usado').length;
                actualizarTiempoEstimado();
                actualizarListaTicketsAdmin();
            }
        });
    });
}

function actualizarTicketUsuario(ticket) {
    if (spanNumeroTicket) {
        spanNumeroTicket.innerText = ticket.id;
    }
    const mensajeTicket = document.getElementById('mensajeTicket');
    if (mensajeTicket) {
        mensajeTicket.innerText = `Estado actual: ${ticket.estado}`;
        // Limpiar clases de estilo existentes y aplicar la nueva
        mensajeTicket.classList.remove('error-message', 'success-message');
        if (ticket.estado === 'usado' || ticket.estado === 'atendiendo') {
             mensajeTicket.classList.add('success-message');
        } else {
             mensajeTicket.classList.add('info-message'); // Clase general para estados normales
        }
    }
}

function actualizarTiempoEstimado() {
    if (divTiempoEstimado) {
        const tiempo = filaDeTickets * minutosPorPersona;
        divTiempoEstimado.textContent = `Tiempo estimado: ${tiempo} minutos`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarEstadoCalificacionesUI();
    actualizarAlertaSurtidoresUsuario();
    actualizarReportesFilasUsuarioView();
    renderizarHorariosCliente();
    actualizarListaTicketsAdmin();
    actualizarTiempoEstimado();

    if (suggestionsDiv) {
        suggestionsDiv.style.display = 'none';
    }
});

setInterval(actualizarAlertaSurtidoresUsuario, 30000);
setInterval(actualizarReportesFilasUsuarioView, 30000);

document.addEventListener('DOMContentLoaded', () => {
    const surtidoresArray = Object.values(surtidores);

    if (inputNombreSurtidor) {
        inputNombreSurtidor.addEventListener('input', () => {
            const inputText = inputNombreSurtidor.value.toLowerCase();
            suggestionsDiv.innerHTML = '';

            if (inputText.length === 0) {
                suggestionsDiv.style.display = 'none';
                return;
            }

            const filteredSurtidores = surtidoresArray.filter(surtidor =>
                surtidor.nombre.toLowerCase().includes(inputText)
            );

            if (filteredSurtidores.length > 0) {
                filteredSurtidores.forEach(surtidor => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('suggestion-item');
                    suggestionItem.textContent = surtidor.nombre;
                    
                    suggestionItem.addEventListener('click', () => {
                        inputNombreSurtidor.value = surtidor.nombre;
                        suggestionsDiv.style.display = 'none';
                    });
                    suggestionsDiv.appendChild(suggestionItem);
                });
                suggestionsDiv.style.display = 'block';
            } else {
                suggestionsDiv.style.display = 'none';
            }
        });

        document.addEventListener('click', (event) => {
            if (suggestionsDiv && event.target !== inputNombreSurtidor && !suggestionsDiv.contains(event.target)) {
                suggestionsDiv.style.display = 'none';
            }
        });
    }

    if (botonBuscar && inputNombreSurtidor && divResultado) {
        botonBuscar.addEventListener('click', () => {
            const nombreABuscar = inputNombreSurtidor.value;
            const surtidorEncontrado = buscarSurtidorPorNombre(surtidoresArray, nombreABuscar);

            if (surtidorEncontrado) {
                divResultado.innerHTML = `
                    <h3>Surtidor Encontrado:</h3>
                    <p><strong>ID:</strong> ${surtidorEncontrado.id}</p>
                    <p><strong>Nombre:</strong> ${surtidorEncontrado.nombre}</p>
                    <p><strong>Litros disponibles:</strong> ${surtidorEncontrado.litros}</p>
                    <p><strong>Horario:</strong> ${surtidorEncontrado.horario.apertura} - ${surtidorEncontrado.horario.cierre}</p>
                    <p><strong>Zona:</strong> ${surtidorEncontrado.zona}</p>
                `;
            } else {
                divResultado.innerHTML = `<p>No se encontró ningún surtidor con el nombre "${nombreABuscar}".</p>`;
            }
            if (suggestionsDiv) {
                suggestionsDiv.style.display = 'none';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (btnFiltrarZona && selectZona && resultadoFiltroZonaDiv) {
        btnFiltrarZona.addEventListener('click', () => {
            const zonaSeleccionada = selectZona.value;
            const surtidoresFiltrados = filtrarSurtidoresPorZona(surtidores, zonaSeleccionada);

            resultadoFiltroZonaDiv.innerHTML = '';

            if (surtidoresFiltrados.length > 0) {
                let htmlContent = '<h4>Surtidores en la zona seleccionada:</h4>';
                surtidoresFiltrados.forEach(surtidor => {
                    htmlContent += `
                        <p><strong>ID:</strong> ${surtidor.id}, <strong>Nombre:</strong> ${surtidor.nombre}, <strong>Litros:</strong> ${surtidor.litros}, <strong>Zona:</strong> ${surtidor.zona}</p>
                    `;
                });
                resultadoFiltroZonaDiv.innerHTML = htmlContent;
            } else {
                resultadoFiltroZonaDiv.innerHTML = `<p>No hay surtidores disponibles en la zona "${zonaSeleccionada}".</p>`;
            }
        });
    }
});