import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  email: string = 'elpandacomida@gmail.com';
  userRegistrationForm!: FormGroup;
  loginForm!: FormGroup;
  isRegisterVisible: boolean = false;
  nombreUsuario: string | null = null;
  purchases: any[] = [];
  alertMessage: string | null = null;
  alertType: string = '';
  userSaved = false;
  cartCount: number = 0;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.nombreUsuario = localStorage.getItem('nombreUsuario');
      this.loadPurchases();
      this.loadCartCount();
      window.addEventListener('storage', this.syncLogout.bind(this));
    }

    // Inicializar formularios
    this.userRegistrationForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.validarDominioCorreo]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      fechaNacimiento: ['', [Validators.required, this.validarEdad(13, 100)]],
      direccion: ['']
    });

    this.loginForm = this.fb.group({
      nombreUsuario: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser()) {
      window.removeEventListener('storage', this.syncLogout.bind(this));
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private syncLogout(event: StorageEvent): void {
    if (event.key === 'sesionActiva' && event.newValue === 'false') {
      this.nombreUsuario = null;
      this.router.navigate(['/']);
    }
  }

  private loadPurchases(): void {
    if (this.isBrowser()) {
      const storedPurchases = localStorage.getItem('purchases');
      if (storedPurchases) {
        this.purchases = JSON.parse(storedPurchases);
      }
    }
  }

  private loadCartCount(): void {
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

  validarDominioCorreo(control: any) {
    const email = control.value;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return { dominioInvalido: true };
    }
    return null;
  }

  validarEdad(minEdad: number, maxEdad: number) {
    return (control: any) => {
      const fechaNacimiento = new Date(control.value);
      if (isNaN(fechaNacimiento.getTime())) {
        return { fechaInvalida: true };
      }
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      if (edad < minEdad) {
        return { edadMinima: true };
      }
      if (edad > maxEdad) {
        return { edadMaxima: true };
      }
      return null;
    };
  }

  // Nuevo método para manejar el evento blur
  onFieldTouched(fieldName: string): void {
    const control = this.userRegistrationForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }

  submitForm(): void {
    if (this.userRegistrationForm.invalid) {
      this.userRegistrationForm.markAllAsTouched();
      return;
    }

    const formValues = this.userRegistrationForm.value;
    localStorage.setItem('userData', JSON.stringify(formValues));
    localStorage.setItem('nombreUsuario', formValues.nombreUsuario);
    alert('Registro exitoso');
    this.router.navigate(['/']);
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginValues = this.loginForm.value;
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const storedUser = JSON.parse(storedUserData);
      if (
        storedUser.nombreUsuario === loginValues.nombreUsuario &&
        storedUser.password === loginValues.password
      ) {
        localStorage.setItem('nombreUsuario', loginValues.nombreUsuario);
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/']);
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    }
  }

  logout(): void {
    this.nombreUsuario = null;
    if (this.isBrowser()) {
      localStorage.removeItem('nombreUsuario');
      localStorage.setItem('sesionActiva', 'false');
      window.dispatchEvent(new Event('storage'));
    }
    this.router.navigate(['/']);
  }

  isUserLoggedIn(): boolean {
    return this.isBrowser() && localStorage.getItem('nombreUsuario') !== null;
  }

  private showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
    }, 5000);
  }
}
