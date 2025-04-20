import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services_back/cliente.service';
import { Cliente } from '../../../interface/cliente';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export default class CustomersComponent implements OnInit{

  constructor(
    private toastr: ToastrService,
    private _clienteServices: ClienteService,
  ) { }

  ngOnInit(): void {
    this.getClietes();
  }

  getClietes(){
    this._clienteServices.getClientes().subscribe((data)=>{
      this.clientes=data;
    });
  }


  //parte de clientes estaticos
  clientes: Cliente[]=[];
}