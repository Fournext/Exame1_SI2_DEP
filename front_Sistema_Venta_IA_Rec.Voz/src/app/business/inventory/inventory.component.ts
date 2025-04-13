import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Inventory {
  id: number;
  productName: string;
  availableStock: number;
  minimumStock: number;
  lastUpdated: string;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export default class InventoryComponent {
  products = [
    { name: 'Televisor OLED' },
    { name: 'Zapatillas deportivas' },
    { name: 'Smartphone Android' },
  ];

  inventories: Inventory[] = [];
  showForm = false;

  newInventory: Inventory = {
    id: 0,
    productName: '',
    availableStock: 0,
    minimumStock: 0,
    lastUpdated: '',
  };

  // Estado para el menú emergente
  showStockModal = false;
  selectedInventoryId: number | null = null;
  stockToAdd: number = 0;

  toggleForm() {
    this.showForm = !this.showForm;
    this.newInventory = {
      id: this.inventories.length > 0 ? Math.max(...this.inventories.map(inventory => inventory.id)) + 1 : 1,
      productName: '',
      availableStock: 0,
      minimumStock: 0,
      lastUpdated: '',
    };
  }

  addInventory() {
    if (
      this.newInventory.productName.trim() &&
      this.newInventory.availableStock > 0 &&
      this.newInventory.minimumStock > 0
    ) {
      this.newInventory.lastUpdated = new Date().toISOString();
      this.inventories.push({ ...this.newInventory });
      this.toggleForm();
    } else {
      console.error('Todos los campos son obligatorios');
    }
  }

  deleteInventory(id: number) {
    this.inventories = this.inventories.filter(inventory => inventory.id !== id);
  }

  // Abrir el menú emergente para añadir stock
  openStockModal(id: number) {
    this.selectedInventoryId = id;
    this.stockToAdd = 0;
    this.showStockModal = true;
  }

  // Cerrar el menú emergente
  closeStockModal() {
    this.showStockModal = false;
    this.selectedInventoryId = null;
    this.stockToAdd = 0;
  }

  // Confirmar la cantidad y añadir stock
  confirmAddStock() {
    if (this.selectedInventoryId !== null && this.stockToAdd > 0) {
      const inventoryItem = this.inventories.find(item => item.id === this.selectedInventoryId);
      if (inventoryItem) {
        inventoryItem.availableStock += this.stockToAdd;
        inventoryItem.lastUpdated = new Date().toISOString();
      }
    }
    this.closeStockModal();
  }

  isStockLow(inventory: Inventory): boolean {
    return inventory.availableStock < inventory.minimumStock;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-BO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }
}
