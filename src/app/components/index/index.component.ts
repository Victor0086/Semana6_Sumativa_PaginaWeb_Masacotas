import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule], 
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  
  email: string = 'elpandacomida@gmail.com';
  cartCount: number = 0; // contador

  constructor() {}

  ngOnInit(): void {
    // Asegurarse de que el acceso a localStorage se haga solo en el navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      this.loadCartCount();
    }
  }

  // Cargar el contador de productos desde el carrito en localStorage
  loadCartCount() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const parsedCart = JSON.parse(cart);
      this.cartCount = parsedCart.reduce((acc: number, item: any) => acc + item.quantity, 0); 
    }
  }

  // Función para agregar productos al carrito
  addToCart(product: any) {
   
    if (typeof window !== 'undefined' && window.localStorage) {
      const cart = localStorage.getItem('cart');
      let cartItems = cart ? JSON.parse(cart) : [];

      // Verificar si el producto ya está en el carrito
      const existingProduct = cartItems.find((item: any) => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1; // Si ya está, aumentar la cantidad
      } else {
        cartItems.push({ ...product, quantity: 1 }); // Si no, se agrega al carrito
      }

      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems));

      // Actualizar el contador de productos en el carrito
      this.loadCartCount();
    }
  }
}
