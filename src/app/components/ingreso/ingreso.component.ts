import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  imports: [],
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent {
  email: string = 'elpandacomida@gmail.com';

  constructor(private router: Router) {}

  redirectToRegister(): void {
    this.router.navigate(['/user']); // Navega hacia la ruta del registro
  }
}
