        import gasolinera from "./src/gasolinera.js";
    import { generarTicket, usarTicket } from "./src/ticket.js";
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
    import { buscarSurtidorPorNombre } from './src/buscarSurtidor.js';

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
    const notificacionesFavoritosDiv = document.getElementById("notificaciones")

    
    // Cuando reportes un surtidor sin gasolina:
    //const resultado = verificarDisponibilidadAlternativa(idSurtidorReportado);
   // displaySystemNotification(resultado.mensaje, resultado.alternativoDisponible ? 'info' : 'warning');

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


    /*----------------------------------------------------------------------------------------------------------*/
    /* ---------- Sistema de Tickets ---------- */
    let miTicket = null;
    const usarTicketBtn = document.createElement('button');

    // Configurar botón "Usar mi ticket"
    usarTicketBtn.textContent = 'Usar mi ticket';
    usarTicketBtn.id = 'usarTicketBtn';
    usarTicketBtn.style.cssText = `
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: block;
    `;

    // Función para usar el ticket
    usarTicketBtn.addEventListener('click', () => {
    const mensajeTicket = document.getElementById('mensajeTicket');
    
    if (miTicket === null) {
        mensajeTicket.textContent = '❌ Primero debes generar un ticket.';
        mensajeTicket.style.color = 'red';
        return;
    }
    
    const resultado = usarTicket(miTicket);
    if (resultado) {
        mensajeTicket.textContent = `✅ Ticket ${miTicket} usado correctamente.`;
        mensajeTicket.style.color = 'green';
        usarTicketBtn.disabled = true;
        document.getElementById('numeroTicket').textContent = '-';
        miTicket = null; // Limpiar el ticket después de usarlo
    } else {
        mensajeTicket.textContent = `❌ El ticket ${miTicket} ya fue usado o no es válido.`;
        mensajeTicket.style.color = 'red';
    }
    });

    // Insertar botón en el DOM
    document.getElementById('ticketInfo').appendChild(usarTicketBtn);

    // Evento para solicitar ticket
    document.getElementById('solicitarTicket').addEventListener('click', () => {
    miTicket = generarTicket();
    document.getElementById('numeroTicket').textContent = miTicket;
    document.getElementById('mensajeTicket').textContent = 'Ticket generado. Puedes usarlo cuando te toque.';
    document.getElementById('mensajeTicket').style.color = 'black';
    usarTicketBtn.disabled = false;
    });
let tickets = []; // lista de tickets

// Usuario: Solicita ticket
document.getElementById('solicitarTicket').addEventListener('click', () => {
    const nuevoTicket = {
        id: tickets.length + 1,
        estado: 'pendiente'
    };
    tickets.push(nuevoTicket);
    actualizarTicketUsuario(nuevoTicket);
    actualizarListaTicketsAdmin();
});

// Usuario: actualiza su vista de ticket
function actualizarTicketUsuario(ticket) {
    document.getElementById('numeroTicket').innerText = ticket.id;
    document.getElementById('mensajeTicket').innerText = `Estado actual: ${ticket.estado}`;
    document.getElementById('estadoTicket').value = ticket.estado;
}

// Usuario: puede ver cambios en tiempo real si cambia estado (opcional)
document.getElementById('estadoTicket').addEventListener('change', (e) => {
    const ticketId = parseInt(document.getElementById('numeroTicket').innerText);
    const nuevoEstado = e.target.value;
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
        ticket.estado = nuevoEstado;
        actualizarTicketUsuario(ticket);
        actualizarListaTicketsAdmin();
    }
});

// Admin: muestra todos los tickets y permite cambiar su estado
function actualizarListaTicketsAdmin() {
    const contenedor = document.getElementById('listaTickets');
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
                    <option value="en_proceso" ${ticket.estado === 'en_proceso' ? 'selected' : ''}>En proceso</option>
                    <option value="atendiendo" ${ticket.estado === 'atendiendo' ? 'selected' : ''}>Atendiendo</option>
                </select>
            </p>
        `;
        contenedor.appendChild(ticketDiv);
    });

    // Escuchar cambios de estado en el lado del admin
    document.querySelectorAll('#listaTickets select').forEach(select => {
        select.addEventListener('change', (e) => {
            const ticketId = parseInt(e.target.getAttribute('data-id'));
            const nuevoEstado = e.target.value;
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
                ticket.estado = nuevoEstado;

                // Si el usuario tiene este ticket visible, actualizar su vista también
                const ticketUsuarioId = parseInt(document.getElementById('numeroTicket').innerText);
                if (ticketUsuarioId === ticket.id) {
                    actualizarTicketUsuario(ticket);
                }

                actualizarListaTicketsAdmin();
            }
        });
    });
}

    /*----------------------------------------------------------------------------------------------------------*/


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

    // Variables de control
let filaDeTickets = 0;
const minutosPorPersona = 3;

// Elementos del DOM
const btnSolicitarTicket = document.getElementById('solicitarTicket');
const btnUsarTicket = document.querySelector('#ticketInfo button'); // botón "Usar mi ticket"
const divTiempoEstimado = document.getElementById('tiempoEstimado');
const spanNumeroTicket = document.getElementById('numeroTicket');

// Manejador de solicitud de ticket
btnSolicitarTicket.addEventListener('click', () => {
    filaDeTickets++;
    const miNumero = filaDeTickets;
    spanNumeroTicket.textContent = miNumero;
    actualizarTiempoEstimado();
});

// Manejador de uso del ticket
btnUsarTicket.addEventListener('click', () => {
    if (filaDeTickets > 0) {
        filaDeTickets--;
        actualizarTiempoEstimado();
    }
});

// Función para mostrar el tiempo estimado
function actualizarTiempoEstimado() {
    const tiempo = filaDeTickets * minutosPorPersona;
    divTiempoEstimado.textContent = `Tiempo estimado: ${tiempo} minutos`;
}

/*-------------------------------------------------------Buscar surtidor------------------------------------------------------------------*/
import { buscarSurtidorPorNombre } from './src/buscarSurtidor.js';

document.addEventListener('DOMContentLoaded', () => {
    const inputNombreSurtidor = document.getElementById('nombreSurtidorInput');
    const botonBuscar = document.getElementById('buscarSurtidorBtn');
    const divResultado = document.getElementById('resultadoBusquedaSurtidor');

    // Usamos los surtidores reales definidos arriba como objeto
    const surtidoresArray = Object.values(surtidores); // Convertimos a array

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
                `;
            } else {
                divResultado.innerHTML = `<p>No se encontró ningún surtidor con el nombre "${nombreABuscar}".</p>`;
            }
        });
    }
});