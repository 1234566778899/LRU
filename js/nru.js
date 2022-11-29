let referencias;
let marcos;

function posicion(arr, valor) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == valor) return i;
    }
    return 0;
}

function existe(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == val) return true;
    }
    return false;
}

function generar() {
    referencias = document.querySelector('#referencias').value;
    marcos = document.querySelector('#marcos').value;

    console.log("referencias: ", referencias);
    console.log("marcos: ", marcos);

    let cadena = '';
    $('#tabla').html('');
    cadena += ' <td>Referencias/Flujo de páginas</td>';
    for (let i = 0; i < referencias; i++) {
        cadena += ' <td><input type="text" class="entrada" oninput="cambiar()"></td>';
    }
    $('#tabla').append(`<tr>${cadena}</tr>`);

    for (let i = 0; i < marcos; i++) {
        cadena = `<td>Marco/Frame ${i+1}</td>`;
        for (let j = 0; j < referencias; j++) {
            cadena += '<td></td>';
        }
        $('#tabla').append(`<tr class="result">${cadena}</tr>`);
    }
}

function resultado(flujo) {

    let matriz = new Array(marcos);
    for (let i = 0; i < marcos; i++) {
        matriz[i] = new Array(flujo.length);
        matriz[i].fill('0');

    }

    let aux = [];
    let orden = [];
    let fallos = new Array(flujo.length).fill(1);

    let cont = 0;
    while (cont < flujo.length) {

        if (aux.length < marcos) {
            if (!(existe(aux, flujo[cont]))) {
                aux.push(flujo[cont]);
                orden.push(flujo[cont]);
            } else {
                fallos[cont] = 0;
            }

        } else {

            if (!existe(aux, flujo[cont])) {
                let primero = aux[0];
                aux.splice(0, 1);
                aux.push(flujo[cont]);
                orden[posicion(orden, primero)] = flujo[cont];
            } else {
                fallos[cont] = 0;
            }

        }
        for (let i = 0; i < orden.length; i++) {
            matriz[i][cont] = orden[i];
        }
        cont++;
    }

    console.log(matriz);
    //------------DOM-----------------//
    let cadena = '';

    $('.result').remove();

    for (let i = 0; i < marcos; i++) {
        cadena = `<td>Marco/Frame ${i+1}</td>`;
        for (let j = 0; j < referencias; j++) {
            if (j < flujo.length) {
                if (matriz[i][j] != '0') {
                    cadena += `<td class="text-center">${matriz[i][j]}</td>`;
                } else {
                    cadena += `<td></td>`;
                }
            } else {
                cadena += `<td></td>`;
            }
        }
        $('#tabla').append(`<tr class="result">${cadena}</tr>`);
    }
    cadena = '<td>Fallo</td>';
    let cant_fallos = 0;
    for (let i = 0; i < referencias; i++) {
        if (i < flujo.length) {
            if (fallos[i] == 1) {
                cadena += `<td class="text-center">F</td>`;
                cant_fallos++;
            } else {
                cadena += `<td></td>`;
            }
        }
    }
    $('#tabla').append(`<tr class="result">${cadena}</tr>`);
    
    $('.fallos').html('');
    $('.fallos').append(`<h4 class="fw-light total">Total de fallos: ${cant_fallos}</h4>
                         <h4 class="fw-light total">F: ${cant_fallos}/${flujo.length}=${(cant_fallos/flujo.length).toFixed(2)}</h4>
                         <h4 class="fw-light total">R: 1-F </h4>
                         <h4 class="fw-light total">R: 1-${(cant_fallos/flujo.length).toFixed(2)} </h4>
                         <h4 class="fw-light total">Rendimiento: ${((1-(cant_fallos/flujo.length))*100).toFixed(2)} % </h4>`);
}


function cambiar() {
    let entradas = document.querySelectorAll('.entrada');
    let flujo = [];
    for (let i = 0; i < entradas.length; i++) {
        if (entradas[i].value != "") {
            flujo.push(entradas[i].value);
        }
    }

    resultado(flujo);
}