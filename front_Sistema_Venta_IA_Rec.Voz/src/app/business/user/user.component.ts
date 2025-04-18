import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services_back/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Empleado } from '../../../interface/empleado';
import { get } from 'http';
import { Usuario } from '../../../interface/user';
import { LoginService } from '../../services_back/login.service';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export default class UserComponent implements OnInit {

  constructor(
      private _empleadoservices: EmpleadoService,
      private _usuarioservices: LoginService,
      private toastr: ToastrService,
      private router: Router,
    ) { }


  empleados:Empleado[]=[];
  newUsername: string = ''; 


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

  permisoSeleccionado = {
    ventana: '',
    ver: false,
    insertar: false,
    editar: false,
    eliminar: false,
  };
  
  
  
  showForm = false;
  editar=false;

  showPermisos: boolean = false;
  permisosUsername: string = '';
  ventanasDisponibles: string[] = ['Inventario', 'Ventas', 'Clientes', 'Reportes']; // Ajusta según tus ventanas
  

  ngOnInit(): void {
    this.getEmpleados();
  }

  limpiarCampos() {
    this.newEmpleado = {
      nombre_completo: '',
      direccion: '',
      telefono: '',
      rol: '',
      fecha_nacimiento: new Date(),
      estado: 'Activo',
      username: ''
    };
    this.newUser = {
      username: '',
      email: '',
      password: '',
      tipo_usuario: "empleado",
      estado: "activo"
    };
    this.newUsername = '';
  }
  getEmpleados() {
    this._empleadoservices.getEmpleados().subscribe((data)=>{
      this.empleados = data;
    })
  }

  async toggleForm() {
    this.showForm = !this.showForm;
    this.limpiarCampos(); 
  }

  addUser() {
    if (!this.editar) {
      this.newEmpleado.username = this.newUsername;
      this.newUser.username = this.newUsername;
      this._usuarioservices.register(this.newUser).subscribe({
        next: (dataUsuario: any) => {
          this.toastr.success('Usuario registrado con éxito');
          this._empleadoservices.registrarEmpleados(this.newEmpleado).subscribe({
            next: (dataEmpleado) => {
              this.toastr.success('Empleado registrado con éxito');
              this.getEmpleados();
              this.showForm = false;
            },
            error: (errorEmpleado) => {
              this.toastr.error('Error al registrar el empleado');
            }
          });
        },
        error: (errorUsuario) => {
          this.toastr.error('Error al registrar el usuario');
        }
      });
    }else{
      this._empleadoservices.actualizar_Empleados(this.newEmpleado).subscribe({
        next: (data) => {
          this.toastr.success('Empleado actualizado con éxito');
          this.getEmpleados();
          this.showForm = false;
          this.editar=false;
        },
        error: (error) => {
          this.toastr.error('Error al actualizar el empleado');
        }
      });
    }
  }
  

  async editUser(nombre:string) {
    this.editar=true;
    this.showForm = true; 
    this._empleadoservices.get_Empleado(nombre).subscribe((data)=>{
      this.newEmpleado = data;
      this.getEmpleados();
    });
  }

  deleteUser(nombre_completo: string) {
    this._empleadoservices.get_Empleado(nombre_completo).subscribe({
      next: (empleado: Empleado) => {
        if (empleado.id_usuario) {
          this._empleadoservices.eliminar_Empleado(empleado).subscribe({
            next: () => {
              this.toastr.success('Empleado eliminado con éxito');
              this.getEmpleados();
            },
            error: (error) => {
              this.toastr.error('Error al eliminar el empleado');
            }
          });
        } else {
          this.toastr.error('No se encontró un ID de usuario para el empleado');
        }
      },
      error: (error) => {
        this.toastr.error('Error al obtener los datos del empleado');
      }
    });
  }


  abrirPermisos(username: string) {
    this.showPermisos = true;
    this.permisosUsername = username;
  
    // Puedes cargar permisos existentes aquí si los estás guardando en base de datos
    this.permisoSeleccionado = {
      ventana: '',
      ver: false,
      insertar: false,
      editar: false,
      eliminar: false,
    };
  }
  guardarPermiso() {
    console.log(`Guardando permisos para ${this.permisosUsername}`, this.permisoSeleccionado);
    this.toastr.success('Permisos guardados exitosamente');
    this.showPermisos = false;
  }
  
  cancelarPermisos() {
    this.showPermisos = false;
  }
  
}
