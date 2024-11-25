import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  email: string = '';
  password: string = '';
  cartCount: number = 0;
  username: string | null = null;
  isLoggedIn: boolean = false;
  loginMessage: string = ''; 

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.loadUsername();
      this.loadCartCount();
    }
  }

    // Método para redirigir al perfil del usuario
    goToProfile(): void {
      if (this.isLoggedIn) {
        this.router.navigate(['/user']); 
      } else {
        alert('Por favor, inicie sesión primero.');
      }
    }

  // Verificar si estamos en el navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Cargar datos del carrito
  loadCartCount() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      try {
        const parsedCart = JSON.parse(cart);
        this.cartCount = Array.isArray(parsedCart)
          ? parsedCart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
          : 0;
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
        this.cartCount = 0;
      }
    }
  }

  // Cargar nombre de usuario y estado de sesión
  loadUsername() {
    const storedUsername = localStorage.getItem('nombreUsuario');
    const sesionActiva = localStorage.getItem('sesionActiva') === 'true';

    if (storedUsername && sesionActiva) {
      this.username = storedUsername;
      this.isLoggedIn = true;
      this.loginMessage = `Bienvenido, ${this.username}`;
    } else {
      this.isLoggedIn = false;
      this.loginMessage = '';  
    }
  }

  // Lógica de inicio de sesión
  login(username: string, password: string): void {
  
    const storedUsername = localStorage.getItem('nombreUsuario');
    const storedPassword = localStorage.getItem('password');  

    if (storedUsername === username && storedPassword === password) {
      localStorage.setItem('sesionActiva', 'true');
      this.isLoggedIn = true;
      this.username = username;
      this.loginMessage = `Bienvenido, ${username}`; 
      alert('Login exitoso');
      window.dispatchEvent(new Event('storage')); 
    } else {
      this.loginMessage = 'Usuario o contraseña incorrectos';
      alert('Credenciales incorrectas');
    }
  }

  // Agregar producto al carrito
  addToCart(product: any) {
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

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('sesionActiva');
    this.isLoggedIn = false;
    this.username = null;
    this.loginMessage = ''; 
    alert('Has cerrado sesión');
    window.dispatchEvent(new Event('storage'));
    this.router.navigate(['/']);
  }

  // Verificar si el usuario está logueado
  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
