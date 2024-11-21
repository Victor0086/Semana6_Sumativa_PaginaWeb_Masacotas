import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  email: string = 'elpandacomida@gmail.com';
  cart: any[] = [];  
  cartCount: number = 0;

  constructor() { }

  ngOnInit(): void {
    // Verificar si estamos en un entorno de navegador y si localStorage está disponible
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
        this.cartCount = this.cart.length;
      }
    }
  }

  updateCartCount() {
    this.cartCount = this.cart.length;
  }

  addToCart(product: any) {
    this.cart.push(product);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    this.updateCartCount();
  }
}
