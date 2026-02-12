 function calculador(numeros) {

    // Validacion de definicion
    if (numeros===undefined) {
        throw new Error("El array no esta definido");
    }

    // Validacion de longitud de elementos (se puede unificar la exepcion si no se requiere mayor granulaidad)
    if (numeros.length === 0) {
        throw new Error("El array esta vacio");
    }

    // Suma de arrays
    let suma = 0;
    for (let i = 0; i < numeros.length; i++) {
        const numero = numeros[i];

        if(isNaN(numero)){
            throw new Error("Ingresaste un numero invalido:  ["+  numeros+"]");
        }

        suma += parseFloat(numero);
    }

    return parseFloat((suma / numeros.length).toFixed(2)); // Calculo de promedio
}

