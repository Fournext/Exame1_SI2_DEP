import { Component, HostListener, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router'; // Importar Router y eventos de navegación
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { MenuService } from '../../services/menu/menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Agregar CommonModule
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menuVisible: boolean = false; // Estado inicial del menú
  showSubMenu = false; // Estado del submenú

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {
    // Escucha los cambios del estado del menú desde el servicio
    this.menuService.menuVisible$.subscribe((visible) => {
      this.menuVisible = visible;
    });

    // Escucha cambios de ruta para cerrar el submenú
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = this.router.url;
    
        // Cierra el submenú solo si navega a una ruta que no sea de Productos
        if (!currentUrl.startsWith('/products') && !currentUrl.startsWith('/brand') && !currentUrl.startsWith('/category')) {
          this.showSubMenu = false;
        }
      }
    });
  }

  // Escuchar cambios en el tamaño de la ventana
  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  // Verificar si el tamaño de la pantalla es grande para ocultar el menú responsivo
  private checkScreenSize(): void {
    const isLargeScreen = window.innerWidth >= 1280; // 1280px para pantallas grandes
    if (isLargeScreen && this.menuVisible) {
      this.menuService.toggleMenu(); // Oculta el menú si está visible
    }
  }

  // Método para cerrar el menú después de seleccionar una opción
  closeMenu(): void {
    if (this.menuVisible) {
      this.menuService.toggleMenu(); // Ocultar el menú si está activo
    }
  }

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu; // Alternar la visibilidad del submenú
  }
}
