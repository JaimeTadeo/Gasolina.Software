export default function gasolinera(click, litros = 1000) {
    const precioLitro = 3.74;
    if (click) {
        const bolivianos = (litros * precioLitro).toFixed(2);
        return `${litros} litros disponibles (${bolivianos} Bs)`;
    } else {
        return "Ver disponibilidad de gasolina";
    }
}
