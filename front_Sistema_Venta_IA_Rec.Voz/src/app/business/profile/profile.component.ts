import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services_back/empleado.service';
import { LoginService } from '../../services_back/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Empleado } from '../../../interface/empleado';
import { Usuario } from '../../../interface/user';
import { CommonModule } from '@angular/common'; // <-- Importar esto

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent implements OnInit {
  constructor(
    private _empleadoservices: EmpleadoService,
    private _usuarioservices: LoginService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    //this.getEmpleados();
    this.id = this._usuarioservices.getUserIdFromToken();
    this.getEmpleados();
    this.getUsuario();
  }

  id: number | null = null;


  newEmpleado: Empleado = {
      nombre_completo: '',
      direccion: '',
      telefono: '',
      rol: '',
      fecha_nacimiento: new Date(),
      estado: 'Activo',
      username: ''
    };
  
    newUser: Usuario = {
      username: '',
      email: '',
      password: '',
      tipo_usuario: "empleado",
      estado: "activo"
    };

    getUsuario(): void {
      if (this.id !== null) {
        this._usuarioservices.getUser(this.id).subscribe(
          (data) => {
            this.newUser = data;
          },
          (error) => {
            this.toastr.error('Error al obtener los datos del usuario', 'Error');
          }
        );
      } else {
        this.toastr.warning('ID de usuario no definido', 'Advertencia');
      }
    }

    getEmpleados(): void {
      if (this.id !== null) {
        this._empleadoservices.get_Empleado_ID_User(this.id).subscribe(
          (data) => {
            this.newEmpleado = data;
          },
          (error) => {
            this.toastr.error('Error al obtener los datos del empleado', 'Error');
          }
        );
      } else {
        this.toastr.warning('ID de usuario no definido', 'Advertencia');
      }
    }
    

}
