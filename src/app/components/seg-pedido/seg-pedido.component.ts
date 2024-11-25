import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seg-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seg-pedido.component.html',
  styleUrls: ['./seg-pedido.component.css'],
})
export class SegPedidoComponent implements OnInit, OnDestroy {
  email: string = 'elpandacomida@gmail.com';
  orderNumber: string = '';  
  orderStatus: string = '';  
  errorMessage: string = ''; 
  orders: any[] = [];        
  username: string | null = null;  // Nombre de usuario
  isLoggedIn: boolean = false;    // Estado de si el usuario está logueado

  constructor(private router: Router) {}

  goToProfile(): void {
    this.router.navigate(['/user']); 
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.loadUsername();  // Cargar el nombre de usuario al iniciar
      window.addEventListener('storage', this.syncLogout.bind(this)); // Escuchar cambios en localStorage
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser()) {
      window.removeEventListener('storage', this.syncLogout.bind(this)); // Eliminar listener al destruir el componente
    }
  }

  // Método para cargar el nombre de usuario desde localStorage solo en navegador
  loadUsername() {
    if (this.isBrowser()) {
      const storedUsername = localStorage.getItem('nombreUsuario');
      const sesionActiva = localStorage.getItem('sesionActiva') === 'true';

      if (storedUsername && sesionActiva) {
        this.username = storedUsername;
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }
  }

  // Método para sincronizar el cierre de sesión en otros componentes
  syncLogout(event: StorageEvent): void {
    if (this.isBrowser() && event.key === 'sesionActiva' && event.newValue === 'false') {
      this.username = null;
      this.isLoggedIn = false;
      this.router.navigate(['/']); // Redirigir al inicio si la sesión se cierra
    }
  }

  // Método para rastrear el pedido
  trackOrder(): void {
    if (!this.orderNumber) {
      this.errorMessage = 'Por favor, ingresa un número de pedido válido.';
      this.orderStatus = ''; 
      return; 
    }

    this.errorMessage = ''; 
    this.orderStatus = ''; 

    if (this.isBrowser()) {
      // Obtener los pedidos almacenados en localStorage solo en navegador
      const orders = JSON.parse(localStorage.getItem('purchases') || '[]');

      // Buscar el pedido con el número de seguimiento ingresado
      const order = orders.find((purchase: any) => purchase.trackingNumber === this.orderNumber);
      
      if (order) {
        // Si se encuentra el pedido, mostrar su estado
        this.orderStatus = `Estado de tu pedido: ${order.producto}, Precio: $${order.total}, Estado: ${order.status || 'No disponible'}`;
        this.orders = [order]; 
        this.openModal(); 
      } else {
        // Si no se encuentra el pedido, mostrar un mensaje de error
        this.errorMessage = 'No se encontró un pedido con ese número.';
      }
    }
  }

  // Abrir el modal
  openModal(): void {
    if (this.isBrowser()) {
      const modal = new window.bootstrap.Modal(document.getElementById('orderModal'));
      modal.show();
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      // Solo realizamos cambios en el localStorage si estamos en el navegador
      localStorage.setItem('sesionActiva', 'false');
      this.isLoggedIn = false;
      this.username = null;
      alert('Has cerrado sesión');
      this.router.navigate(['/']);  // Redirigir al inicio o a la página que desees
    }
  }
  
  // Verificar si estamos en un navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
