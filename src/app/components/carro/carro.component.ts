import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

declare global {
  interface Window {
    bootstrap: any;
  }
}

@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carro.component.html',
  styleUrls: ['./carro.component.css'],
})
export class CarroComponent implements OnInit, OnDestroy {
  @ViewChild('paymentModal') paymentModal: ElementRef | undefined;
  @ViewChild('loginModal') loginModal: ElementRef | undefined;

  email: string = '';
  password: string = '';
  cart: any[] = [];
  cartCount: number = 0;
  cartTotal: number = 0;
  cartEmptyMessage: boolean = false;
  subTotal: number = 0;
  discount: number = 0;
  tax: number = 0;
  paymentMethod: string = 'Tarjeta de Crédito';
  estimatedDeliveryDate: string = '2024-12-01';
  trackingNumber: string | null = null;
  paymentConfirmed: boolean = false;

  username: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private el: ElementRef) {}

  goToProfile(): void {
    this.router.navigate(['/user']); // Navegar a la página de usuario
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.loadUsername();
      this.loadCart(); // Cargar carrito al iniciar el componente
      window.addEventListener('storage', this.syncLogout.bind(this)); // Escuchar cambios en localStorage
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser()) {
      window.removeEventListener('storage', this.syncLogout.bind(this)); // Eliminar listener al destruir el componente
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
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
    if (this.isBrowser()) {
      if (event.key === 'sesionActiva' && event.newValue === 'false') {
        this.username = null;
        this.isLoggedIn = false;
        this.router.navigate(['/']); // Redirigir al inicio si la sesión se cierra
      }
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      this.username = null;
      this.isLoggedIn = false;
      localStorage.setItem('sesionActiva', 'false');
      this.openLogoutModal(); // Mostrar modal de cierre de sesión
      this.router.navigate(['/']);
    }
  }

  // Mostrar modal de cierre de sesión
  private openLogoutModal(): void {
    const modalButton = this.el.nativeElement.querySelector('#logoutModalButton');
    console.log('Modal Button:', modalButton); 
    if (modalButton) {
      modalButton.click();
      console.log('Modal should open');
    }
  }

  loadCart(): void {
    if (this.isBrowser()) {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        this.cart = JSON.parse(cartData);
      } else {
        this.cart = [];
      }

      this.cartEmptyMessage = this.cart.length === 0;
      this.subTotal = this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
      this.discount = this.calculateDiscount();
      this.tax = this.calculateTax(this.subTotal - this.discount);
      this.cartTotal = this.subTotal - this.discount + this.tax;
      this.cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
    }
  }

  removeFromCart(productId: number): void {
    if (this.isBrowser()) {
      this.cart = this.cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.loadCart();
    }
  }

  finalizePurchase(): void {
    if (this.cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    this.openPaymentModal();
  }

  openPaymentModal(): void {
    if (this.paymentModal) {
      const modalElement = this.paymentModal.nativeElement;
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  simulatePayment(): void {
    if (this.isBrowser()) {
      const today = new Date().toLocaleDateString();
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');

      this.cart.forEach(item => {
        const trackingNumber = this.generateTrackingNumber();

        const purchase = {
          producto: item.name,
          precio: item.price,
          cantidad: item.quantity,
          total: item.price * item.quantity,
          fecha: today,
          trackingNumber: trackingNumber,
          status: 'En proceso',
        };
        purchases.push(purchase);
      });

      localStorage.setItem('purchases', JSON.stringify(purchases));
      localStorage.removeItem('cart');
      this.loadCart();

      alert('¡Compra finalizada con éxito!');
      this.router.navigate(['/carro']);
    }
  }

  private generateTrackingNumber(): string {
    const trackingNumber = Math.floor(Math.random() * 1000000).toString();
    this.trackingNumber = trackingNumber;
    return trackingNumber;
  }

  calculateDiscount(): number {
    return this.subTotal * 0.1;
  }

  calculateTax(amount: number): number {
    return amount * 0.19;
  }

  processPayment(): void {
    alert('Procesando el pago...');
    this.simulatePayment();
    this.paymentConfirmed = true;
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  finalizeOrder(): void {
    const modalElement = this.paymentModal?.nativeElement;
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.hide();
    }

    this.router.navigate(['/index']);
  }

  register(email: string, password: string, username: string): void {
    if (this.isBrowser()) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const existeUsuario = usuarios.some((user: any) => user.email === email);

      if (existeUsuario) {
        alert('El usuario ya está registrado.');
        return;
      }

      usuarios.push({ email, password, username });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      alert('Usuario registrado exitosamente.');
    }
  }

  login(emailInput: string, passwordInput: string): void {
    if (this.isBrowser()) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = usuarios.find((user: any) => user.email === emailInput && user.password === passwordInput);

      if (usuario) {
        localStorage.setItem('nombreUsuario', usuario.username);
        localStorage.setItem('sesionActiva', 'true');
        this.username = usuario.username;
        this.isLoggedIn = true;
        alert(`Bienvenido ${usuario.username}`);
      } else {
        alert('Credenciales incorrectas');
      }
    }
  }
}