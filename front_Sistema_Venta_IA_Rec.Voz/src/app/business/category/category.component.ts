import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services_back/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Categoria } from '../../../interface/categoria';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export default class CategoryComponent implements OnInit {
  
  constructor(
    private _categoriaServices: CategoriaService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCategorias();
  }

  categorias: Categoria[] = []; 

  showForm = false;
  editar=false;

  new_categoria: Categoria = {
    nombre: '',
  };

  getCategorias() {
    this._categoriaServices.getCategorias().subscribe((data)=>{
      this.categorias = data;
    })
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.limpiarCampos();
  }

  limpiarCampos() {
    this.new_categoria = {
      nombre: '',
    };
  }

  addCategory() {
    if(!this.editar){
      this._categoriaServices.insertar_Categoria(this.new_categoria).subscribe((data)=>{
        this.toastr.success('Categoria registrada con éxito', 'Registro exitoso');
        this.showForm = false; // Ocultar formulario después de agregar
        this.getCategorias(); 
      })
    }else{
      this._categoriaServices.actualizar_Categoria(this.new_categoria).subscribe((data)=>{
        this.toastr.success('Categoria Actualizada con éxito', 'Actualizacion exitoso');
        this.showForm = false; // Ocultar formulario después de agregar
        this.editar=false;
        this.getCategorias(); 
      })
    }
  }

  editCategory(id?: number) {
    this.showForm = true; // Mostrar formulario
    this._categoriaServices.get_Categoria(id?.toString() || '').subscribe((data)=>{
      this.new_categoria = data; 
      this.editar=true; 
      this.getCategorias(); 
    })
  }

  deleteCategory(id?: number) {
    this._categoriaServices.eliminar_Categoria(id?.toString() || '').subscribe((data)=>{
      this.toastr.success('Categoria eliminada con éxito', 'Eliminación exitosa');
      this.getCategorias(); // Actualizar la lista de marcas
    }, (error)=>{
      this.toastr.error(error.error.message, 'Error al eliminar la categoria');
    })
  }
}