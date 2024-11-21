import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carro.component.html',
  styleUrls: ['./carro.component.css'],
})
export class CarroComponent implements OnInit {
  email: string = 'elpandacomida@gmail.com';
  cart: any[] = []; // Lista de productos en el carrito
  cartCount: number = 0; // Cantidad total de productos en el carrito
  cartTotal: number = 0; // Total calculado del carrito
  cartEmptyMessage: boolean = false; // Para mostrar mensaje de carrito vacío

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCart(); 
  }

  
   //Carga los productos del carrito desde localStorage
   
  loadCart(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cart = JSON.parse(cartData);
    } else {
      this.cart = [];
    }

    // Verifica si el carrito está vacío
    this.cartEmptyMessage = this.cart.length === 0;

    // Calcular el total
    this.cartTotal = this.cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Actualizar el contador de productos
    this.cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Elimina un producto del carrito
   * @param productId 
   */
  removeFromCart(productId: number): void {
    
    this.cart = this.cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.cart)); 
    this.loadCart(); 
  }

  /**
   * Finaliza la compra
   */
  finalizePurchase(): void {
    if (this.cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const today = new Date().toLocaleDateString();
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');

    this.cart.forEach(item => {
      const purchase = {
        producto: item.name,
        precio: item.price,
        cantidad: item.quantity,
        total: item.price * item.quantity,
        fecha: today,
        trackingNumber: this.generateTrackingNumber(),
      };
      purchases.push(purchase);
    });

    // Guarda las compras en localStorage y limpia el carrito
    localStorage.setItem('purchases', JSON.stringify(purchases));
    localStorage.removeItem('cart');
    this.loadCart();

    alert('¡Compra finalizada con éxito!');
    this.router.navigate(['/user']); 
  }

  /**
   * Genera un número de seguimiento aleatorio
   * @returns
   */
  private generateTrackingNumber(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }


  goToHomePage(): void {
    this.router.navigate(['/index']);
  }

}
