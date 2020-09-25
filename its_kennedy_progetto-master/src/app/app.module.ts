
import { TokenInterceptorService } from './service/token-interceptor.service';
import { AuthService } from './service/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './service/auth.guard';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {QRCodeModule} from 'angular2-qrcode';
import { JwtModule } from '@auth0/angular-jwt';
import { InfoAdminComponent } from './admin_Component/info-admin/info-admin.component';
import { AdminComponent } from './admin_Component/admin/admin.component';
import { SedieComponent } from './Sede_Component/sedie/sedie.component';
import { ComponentSedeComponent } from './Sede_Component/component-sede/component-sede.component';
import { StudentsComponent } from './Students_Componente/students/students.component';
import { InfoStudenteComponent } from './Students_Componente/info-studente/info-studente.component';
import { ComputerComponent } from './PC_Componente/computer/computer.component';
import { InfoComputerComponent } from './PC_Componente/info-computer/info-computer.component';
import { MovimentoComponent } from './Movimento_Componente/movimento/movimento.component';
import { WitheBlankComponent } from './withe-blank/withe-blank.component';
import { ProfilComponent } from './profil/profil.component';
import { ManutentoriComponent } from './Manutentori_Component/manutentori/manutentori.component';
import { InfoManutentoreComponent } from './Manutentori_Component/info-manutentore/info-manutentore.component';
import { MovimentiManutentoreComponent } from './Movimenti_Manutentore_Component/movimenti-manutentore/movimenti-manutentore.component';
import { InfoMovimentoComponent } from './Movimento_Componente/info-movimento/info-movimento.component';
import { InfoMovimentimanutentoreComponent } from './Movimenti_Manutentore_Component/info-movimentimanutentore/info-movimentimanutentore.component';
import { EtichetteComponentComponent } from './PC_Componente/etichette-component/etichette-component.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    SedieComponent,
    AdminComponent,
    InfoAdminComponent,
    ComponentSedeComponent,
    StudentsComponent,
    InfoStudenteComponent,
    ComputerComponent,
    InfoComputerComponent,
    MovimentoComponent,
    WitheBlankComponent,
    ProfilComponent,
    ManutentoriComponent,
    InfoManutentoreComponent,
    MovimentiManutentoreComponent,
    InfoMovimentoComponent,
    InfoMovimentimanutentoreComponent,
    EtichetteComponentComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    Ng2SearchPipeModule,
    HttpClientModule,
    QRCodeModule,
    JwtModule.forRoot({   config: {
      tokenGetter: function  tokenGetter() { 
      return localStorage.getItem('token');
     }} })
    ],
  providers: [AuthService, AuthGuard,{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
