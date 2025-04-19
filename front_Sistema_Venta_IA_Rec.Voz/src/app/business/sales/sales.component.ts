import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export default class SalesComponent {
  //ventas estaticas por defecto:
  ventas = [
    {
      id: 1,
      nombreCliente: 'Juan Pérez',
      montoTotal: 3000,
      fecha: new Date(),
      metodoPago: 'Efectivo',
      detalles: [
        { producto: 'Honor X8a', cantidad: 2, precioUnitario: 1500, importe: 3000 },
        { producto: 'Honor X8b', cantidad: 1, precioUnitario: 2000, importe: 4000 },
        { producto: 'Honor X8c', cantidad: 3, precioUnitario: 2500, importe: 5000 },
      ],
      subtotal: 12000,
      descuento: 150,
      total: 11850
    },
    {
      id: 2,
      nombreCliente: 'María López',
      montoTotal: 2500,
      fecha: new Date(),
      metodoPago: 'Tarjeta',
      detalles: [
        { producto: 'Samsung A14', cantidad: 1, precioUnitario: 2500, importe: 2500 }
      ],
      subtotal: 2500,
      descuento: 100,
      total: 2400
    }
  ];

  ventaSeleccionada: any = null;

  mostrarDetalle(venta: any) {
    this.ventaSeleccionada = venta;
  }

  cerrarModal() {
    this.ventaSeleccionada = null;
  }
}