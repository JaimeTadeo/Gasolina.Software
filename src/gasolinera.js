export default function gasolinera(click, litros = 1000) {
    if (click) {
        return `${litros} litros disponibles`;
    } else {
        return "Ver disponibilidad de gasolina";
    }
}
