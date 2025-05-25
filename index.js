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
    import { filtrarSurtidoresPorZona } from './src/gasolineraZona.js';
   import { gestionarSurtidoresFavoritos, notificarDisponibilidad, notificarArriboCamion } from './src/gasolineraNotificaciones.js';
    import { actualizarCombustible } from './src/gasolinera.js';
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
    const selectZona = document.getElementById("zonaSeleccionada");
    const botonFiltrarPorZona = document.getElementById("filtrarPorZona");
    const resultadoFiltroZonaDiv = document.getElementById("resultadoFiltroZona");
   const inputSurtidorCamion = document.getElementById("surtidorCamionId");
const inputLitrosDescargados = document.getElementById("litrosDescargados");

    let isAvailabilityShown = false;

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
    notificationElement.classList.add("notification-item");

    // Estilos basados en el tipo de mensaje
    if (type === 'warning') notificationElement.classList.add('warning');
    if (type === 'success') notificationElement.classList.add('success');

    // Icono para mensajes de camión
    if (message.includes("Camión")) {
        message = `🚛 ${message}`;
    }

    notificationElement.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    systemNotificationsDiv.prepend(notificationElement);

    // Limitar a 5 notificaciones
    while (systemNotificationsDiv.children.length > 5) {
        systemNotificationsDiv.removeChild(systemNotificationsDiv.lastChild);
    }
}
  function renderizarSurtidores(filteredSurtidores = null) {
    const dataToRender = filteredSurtidores || Object.values(surtidores);
    const mensajes = gasolinera(true, dataToRender);
    
    const targetDiv = filteredSurtidores ? resultadoFiltroZonaDiv : resultadoDiv;
    targetDiv.innerHTML = "";
    
    if (mensajes.length === 0) {
        targetDiv.innerHTML = "<p>No hay surtidores disponibles.</p>";
        return;
    }

    mensajes.forEach(mensaje => {
        const p = document.createElement("p");
        p.textContent = mensaje;
        targetDiv.appendChild(p);
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

    export function manejarArriboCamion(surtidores, camion, callback) {
    try {
        // 1. Notificar el arribo (envía mensajes al sistema y usuarios)
        notificarArriboCamion(surtidores, camion, callback);

        // 2. Actualizar el combustible en el surtidor
        actualizarCombustible(surtidores, camion.surtidorId, camion.litrosDescargados);

        // 3. Actualizar la UI
        renderizarSurtidores();
        actualizarAlertaSurtidoresUsuario();

    } catch (error) {
        console.error("Error al manejar el arribo del camión:", error);
        callback(`❌ Error: ${error.message}`);
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
    const surtidorId = parseInt(inputSurtidorCamion.value);
    const litrosDescargados = parseFloat(inputLitrosDescargados.value);

    if (isNaN(surtidorId) || isNaN(litrosDescargados) || litrosDescargados <= 0) {
        displaySystemNotification("❌ Ingresa un ID de surtidor y litros válidos.", "warning");
        return;
    }

    const camion = {
        surtidorId,
        litrosDescargados
    };

    notificarArriboCamion(Object.values(surtidores), camion, (mensaje) => {
        displaySystemNotification(mensaje, "success");
        renderizarSurtidores();
    });

    inputSurtidorCamion.value = "";
    inputLitrosDescargados.value = "";
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
        
        try {
            // 1. Reportar el surtidor (esto ya establece litros=0)
            reportarSurtidorSinGasolina(surtidores, idSurtidor);
            
            // 2. Mostrar notificación
            displaySystemNotification(`Surtidor ${idSurtidor} reportado sin gasolina.`, 'warning');
            
            // 3. Notificar al administrador
            notificarAdministrador(`Admin reportó Surtidor ${idSurtidor} sin gasolina.`);
            
            // 4. Actualizar la vista de disponibilidad
            renderizarSurtidores();
            
        } catch (error) {
            displaySystemNotification(`Error: ${error.message}`, 'warning');
        }
    });
});

    let miTicket = null;
    const usarTicketBtn = document.createElement('button');

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
        miTicket = null; 
    } else {
        mensajeTicket.textContent = `❌ El ticket ${miTicket} ya fue usado o no es válido.`;
        mensajeTicket.style.color = 'red';
    }
    });


    document.getElementById('ticketInfo').appendChild(usarTicketBtn);
    document.getElementById('solicitarTicket').addEventListener('click', () => {
    miTicket = generarTicket();
    document.getElementById('numeroTicket').textContent = miTicket;
    document.getElementById('mensajeTicket').textContent = 'Ticket generado. Puedes usarlo cuando te toque.';
    document.getElementById('mensajeTicket').style.color = 'black';
    usarTicketBtn.disabled = false;
    });
let tickets = []; 

document.getElementById('solicitarTicket').addEventListener('click', () => {
    const nuevoTicket = {
        id: tickets.length + 1,
        estado: 'pendiente'
    };
    tickets.push(nuevoTicket);
    actualizarTicketUsuario(nuevoTicket);
    actualizarListaTicketsAdmin();
});

