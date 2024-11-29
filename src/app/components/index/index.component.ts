import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit, OnDestroy {
  email: string = 'elpandacomida@gmail.com';
  cartCount: number = 0;
  username: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    console.log('Inicializando componente Index...');
    this.loadCartCount();
    this.checkUserSession();
    console.log('Usuario cargado:', this.username);

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.syncLogout.bind(this));
    }
  }

  ngOnDestroy(): void {
    // Remover listener de eventos de almacenamiento si `window` está disponible
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.syncLogout.bind(this));
    }
  }

  private checkUserSession(): void {
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.username = user.nombreCompleto || null; // Usar el nombre completo del usuario
        this.isLoggedIn = !!user;
      } else {
        this.username = null;
        this.isLoggedIn = false;
      }
    }
  }

  // Cargar datos del carrito
  private loadCartCount(): void {
    if (typeof localStorage !== 'undefined') {
      const cart = localStorage.getItem('cart');
      if (cart) {
        try {
          const parsedCart = JSON.parse(cart);
          this.cartCount = Array.isArray(parsedCart)
            ? parsedCart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
            : 0;
        } catch (error) {
          console.error('Error al cargar el carrito:', error);
          this.cartCount = 0;
        }
      }
    }
  }

  // Agregar producto al carrito
  addToCart(product: any): void {
    if (typeof localStorage !== 'undefined') {
      let cart = localStorage.getItem('cart');
      let parsedCart = cart ? JSON.parse(cart) : [];
      const existingProduct = parsedCart.find((item: any) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        parsedCart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(parsedCart));
      this.cartCount += 1;
    }
  }

  // Redirigir al perfil del usuario
  goToProfile(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/user']);
    } else {
      alert('Por favor, inicie sesión primero.');
    }
  }

  // Iniciar sesión usando correo electrónico
  login(email: string, password: string): void {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      if (user.email === email && user.password === password) {
        this.username = user.nombreCompleto; // Usar el nombre completo
        this.isLoggedIn = true;
        localStorage.setItem('sesionActiva', 'true');

        // Dispara manualmente el evento 'storage'
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'));
          console.log('Evento de almacenamiento disparado manualmente.');
        }

        alert('Inicio de sesión exitoso');
      } else {
        alert('Correo o contraseña incorrectos');
      }
    } else {
      alert('Usuario no encontrado');
    }
  }

  // Cerrar sesión
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('sesionActiva');
      this.username = null;
      this.isLoggedIn = false;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
      alert('Sesión cerrada');
      this.router.navigate(['/']);
    }
  }

  // Sincronizar cierre de sesión entre pestañas
  private syncLogout(event: StorageEvent): void {
    if (event.key === 'sesionActiva') {
      const isActive = event.newValue === 'true';
      if (!isActive) {
        console.log('Sincronizando cierre de sesión');
        this.username = null;
        this.isLoggedIn = false;
      }
    }
  }

  // Verificar si el usuario está logueado
  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
