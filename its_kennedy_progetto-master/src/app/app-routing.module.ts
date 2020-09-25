import { ProfilComponent } from './profil/profil.component';
import { InfoStudenteComponent } from './Students_Componente/info-studente/info-studente.component';
import { ComponentSedeComponent } from './Sede_Component/component-sede/component-sede.component';
import { InfoAdminComponent } from './admin_Component/info-admin/info-admin.component';
import {
  AuthGuard as AuthGuard
} from './service/auth.guard';





import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin_Component/admin/admin.component';
import { SedieComponent } from './Sede_Component/sedie/sedie.component';
import { StudentsComponent } from './Students_Componente/students/students.component';
import { ComputerComponent } from './PC_Componente/computer/computer.component';
import { MovimentoComponent } from './Movimento_Componente/movimento/movimento.component';
import { WitheBlankComponent } from './withe-blank/withe-blank.component';
import { ManutentoriComponent } from './Manutentori_Component/manutentori/manutentori.component';
import { InfoManutentoreComponent } from './Manutentori_Component/info-manutentore/info-manutentore.component';
import { MovimentiManutentoreComponent } from './Movimenti_Manutentore_Component/movimenti-manutentore/movimenti-manutentore.component';
import { InfoMovimentoComponent } from './Movimento_Componente/info-movimento/info-movimento.component';
import { InfoMovimentimanutentoreComponent } from './Movimenti_Manutentore_Component/info-movimentimanutentore/info-movimentimanutentore.component';

import { InfoComputerComponent } from './PC_Componente/info-computer/info-computer.component';
import { EtichetteComponentComponent } from './PC_Componente/etichette-component/etichette-component.component';


const routes: Routes = [
  
  {
    path: '',
    component:  HomeComponent,
    pathMatch: 'full',
  },
  
  {
    path: 'Home',
    component: WitheBlankComponent,
    children:[
      {
        path:'Kennedy',
        component:HomeComponent
      },
      {
        path:'profil',
        canActivate: [AuthGuard],
        component:ProfilComponent
      },
      {
        path:'login',
        component:LoginComponent,
      },
      {
        path: 'sedi',
        canActivate: [AuthGuard],
        component: SedieComponent,
      },
      {
        path: 'sedi/:id',
        canActivate: [AuthGuard],
        component: ComponentSedeComponent,
        data: { permittedRoles: ['Admin', 'Moderator'] },
      },
      {
        path: 'sedi/:id/Studenti',
        canActivate: [AuthGuard],
        component: StudentsComponent,
        data: { permittedRoles: ['Admin', 'Moderator'] },
      },
      {
        path: 'sedi/:id/Studenti/:id',
        canActivate: [AuthGuard],
        component: InfoStudenteComponent,
        data: { permittedRoles: ['Admin', 'Moderator'] },
      },
      {
        path:'sedi/:id/manutentore',
        canActivate:[AuthGuard],
        component:ManutentoriComponent,
        data:{permittedRoles:['Admin','Moderator']},
      },
      {
        path:'sedi/:id/manutentore/:id',
        canActivate:[AuthGuard],
        component:InfoManutentoreComponent,
        data:{permittedRoles:['Admin','Moderator']},
      },
      {
        path:'sedi/:id/movimenti_manutentore',
        canActivate:[AuthGuard],
        component:MovimentiManutentoreComponent,
        data:{permittedRoles:['Admin','Moderator']},
      },
      {
        path:'sedi/:id/movimenti_manutentore/:id',
        canActivate:[AuthGuard],
        component:InfoMovimentimanutentoreComponent,
        data:{permittedRoles:['Admin','Moderator']},
      },
      {
        path: 'sedi/:id/pc',
        canActivate: [AuthGuard],
        component: ComputerComponent,
        data: { permittedRoles: ['Admin', 'Moderator'] },
      },
      
      {
        path: 'sedi/:id/pc/:id',
        canActivate: [AuthGuard],
        component: InfoComputerComponent,
        data: { permittedRoles: ['Admin', 'Moderator'] },
      },
      
      {
        path: 'sedi/:id/movimenti',
        canActivate: [AuthGuard],
        component: MovimentoComponent,
        data: { permittedRoles: ['Admin', 'Moderator'] },
      },
      {
        path:'sedi/:id/movimenti/:id',
        canActivate:[AuthGuard],
        component:InfoMovimentoComponent,
        data:{permittedRoles:['Admin','Moderator']}
      },
      {
        path:'sedi/:id/etichette',
        canActivate:[AuthGuard],
        component:EtichetteComponentComponent,
        data:{permittedRoles:['Admin','Moderator']},
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { permittedRoles: ['Admin'] },
    
      },
      {
        path: 'admin/register',
        canActivate: [AuthGuard],
        component: RegisterComponent,
        data: { permittedRoles: ['Admin'] }
      },
      {
        path: 'admin/:id',
        component: InfoAdminComponent,
        canActivate: [AuthGuard],
        data: { permittedRoles: ['Admin'] }
      }
    ]
  },
  
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard]
})
export class AppRoutingModule { }
