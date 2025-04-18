import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services_back/producto.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Producto } from '../../../interface/producto';
import { Categoria } from '../../../interface/categoria';
import { CategoriaService } from '../../services_back/categoria.service';
import { MarcaService } from '../../services_back/marca.service';
import { Marca } from '../../../interface/marca';
import LoginComponent from '../login/login.component';
import { LoginService } from '../../services_back/login.service';
import { Permisos } from '../../../interface/permisos';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export default class ProductComponent implements OnInit {

  constructor(
    private _productoServices: ProductoService,
    private _categoriaServices: CategoriaService,
    private _marcaServices: MarcaService,
    private toastr: ToastrService,
    private _userServices: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getProducto();
    this.getCategorias();
    this.getMarcas();
    this.getPermisos();
  }

  getProducto() {
    this._productoServices.getProductos_Todo().subscribe((data)=>{
      this.productos = data;
    })
  }

  getPermisos(){
    var id_user = this._userServices.getUserIdFromToken();
    this._userServices.getUser(id_user || 0).subscribe((data)=>{
      this.username = data.username;
      this._userServices.get_permisos_user_ventana(this.username,"Productos").subscribe((data)=>{
        this.perm_insertar = data.insertar;
        this.perm_editar = data.editar;
        this.perm_eliminar = data.eliminar;
        this.perm_ver = data.ver;
      });
    });
  }

  getCategorias() {
    this._categoriaServices.getCategorias().subscribe((data)=>{
      this.categorias = data;
    })
  }
  getMarcas() {
    this._marcaServices.getMarcas().subscribe((data)=>{
      this.marcas = data;
    })
  }

  productos: Producto[] = []; 
  categorias: Categoria[] = []; 
  marcas: Marca[] = []; 

  showForm = false;
  editar=false;

  newProducto: Producto = {
    descripcion: '',
    categoria: '',
    marca: '',
    descripcion_marca: '',
    costo: 0,
    precio: 0,
    estado: 'activo',

  };

  new_categoria: Categoria = {
    nombre: '',
  };

  newMarca: Marca = {
    nombre: '',
    descripcion_marca: '',
  };

  username: string = '';

  perm_insertar: string = '';
  perm_editar: string = '';
  perm_eliminar: string = '';
  perm_ver: string = '';

  toggleForm() {
    this.showForm = !this.showForm;
    this.limpiarCampos();
  }

  limpiarCampos() {
    this.newProducto = {
      descripcion: '',
      categoria: '',
      marca: '',
      descripcion_marca: '',
      costo: 0,
      precio: 0,
      estado: 'activo',
    };
  }

  addProduct() {
    if(!this.editar){
      this._productoServices.insertar_productos(this.newProducto).subscribe((data)=>{
        this.toastr.success('Producto registrado con éxito', 'Registro exitoso');
        this.showForm = false; // Ocultar formulario después de agregar
        this.getProducto(); 
      })
    }else{
      this._productoServices.actualizar_Producto(this.newProducto).subscribe((data)=>{
        this.toastr.success('Producto Actualizado con éxito', 'Actualizacion exitoso');
        this.showForm = false; // Ocultar formulario después de agregar
        this.editar=false;
        this.getProducto(); 
      })
    }
  }

  editProduct(id?: number) {
    this.editar=true; 
    this.showForm = true; // Mostrar formulario
    this._productoServices.get_Producto(id?.toString() || '').subscribe((data)=>{
      this.newProducto = data; 
      this.getProducto(); 
    })
  }

  deleteProduct(id?: number) {
    this._productoServices.eliminar_Producto(id?.toString() || '').subscribe((data)=>{
      this.toastr.success('Producto eliminado con éxito', 'Eliminación exitosa');
      this.getProducto(); // Actualizar la lista de marcas
    }, (error)=>{
      this.toastr.error(error.error.message, 'Error al eliminar el Producto');
    })
  }

}
