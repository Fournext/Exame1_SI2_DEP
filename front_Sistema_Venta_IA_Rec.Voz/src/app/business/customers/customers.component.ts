import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export default class CustomersComponent {
  //parte de clientes estaticos
  clientes = [
    { id: 1, nombre: 'Juan Pérez', direccion: 'Calle Principal 123', telefono: '123456789', estado: 'Activo' },
    { id: 2, nombre: 'María López', direccion: 'Avenida Secundaria 456', telefono: '987654321', estado: 'Inactivo' },
  ];
}