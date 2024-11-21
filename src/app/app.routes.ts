import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CarroComponent } from './components/carro/carro.component';
import { IndexComponent } from './components/index/index.component';
import { IngresoComponent } from './components/ingreso/ingreso.component';
import { SegPedidoComponent } from './components/seg-pedido/seg-pedido.component';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'carro', component: CarroComponent },
  { path: 'ingreso', component: IngresoComponent },
  { path: 'seg-pedido', component: SegPedidoComponent},
  { path: 'user', component: UserComponent },
];
