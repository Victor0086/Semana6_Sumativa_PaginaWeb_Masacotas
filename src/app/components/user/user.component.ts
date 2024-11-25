import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  email: string = 'elpandacomida@gmail.com';
  userRegistrationForm!: FormGroup;
  loginForm!: FormGroup;
  isRegisterVisible: boolean = false;
  nombreUsuario: string | null = null;
  purchases: any[] = []; // Lista de compras del usuario

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.nombreUsuario = localStorage.getItem('nombreUsuario');
      this.loadPurchases();
      window.addEventListener('storage', this.syncLogout.bind(this));
    }

    // Inicializar formularios
    this.userRegistrationForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      email: ['', [
        Validators.required, 
        Validators.email,
        this.validarDominioCorreo
      ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      fechaNacimiento: ['', [
        Validators.required, 
        this.validarEdad(13, 100)
      ]],
      direccion: ['']
    });

    this.loginForm = this.fb.group({
      nombreUsuario: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
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

  // Validación del correo electrónico
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
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      console.log(`Edad calculada: ${edad}`); 
      if (edad < minEdad) {
        return { edadMinima: true };
      }
      if (edad > maxEdad) {
        return { edadMaxima: true };
      }
      return null;
    };
  }

  submitForm(): void {
    if (this.userRegistrationForm.invalid) {
      this.userRegistrationForm.markAllAsTouched();
      return;
    }

    const formValues = this.userRegistrationForm.value;
    if (this.isBrowser()) {
      localStorage.setItem('nombreUsuario', formValues.nombreUsuario);
      localStorage.setItem('sesionActiva', 'true');
    }
    this.router.navigate(['/']);
    alert('Registro exitoso');
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginValues = this.loginForm.value;
    if (this.isBrowser()) {
      localStorage.setItem('nombreUsuario', loginValues.nombreUsuario);
      localStorage.setItem('sesionActiva', 'true');
    }
    alert('Login exitoso');
    this.router.navigate(['/']);
  }

  logout(): void {
    this.nombreUsuario = null;
    if (this.isBrowser()) {
      localStorage.removeItem('nombreUsuario');
      localStorage.setItem('sesionActiva', 'false');
      window.dispatchEvent(new Event('storage'));
    }
    alert('Has cerrado sesión');
    this.router.navigate(['/']);
  }

  isUserLoggedIn(): boolean {
    return this.isBrowser() && localStorage.getItem('nombreUsuario') !== null;
  }

  onFieldTouched(fieldName: string): void {
    const control = this.userRegistrationForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }
}
