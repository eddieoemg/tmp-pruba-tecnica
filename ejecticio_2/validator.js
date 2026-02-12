function validator(parejas, cadena) {

    // Validacion de definicion
    if (cadena === undefined) {
        throw new Error("La cadena no esta definida");
    }

    // Validacion de longitud
    if (cadena.trim().length === 0) {
        throw new Error("La cadena esta vacia");
    }

    // Construimos mapas desde la estructura {open, close}
    const aperturas = new Set();
    const cierreToApertura = {};

    for (const key in parejas) {
        const { open, close } = parejas[key];
        aperturas.add(open);
        cierreToApertura[close] = open;
    }

    let stack = [];

    for (let i = 0; i < cadena.length; i++) {
        const char = cadena[i];

        if (aperturas.has(char)) {
            stack.push(char);
        }
        else if (char in cierreToApertura) {
            if (stack.length === 0) return false;

            const ultimo = stack.pop();
            if (ultimo !== cierreToApertura[char]) return false;
        }
    }

    return stack.length === 0;
}