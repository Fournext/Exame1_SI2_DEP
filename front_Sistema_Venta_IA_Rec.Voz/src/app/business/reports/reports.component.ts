import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    if (!this.filtros.cliente) {
      alert('Por favor, selecciona un cliente.');
      return;
    }

    if (!this.filtros.fechaInicio || !this.filtros.fechaFin) {
      alert('Por favor, selecciona un rango de fechas válido.');
      return;
    }

    const fechaInicio = new Date(this.filtros.fechaInicio);
    const fechaFin = new Date(this.filtros.fechaFin);

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
        totalCompra: 350,
        subtotal: 350, // Calculado como la suma de los importes
        descuento: 50 // Ejemplo de descuento aplicado
      },
      {
        fecha: '2025-04-05',
        factura: 'INV-002',
        productos: [
          { nombre: 'Producto C', cantidad: 3, precioUnitario: 50, total: 150 }
        ],
        totalCompra: 150,
        subtotal: 150, // Calculado como la suma de los importes
        descuento: 20 // Ejemplo de descuento aplicado
      }
    ].filter(compra => {
      const fechaCompra = new Date(compra.fecha);
      return fechaCompra >= fechaInicio && fechaCompra <= fechaFin;
    });

    this.totalGastado = this.reporte.reduce((sum, compra) => sum + compra.totalCompra, 0);
    this.totalCompras = this.reporte.length;
    this.promedioGasto = this.totalGastado / this.totalCompras;
    this.reporteGenerado = true;
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
}