function actualizarTicketUsuario(ticket) {
    document.getElementById('numeroTicket').innerText = ticket.id;
    document.getElementById('mensajeTicket').innerText = `Estado actual: ${ticket.estado}`;
    document.getElementById('estadoTicket').value = ticket.estado;
}

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

    document.querySelectorAll('#listaTickets select').forEach(select => {
        select.addEventListener('change', (e) => {
            const ticketId = parseInt(e.target.getAttribute('data-id'));
            const nuevoEstado = e.target.value;
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
                ticket.estado = nuevoEstado;

                const ticketUsuarioId = parseInt(document.getElementById('numeroTicket').innerText);
                if (ticketUsuarioId === ticket.id) {
                    actualizarTicketUsuario(ticket);
                }

                actualizarListaTicketsAdmin();
            }
        });
    });
}



    actualizarAlertaSurtidoresUsuario();
    actualizarReportesFilasUsuarioView();
    renderizarHorariosCliente();
    actualizarEstadoCalificacionesUI();


    setInterval(actualizarAlertaSurtidoresUsuario, 30000);
    setInterval(actualizarReportesFilasUsuarioView, 30000);

    botonFiltrarPorZona.addEventListener("click", () => {
        const zonaSeleccionada = selectZona.value;
        const surtidoresFiltrados = filtrarSurtidoresPorZona(surtidores, zonaSeleccionada);
        renderizarSurtidores(surtidoresFiltrados);
    });


   botonMarcarFavorito.addEventListener("click", () => {
    const clienteId = "cliente_1"; // Puedes hacer esto dinámico si tienes login
    const surtidorId = parseInt(inputSurtidorFavoritoId.value);

    if (isNaN(surtidorId) || (!surtidores[surtidorId])) {
        notificacionesFavoritosDiv.textContent = "✗ Ingresa un ID válido (1 o 2)";
        notificacionesFavoritosDiv.style.color = "red";
        return;
    }

    gestionarSurtidoresFavoritos(clienteId, surtidorId, 'agregar');
    notificacionesFavoritosDiv.innerHTML = `
        <p style="color: green;">✓ Surtidor ${surtidorId} marcado como favorito</p>
    `;

    // Verificar disponibilidad inmediatamente
    notificarDisponibilidad(surtidores, clienteId, (mensaje) => {
        displaySystemNotification(mensaje, mensaje.includes("✅") ? 'success' : 'warning');
    });
});

  botonVerificarFavoritos.addEventListener("click", () => {
    const clienteId = "cliente_1";
    notificarDisponibilidad(surtidores, clienteId, (mensaje) => {
        const p = document.createElement("p");
        p.textContent = mensaje;
        notificacionesFavoritosDiv.innerHTML = '';
        notificacionesFavoritosDiv.appendChild(p);

        // Mostrar también en notificaciones del sistema
        displaySystemNotification(mensaje, mensaje.includes("✅") ? 'success' : 'warning');
    });
});

let filaDeTickets = 0;
const minutosPorPersona = 3;


const btnSolicitarTicket = document.getElementById('solicitarTicket');
const btnUsarTicket = document.querySelector('#ticketInfo button'); 
const divTiempoEstimado = document.getElementById('tiempoEstimado');
const spanNumeroTicket = document.getElementById('numeroTicket');

btnSolicitarTicket.addEventListener('click', () => {
    filaDeTickets++;
    const miNumero = filaDeTickets;
    spanNumeroTicket.textContent = miNumero;
    actualizarTiempoEstimado();
});


btnUsarTicket.addEventListener('click', () => {
    if (filaDeTickets > 0) {
        filaDeTickets--;
        actualizarTiempoEstimado();
    }
});


function actualizarTiempoEstimado() {
    const tiempo = filaDeTickets * minutosPorPersona;
    divTiempoEstimado.textContent = `Tiempo estimado: ${tiempo} minutos`;
}


import { buscarSurtidorPorNombre } from './src/buscarSurtidor.js'; 

const LISTA_DE_TODOS_LOS_SURTIDORES = [
    { id: 1, nombre: 'Surtidor Principal Centro', litros: 750 },
    { id: 2, nombre: 'Surtidor Avenida Veloz', litros: 400 }
];


document.addEventListener('DOMContentLoaded', () => {
    // Código existente de búsqueda de surtidores
    const inputNombreSurtidor = document.getElementById('nombreSurtidorInput');
    const botonBuscar = document.getElementById('buscarSurtidorBtn');
    const divResultado = document.getElementById('resultadoBusquedaSurtidor');

    if (botonBuscar && inputNombreSurtidor && divResultado) {
        botonBuscar.addEventListener('click', () => {
            const nombreABuscar = inputNombreSurtidor.value;
            const surtidorEncontrado = buscarSurtidorPorNombre(LISTA_DE_TODOS_LOS_SURTIDORES, nombreABuscar);

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
    } else {
        console.warn("Alguno de los elementos (input, botón o div de resultado) para la búsqueda de surtidor no se encontró en el DOM.");
    }

    // Código existente de disponibilidad
    const elementoParaMostrarDisponibilidad = document.getElementById('disponibilidadGasolina'); 
    if (elementoParaMostrarDisponibilidad && typeof gasolinera === 'function') { 
        const infoSurtidores = gasolinera(true, LISTA_DE_TODOS_LOS_SURTIDORES);
        if (Array.isArray(infoSurtidores)) {
            elementoParaMostrarDisponibilidad.innerHTML = '<h3>Disponibilidad Actual:</h3>';
            infoSurtidores.forEach(info => {
                const p = document.createElement('p');
                p.textContent = info;
                elementoParaMostrarDisponibilidad.appendChild(p);
            });
        } else {
             elementoParaMostrarDisponibilidad.textContent = infoSurtidores;
        }
    }


    const verificarFavoritos = () => {
        const clienteId = "cliente_1"; 
        notificarDisponibilidad(surtidores, clienteId, (mensaje) => {
            if (!document.hidden) {
                displaySystemNotification(mensaje, mensaje.includes("✅") ? 'success' : 'warning');

                // Opcional: Mostrar en la interfaz
                const notifDiv = document.getElementById('notificacionesFavoritos');
                if (notifDiv) {
                    const notificacion = document.createElement('p');
                    notificacion.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
                    notifDiv.prepend(notificacion);
                }
            }
        });
    };

    // Ejecutar inmediatamente y luego cada 5 minutos
    verificarFavoritos();
    setInterval(verificarFavoritos, 300000);
});

