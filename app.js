// 1. Deudas iniciales basadas en el boceto
var deudas = [
    { id: 1, nombre: "Tarjeta de crédito", montoInicial: 1000, monto: 1000, interes: 22, prioridad: "Alta" },
    { id: 2, nombre: "Préstamo personal", montoInicial: 1500, monto: 1500, interes: 12, prioridad: "Media" }
];

// Cargar datos guardados en el navegador si existen
var datosGuardados = localStorage.getItem("deudas_erick");
if (datosGuardados !== null) {
    deudas = JSON.parse(datosGuardados);
}

// 2. Elementos del HTML
var listaDeudas = document.getElementById("lista-deudas");
var resumenDeuda = document.getElementById("resumen-deuda");
var resumenMeses = document.getElementById("resumen-meses");
var tablaTotal = document.getElementById("tabla-total");
var inputIngreso = document.getElementById("input-ingreso");
var checkVariable = document.getElementById("check-variable");
var selectEstrategia = document.getElementById("select-estrategia");

var barraProgreso = document.getElementById("barra-progreso");
var textoProgreso = document.getElementById("texto-progreso");

var formNuevaDeuda = document.getElementById("form-nueva-deuda");
var btnAbrirForm = document.getElementById("btn-abrir-form");
var btnCancelarForm = document.getElementById("btn-cancelar-form");

var panelSalida = document.getElementById("panel-salida");
var salidaTitulo = document.getElementById("salida-titulo");
var salidaContenido = document.getElementById("salida-contenido");
var btnCerrarSalida = document.getElementById("btn-cerrar-salida");

// 3. Guardar deudas en el almacenamiento local del navegador
function guardarEnNavegador() {
    localStorage.setItem("deudas_erick", JSON.stringify(deudas));
}

// 4. Actualizar tabla, totales y tiempo estimado
function actualizarPantalla() {
    guardarEnNavegador();
    listaDeudas.innerHTML = "";

    var totalActual = 0;
    var totalInicial = 0;

    var listaOrdenada = deudas.slice();

    if (selectEstrategia.value === "Avalancha") {
        listaOrdenada.sort(function (a, b) {
            return b.interes - a.interes;
        });
    } else {
        listaOrdenada.sort(function (a, b) {
            return a.monto - b.monto;
        });
    }

    for (var i = 0; i < listaOrdenada.length; i++) {
        var d = listaOrdenada[i];
        totalActual = totalActual + d.monto;
        totalInicial = totalInicial + d.montoInicial;

        var fila = document.createElement("tr");
        fila.innerHTML =
            "<td>" + d.nombre + "</td>" +
            "<td><strong>$" + d.monto.toFixed(2) + "</strong></td>" +
            "<td>" + d.interes + "%</td>" +
            "<td><span class='badge prioridad-" + d.prioridad + "'>" + d.prioridad + "</span></td>" +
            "<td>" +
                "<button type='button' class='btn-accion btn-abonar' onclick='abonarDeuda(" + d.id + ")'>Abonar</button>" +
                "<button type='button' class='btn-accion btn-eliminar' onclick='eliminarDeuda(" + d.id + ")'>Eliminar</button>" +
            "</td>";

        listaDeudas.appendChild(fila);
    }

    resumenDeuda.textContent = "$" + totalActual.toFixed(2);
    tablaTotal.textContent = "$" + totalActual.toFixed(2);

    var porcentaje = 0;
    if (totalInicial > 0) {
        porcentaje = Math.round(((totalInicial - totalActual) / totalInicial) * 100);
    }
    barraProgreso.style.width = porcentaje + "%";
    textoProgreso.textContent = porcentaje + "% liquidado";

    var ingreso = parseFloat(inputIngreso.value);
    if (isNaN(ingreso)) {
        ingreso = 0;
    }

    var porcentajePago = 0.21;
    if (checkVariable.checked) {
        porcentajePago = 0.15;
    }

    var cuotaMensual = ingreso * porcentajePago;

    if (totalActual === 0) {
        resumenMeses.textContent = "¡Liquidado!";
    } else if (cuotaMensual <= 0) {
        resumenMeses.textContent = "Sin ingreso";
    } else {
        var meses = Math.ceil(totalActual / cuotaMensual);
        if (checkVariable.checked) {
            resumenMeses.textContent = "~" + meses + " meses (variable)";
        } else {
            resumenMeses.textContent = meses + " meses";
        }
    }
}

// 5. Abonar a una deuda
function abonarDeuda(id) {
    for (var i = 0; i < deudas.length; i++) {
        if (deudas[i].id === id) {
            var respuesta = prompt("Saldo actual de " + deudas[i].nombre + ": $" + deudas[i].monto.toFixed(2) + "\n¿Cuánto deseas abonar?");
            var abono = parseFloat(respuesta);

            if (isNaN(abono) || abono <= 0) {
                return;
            }

            if (abono >= deudas[i].monto) {
                alert("¡Deuda liquidada por completo!");
                deudas.splice(i, 1);
            } else {
                deudas[i].monto = deudas[i].monto - abono;
            }

            actualizarPantalla();
            return;
        }
    }
}

// 6. Eliminar deuda
function eliminarDeuda(id) {
    var confirmar = confirm("¿Deseas eliminar esta deuda?");
    if (!confirmar) {
        return;
    }

    var nuevaLista = [];
    for (var i = 0; i < deudas.length; i++) {
        if (deudas[i].id !== id) {
            nuevaLista.push(deudas[i]);
        }
    }

    deudas = nuevaLista;
    actualizarPantalla();
}

// 7. Formulario de nueva deuda
btnAbrirForm.addEventListener("click", function () {
    formNuevaDeuda.classList.remove("oculto");
});

