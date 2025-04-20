import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver' // Necesario para descargar el archivo

interface Producto {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

interface Compra {
  fecha: string;
  factura: string;
  productos: Producto[];
  totalCompra: number;
  subtotal: number; // Nuevo: propiedad subtotal
  descuento: number; // Nuevo: propiedad descuento
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export default class ReportsComponent {

  //clientes staticos por el momento -----------------------
  clientes = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@mail.com' },
    { id: 2, nombre: 'María López', email: 'maria.lopez@mail.com' }
  ];

  filtros = {
    cliente: '',
    fechaInicio: '',
    fechaFin: ''
  };

  clienteSeleccionado: any = null;
  reporte: Compra[] = [];
  totalGastado = 0;
  totalCompras = 0;
  promedioGasto = 0;
  reporteGenerado = false;

  generarReporte() {
    // Validar cliente seleccionado
    if (!this.filtros.cliente) {
      alert('Por favor, selecciona un cliente.');
      return;
    }

    // Validar rango de fechas
    if (!this.filtros.fechaInicio || !this.filtros.fechaFin) {
      alert('Por favor, selecciona un rango de fechas válido.');
      return;
    }

    const fechaInicio = new Date(this.filtros.fechaInicio);
    const fechaFin = new Date(this.filtros.fechaFin);

    // Buscar cliente seleccionado
    this.clienteSeleccionado = this.clientes.find(cliente => cliente.id === +this.filtros.cliente);

    // Filtrar compras según el rango de fechas
    this.reporte = [
      {
        fecha: '2025-04-01',
        factura: 'INV-001',
        productos: [
          { nombre: 'Producto A', cantidad: 2, precioUnitario: 100, total: 200 },
          { nombre: 'Producto B', cantidad: 1, precioUnitario: 150, total: 150 }
        ],
        totalCompra: 300, // Incluye descuento
        subtotal: 350,
        descuento: 50
      },
      {
        fecha: '2025-04-05',
        factura: 'INV-002',
        productos: [
          { nombre: 'Producto C', cantidad: 3, precioUnitario: 50, total: 150 }
        ],
        totalCompra: 130, // Incluye descuento
        subtotal: 150,
        descuento: 20
      }
    ].filter(compra => {
      const fechaCompra = new Date(compra.fecha);
      return fechaCompra >= fechaInicio && fechaCompra <= fechaFin;
    });

    // Calcular el Total Gastado como la suma de los "totalCompra" (valor ajustado por descuento)
    this.totalGastado = this.reporte.reduce((sum, compra) => sum + compra.totalCompra, 0);

    // Calcular el total de compras y promedio de gasto por compra
    this.totalCompras = this.reporte.length;
    this.promedioGasto = this.totalCompras > 0 ? this.totalGastado / this.totalCompras : 0;

    // Reporte generado exitosamente
    this.reporteGenerado = true;

    // Mostrar resultados para depuración
    console.log('Cliente seleccionado: ', this.clienteSeleccionado);
    console.log('Rango de fechas: ', fechaInicio, fechaFin);
    console.log('Reporte generado: ', this.reporte);
    console.log('Total gastado: ', this.totalGastado);
    console.log('Total compras: ', this.totalCompras);
    console.log('Promedio gasto: ', this.promedioGasto);
  }

