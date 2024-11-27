const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
let datos = meses.map(() => ({ ingreso: 0, gasto: 0 }));
let mesActual = 0;

function establecerMes() {
  mesActual = parseInt(document.getElementById("mesActual").value);
  alert(`Mes establecido: ${meses[mesActual]}`);
}

function capturarDatos() {
  const ingreso = parseFloat(document.getElementById("ingresoMes").value) || 0;
  const gasto = parseFloat(document.getElementById("gastoMes").value) || 0;

  if (ingreso < 0 || gasto < 0) {
    alert("Los valores no pueden ser negativos.");
    return;
  }

  datos[mesActual].ingreso = ingreso;
  datos[mesActual].gasto = gasto;

  alert(
    `Datos guardados para ${meses[mesActual]}:\nIngresos: ${ingreso}\nGastos: ${gasto}`
  );
}

function mostrarAnuales() {
  const tablaCuerpo = document.getElementById("tablaCuerpo");
  tablaCuerpo.innerHTML = "";

  datos.forEach((dato, index) => {
    const row = `<tr>
            <td>${meses[index]}</td>
            <td>${dato.ingreso.toFixed(2)}</td>
            <td>${dato.gasto.toFixed(2)}</td>
        </tr>`;
    tablaCuerpo.innerHTML += row;
  });

  document.getElementById("tablaAnuales").style.display = "table";
}

function calcularImpuestos() {
  const ingresoTotal = datos.reduce((acc, curr) => acc + curr.ingreso, 0);
  const gastoTotal = datos.reduce((acc, curr) => acc + curr.gasto, 0);

  const IVA = ingresoTotal * 0.16;
  const subTotal = ingresoTotal + IVA;
  const retencionISR = ingresoTotal * 0.1;
  const retencionIVA = ingresoTotal * 0.1;
  const total = subTotal - (retencionISR + retencionIVA);

  const gananciaBruta = ingresoTotal - gastoTotal;
  const ISR = gananciaBruta * 0.11;
  const gananciaNeta = gananciaBruta - ISR;

  const resumen = `
        <p><strong>Total Ingresos:</strong> ${ingresoTotal.toFixed(2)}</p>
        <p><strong>Total Gastos:</strong> ${gastoTotal.toFixed(2)}</p>
        <p><strong>IVA:</strong> ${IVA.toFixed(2)}</p>
        <p><strong>Subtotal:</strong> ${subTotal.toFixed(2)}</p>
        <p><strong>Retención ISR:</strong> ${retencionISR.toFixed(2)}</p>
        <p><strong>Retención IVA:</strong> ${retencionIVA.toFixed(2)}</p>
        <p><strong>Total (con Retenciones):</strong> ${total.toFixed(2)}</p>
        <p><strong>Ganancia Bruta:</strong> ${gananciaBruta.toFixed(2)}</p>
        <p><strong>ISR:</strong> ${ISR.toFixed(2)}</p>
        <p><strong>Ganancia Neta:</strong> ${gananciaNeta.toFixed(2)}</p>
    `;

  const resumenDiv = document.getElementById("resumenImpuestos");
  resumenDiv.style.display = "block";
  resumenDiv.innerHTML = resumen;
}

function exportarExcel() {
  // Preparar datos para exportar
  const datosExportar = datos.map((dato, index) => ({
    Mes: meses[index],
    Ingresos: dato.ingreso.toFixed(2),
    Gastos: dato.gasto.toFixed(2),
    "IVA (16%)": (dato.ingreso * 0.16).toFixed(2),
    "Ganancia Bruta": (dato.ingreso - dato.gasto).toFixed(2),
    ISR: ((dato.ingreso - dato.gasto) * 0.11).toFixed(2),
    "Ganancia Neta": ((dato.ingreso - dato.gasto) * 0.89).toFixed(2),
  }));

  // Crear hoja de Excel
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(datosExportar);

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, "Resumen de Impuestos");

  // Exportar archivo
  XLSX.writeFile(wb, "Resumen_Impuestos.xlsx");
}