btnCancelarForm.addEventListener("click", function () {
    formNuevaDeuda.classList.add("oculto");
    formNuevaDeuda.reset();
});

formNuevaDeuda.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nombre = document.getElementById("deuda-nombre").value;
    var monto = parseFloat(document.getElementById("deuda-monto").value);
    var interes = parseFloat(document.getElementById("deuda-interes").value);
    var prioridad = document.getElementById("deuda-prioridad").value;

    var nuevaDeuda = {
        id: new Date().getTime(),
        nombre: nombre,
        montoInicial: monto,
        monto: monto,
        interes: interes,
        prioridad: prioridad
    };

    deudas.push(nuevaDeuda);
    formNuevaDeuda.reset();
    formNuevaDeuda.classList.add("oculto");
    actualizarPantalla();
});

// 8. Cambios en ingreso, tipo de ingreso o estrategia
inputIngreso.addEventListener("input", actualizarPantalla);
checkVariable.addEventListener("change", actualizarPantalla);
selectEstrategia.addEventListener("change", actualizarPantalla);

// 9. Asistente IA
document.getElementById("btn-ia").addEventListener("click", function () {
    panelSalida.classList.remove("oculto");
    salidaTitulo.textContent = "Consejo del Asistente IA";

    if (deudas.length === 0) {
        salidaContenido.innerHTML = "<p>No tienes deudas pendientes. Puedes enfocarte en ahorrar.</p>";
        return;
    }

    var ingreso = parseFloat(inputIngreso.value) || 0;
    var ordenInteres = deudas.slice().sort(function (a, b) { return b.interes - a.interes; });
    var ordenMonto = deudas.slice().sort(function (a, b) { return a.monto - b.monto; });

    var textoPrioridad = "";
    if (selectEstrategia.value === "Avalancha") {
        textoPrioridad = "Paga primero <strong>" + ordenInteres[0].nombre + "</strong> porque tiene mayor interés (" + ordenInteres[0].interes + "%).";
    } else {
        textoPrioridad = "Paga primero <strong>" + ordenMonto[0].nombre + "</strong> ($" + ordenMonto[0].monto.toFixed(2) + ") porque es la más pequeña.";
    }

    var textoIngreso = "";
    if (checkVariable.checked) {
        textoIngreso = "Como tu ingreso es variable, aparta cerca del 15% ($" + (ingreso * 0.15).toFixed(2) + ") este mes.";
    } else {
        textoIngreso = "Con tu ingreso fijo de $" + ingreso.toFixed(2) + ", intenta destinar $" + (ingreso * 0.21).toFixed(2) + " al mes.";
    }

    salidaContenido.innerHTML = "<p>" + textoPrioridad + "</p><p>" + textoIngreso + "</p>";
});

// 10. Generar informe
document.getElementById("btn-informe").addEventListener("click", function () {
    panelSalida.classList.remove("oculto");
    salidaTitulo.textContent = "Informe Mensual";

    var fecha = new Date().toLocaleDateString("es-EC");
    var total = 0;
    for (var i = 0; i < deudas.length; i++) {
        total = total + deudas[i].monto;
    }
    var ingreso = parseFloat(inputIngreso.value) || 0;

    salidaContenido.innerHTML =
        "<p><strong>Fecha:</strong> " + fecha + "</p>" +
        "<p><strong>Ingreso mensual:</strong> $" + ingreso.toFixed(2) + "</p>" +
        "<p><strong>Deudas activas:</strong> " + deudas.length + "</p>" +
        "<p><strong>Total a deber:</strong> $" + total.toFixed(2) + "</p>" +
        "<p><strong>Estrategia:</strong> " + selectEstrategia.value + "</p>" +
        "<button type='button' class='btn btn-azul' onclick='window.print()'>Imprimir / Guardar PDF</button>";
});

// 11. Menú inferior
function marcarBoton(botonActivo) {
    var botones = document.querySelectorAll(".nav-item");
    for (var i = 0; i < botones.length; i++) {
        botones[i].classList.remove("activo");
    }
    botonActivo.classList.add("activo");
}

document.getElementById("nav-inicio").addEventListener("click", function (e) {
    marcarBoton(e.target);
    panelSalida.classList.add("oculto");
});

document.getElementById("nav-herramientas").addEventListener("click", function (e) {
    marcarBoton(e.target);
    panelSalida.classList.remove("oculto");
    salidaTitulo.textContent = "Herramientas";
    salidaContenido.innerHTML =
        "<p>¿Quieres volver a los datos originales del ejemplo?</p>" +
        "<button type='button' class='btn btn-gris' onclick='restaurarDatos()'>Restaurar ejemplo</button>";
});

document.getElementById("nav-perfil").addEventListener("click", function (e) {
    marcarBoton(e.target);
    panelSalida.classList.remove("oculto");
    salidaTitulo.textContent = "Perfil y Privacidad";
    salidaContenido.innerHTML =
        "<p><strong>Usuario:</strong> Erick Palma</p>" +
        "<p><strong>Privacidad:</strong> Tus datos se quedan guardados en este dispositivo (modo local).</p>";
});

function restaurarDatos() {
    localStorage.removeItem("deudas_erick");
    deudas = [
        { id: 1, nombre: "Tarjeta de crédito", montoInicial: 1000, monto: 1000, interes: 22, prioridad: "Alta" },
        { id: 2, nombre: "Préstamo personal", montoInicial: 1500, monto: 1500, interes: 12, prioridad: "Media" }
    ];
    actualizarPantalla();
    alert("Datos originales restaurados.");
}

btnCerrarSalida.addEventListener("click", function () {
    panelSalida.classList.add("oculto");
});

// Iniciar aplicación
actualizarPantalla();