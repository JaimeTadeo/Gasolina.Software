import gasolinera from "./src/gasolinera.js";

const boton = document.getElementById("mostrarDisponibilidad");
const resultado = document.getElementById("resultado");

let click = false;

const surtidores = [
    { id: 1, litros: 500 },
    { id: 2, litros: 300 },
    { id: 3, litros: 800 }
];

boton.addEventListener("click", () => {
    click = true;
    const mensajes = gasolinera(click, surtidores); 

    resultado.innerHTML = ""; 

    mensajes.forEach(mensaje => {
        const p = document.createElement("p");
        p.textContent = mensaje;
        resultado.appendChild(p);
    });

    boton.style.display = "none"; 
});
