import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Marca } from '../../../interface/marca';
import { OnInit } from '@angular/core';
import { MarcaService } from '../../services_back/marca.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
})
export default class BrandComponent implements OnInit {
 
  constructor(
    private _marcaServices: MarcaService,
    private toastr: ToastrService,
    private router: Router,
  ) { }


  marcas: Marca[] = []; // Lista vacía inicializada correctamente

  showForm = false;
  editar=false;

  newMarca: Marca = {
    nombre: '',
    descripcion_marca: '',
  };

  ngOnInit(): void {
    this.getMarcas();
  }

  getMarcas() {
    this._marcaServices.getMarcas().subscribe((data)=>{
      this.marcas = data;
    })
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.limpiarCampos(); 
  }

  limpiarCampos() {
    this.newMarca = {
      nombre: '',
      descripcion_marca: '',
    };
  }

  addBrand() {
    if(!this.editar){
      this._marcaServices.insertar_Marca(this.newMarca).subscribe((data)=>{
        this.toastr.success('Marca registrada con éxito', 'Registro exitoso');
        this.showForm = false; // Ocultar formulario después de agregar
        this.getMarcas(); // Actualizar la lista de marcas
      })
    }else{
      this._marcaServices.actualizar_Marca(this.newMarca).subscribe((data)=>{
        this.toastr.success('Marca Actualizada con éxito', 'Actualizacion exitoso');
        this.showForm = false; // Ocultar formulario después de agregar
        this.editar=false;
        this.getMarcas(); // Actualizar la lista de marcas
      })
    }
    
  }

  editBrand(id?: number) {
    this.showForm = true; // Mostrar formulario
    this._marcaServices.get_Marca(id?.toString() || '').subscribe((data)=>{
      this.newMarca = data; 
      this.editar=true; 
      this.getMarcas(); // Actualizar la lista de marcas
    })
  }

  deleteBrand(id?: number) {
    this._marcaServices.eliminar_Marca(id?.toString() || '').subscribe((data)=>{
      this.toastr.success('Marca eliminada con éxito', 'Eliminación exitosa');
      this.getMarcas(); // Actualizar la lista de marcas
    }, (error)=>{
      this.toastr.error(error.error.message, 'Error al eliminar la marca');
    })
  }
}
