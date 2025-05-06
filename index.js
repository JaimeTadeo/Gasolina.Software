import gasolinera from "./src/gasolinera.js";
import { 
    agregarGasolina, 
    notificarCamionLlegado, 
    modificarHorario,
    reportarFila,
    obtenerReporteFilas,
    notificarAdministrador 
} from "./src/gasolineraAdmin.js";

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
        filas: [] 
    },
    2: { 
        litros: 800, 
        horario: { apertura: "09:00", cierre: "18:00" }, 
        filas: [] 
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
}