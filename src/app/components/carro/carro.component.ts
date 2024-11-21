import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [],
  templateUrl: './carro.component.html',
  styleUrls: ['./carro.component.css']
})
export class CarroComponent implements OnInit {
  email: string = 'elpandacomida@gmail.com';
  cart: any[] = []; // Arreglo para almacenar los productos en el carrito
  cartCount: number = 0;  // Contador de productos en el carrito

  constructor() { }

  ngOnInit(): void {
    // Al iniciar, recuperamos el carrito y el contador desde localStorage
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.updateCartCount();
  }

  // Función para agregar un producto al carrito
  addToCart(productId: string, productName: string, productPrice: number): void {
    // Verificar si el producto ya existe en el carrito
    const existingProduct = this.cart.find(item => item.id === productId);

    // Si el producto ya está en el carrito, se incrementa su cantidad
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      // Si no está en el carrito, lo agregamos
      this.cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }

    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(this.cart));

    // Actualizamos el contador
    this.updateCartCount();
  }

  // Actualizar el contador de productos en el carrito
  updateCartCount(): void {
    // Calculamos el total de productos en el carrito
    this.cartCount = this.cart.reduce((acc, item) => acc + item.quantity, 0);

    // Guardamos el contador actualizado en localStorage
    localStorage.setItem('cartCount', this.cartCount.toString());
  }
}
