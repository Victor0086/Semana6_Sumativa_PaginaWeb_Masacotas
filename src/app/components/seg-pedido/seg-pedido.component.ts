import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('logoutModal') logoutModal: ElementRef | undefined; // Referencia al modal de cierre de sesión

  email: string = 'elpandacomida@gmail.com';
  orderNumber: string = '';  
  orderStatus: string = '';  
  errorMessage: string = ''; 
  orders: any[] = [];        
  username: string | null = null; 
  isLoggedIn: boolean = false;   

  constructor(private router: Router) {}

  goToProfile(): void {
    this.router.navigate(['/user']); 
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.loadUsername();  
      window.addEventListener('storage', this.syncLogout.bind(this)); 
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser()) {
      window.removeEventListener('storage', this.syncLogout.bind(this)); 
    }
  }

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

  syncLogout(event: StorageEvent): void {
    if (this.isBrowser() && event.key === 'sesionActiva' && event.newValue === 'false') {
      this.username = null;
      this.isLoggedIn = false;
      this.router.navigate(['/']); 
    }
  }

  trackOrder(): void {
    if (!this.orderNumber) {
      this.errorMessage = 'Por favor, ingresa un número de pedido válido.';
      this.orderStatus = ''; 
      return; 
    }

    this.errorMessage = ''; 
    this.orderStatus = ''; 

    if (this.isBrowser()) {
      const orders = JSON.parse(localStorage.getItem('purchases') || '[]');
      const order = orders.find((purchase: any) => purchase.trackingNumber === this.orderNumber);
      
      if (order) {
        this.orderStatus = `Estado de tu pedido: ${order.producto}, Precio: $${order.total}, Estado: ${order.status || 'No disponible'}`;
        this.orders = [order]; 
        this.openModal(); 
      } else {
        this.errorMessage = 'No se encontró un pedido con ese número.';
      }
    }
  }

  openModal(): void {
    if (this.isBrowser()) {
      const modal = new window.bootstrap.Modal(document.getElementById('orderModal'));
      modal.show();
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.setItem('sesionActiva', 'false');
      this.isLoggedIn = false;
      this.username = null;
      this.openLogoutModal(); // Mostrar modal de cierre de sesión
      this.router.navigate(['/']);  
    }
  }

  private openLogoutModal(): void {
    if (this.logoutModal) {
      const modalElement = this.logoutModal.nativeElement;
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}