  exportarPDF() {
    const doc = new jsPDF();

    // Logo y Encabezado
    const logoBase64 = 'assets/tiendalogo.png'; // Reemplaza con el Base64 del logo
    const logoWidth = 30;
    const originalWidth = 100;
    const originalHeight = 50;
    const aspectRatio = originalHeight / originalWidth;
    const logoHeight = logoWidth * aspectRatio;
    doc.addImage(logoBase64, 'PNG', 160, 10, logoWidth, logoHeight);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('Reporte de Venta', 10, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    doc.text('Reporte por Cliente', 10, 28);

    // Información del Cliente
    const clientInfo = [
      ['Nombre', this.clienteSeleccionado.nombre],
      ['Correo', this.clienteSeleccionado.email],
      ['Total Gastado', `${this.totalGastado.toFixed(2)} Bs`],
      ['Total Compras', `${this.totalCompras}`]
    ];
    autoTable(doc, {
      startY: 40,
      head: [['Detalle', 'Información']],
      body: clientInfo,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        cellPadding: 2,
        fillColor: [240, 240, 240],
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: 10, right: 10 }
    });

    // Obtener la posición final de la tabla
    const finalY = (doc as any).lastAutoTable.finalY + 5;

    // Tabla de Detalles de las Compras
    const body: any[] = [];
    this.reporte.forEach((compra) => {
      const productosFormato = compra.productos.map(producto => producto.nombre).join('\n');
      const cantidadesFormato = compra.productos.map(producto => producto.cantidad).join('\n');
      const preciosFormato = compra.productos.map(producto => producto.precioUnitario.toFixed(2)).join('\n');
      const importesFormato = compra.productos.map(producto => producto.total.toFixed(2)).join('\n'); // Importe (antes Subtotal)

      body.push([
        compra.fecha,
        productosFormato,
        cantidadesFormato,
        preciosFormato,
        importesFormato,
        compra.subtotal.toFixed(2), // Subtotal
        compra.descuento ? compra.descuento.toFixed(2) : '0.00', // Descuento
        (compra.subtotal - compra.descuento).toFixed(2) // Total
      ]);
    });

    autoTable(doc, {
      startY: finalY,
      head: [['Fecha', 'Producto', 'Cantidad', 'Precio Unitario', 'Importe', 'Subtotal', 'Descuento', 'Total']],
      body: body,
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        textColor: [33, 33, 33],
        lineColor: [200, 200, 200],
        lineWidth: 0.5,
        fillColor: [240, 240, 240]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { left: 10, right: 10 }
    });

    // Pie de Página
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado por: Sistema de Gestión de Ventas`, 10, pageHeight - 20);
    doc.text(`Fecha y Hora: ${new Date().toLocaleString()}`, 10, pageHeight - 10);

    // Guardar el PDF
    doc.save('reporte-cliente.pdf');
  }

  exportarExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ventas');

    // **Título Principal (Con Celdas Combinadas)**
    worksheet.mergeCells('A1:H1'); // Combinar celdas desde Fecha (A) hasta Total (H)
    const titleRow = worksheet.getRow(1); // Primera fila
    titleRow.getCell(1).value = 'Reporte compra cliente'; // Título único
    titleRow.getCell(1).font = { bold: true, size: 16 }; // Texto en negrita y más grande
    titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }; // Centrado perfecto
    titleRow.height = 20; // Ajustar altura de la fila para dar más espacio visual

    // **Espacio debajo del título**
    worksheet.addRow([]); // Fila vacía

    // **Información del Cliente**
    const clienteInfo = [
      ['Nombre:', this.clienteSeleccionado?.nombre || 'N/A'],
      ['Correo:', this.clienteSeleccionado?.email || 'N/A'],
      ['Total Gastado:', `${this.totalGastado.toFixed(2)} Bs`],
      ['Total Compras:', this.totalCompras]
    ];
    clienteInfo.forEach((info) => {
      const row = worksheet.addRow(info);
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 ? 'right' : 'left' }; // Alineación del texto
        if (colNumber === 1) {
          cell.font = { bold: true }; // Negrita para los títulos de la información
        }
      });
    });

    // **Espacio entre la información del cliente y la tabla**
    worksheet.addRow([]); // Fila vacía

    // **Fila de Títulos de la Tabla**
    const tableTitles = ['Fecha', 'Producto', 'Cantidad', 'Precio Unitario', 'Importe', 'Subtotal', 'Descuento', 'Total'];
    const titlesRow = worksheet.addRow(tableTitles); // Esta fila es parte de los datos
    titlesRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 }; // Negrita para los títulos de las columnas
      cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF007ACC' } // Fondo azul
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });

    // **Llenar los Datos con Fusión de Celdas**
    let currentRow = worksheet.rowCount + 1; // Empieza después de los títulos de la tabla
    let isGray = true; // Alternar colores por fila

    this.reporte.forEach((compra) => {
      const firstRow = currentRow; // Fila inicial de la compra

      compra.productos.forEach((producto, index) => {
        const row = worksheet.addRow([
          index === 0 ? compra.fecha : '', // Fecha solo para la primera fila de productos de esta compra
          producto.nombre,
          producto.cantidad,
          producto.precioUnitario,
          producto.total,
          index === 0 ? compra.subtotal : '', // Subtotal solo para la primera fila
          index === 0 ? compra.descuento : '', // Descuento solo para la primera fila
          index === 0 ? compra.subtotal - compra.descuento : '' // Total solo para la primera fila
        ]);

        const rowColor = isGray ? 'FFD3D3D3' : 'FFFFFFFF'; // Alternar entre gris y blanco
        row.eachCell((cell, colNumber) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: rowColor }
          };

          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };

          cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrar texto en la celda
        });

        currentRow++; // Incrementar la fila actual
      });

      const lastRow = currentRow - 1; // Última fila de la compra

      // **Fusionar celdas para las columnas específicas**
      worksheet.mergeCells(`A${firstRow}:A${lastRow}`); // Fusionar columna Fecha
      worksheet.mergeCells(`F${firstRow}:F${lastRow}`); // Fusionar columna Subtotal
      worksheet.mergeCells(`G${firstRow}:G${lastRow}`); // Fusionar columna Descuento
      worksheet.mergeCells(`H${firstRow}:H${lastRow}`); // Fusionar columna Total

      isGray = !isGray; // Alternar el color de las filas
    });

    // **Ajustar el ancho de las columnas automáticamente**
    worksheet.columns.forEach((column) => {
      column.width = 15; // Ajustar el ancho de cada columna
    });

    // **Generar y Descargar el Archivo Excel**
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'reporte-cliente.xlsx');
    });
  }
}

