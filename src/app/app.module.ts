import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { TopoComponent } from './topo/topo.component';
import { PortifolioAcoesComponent } from './portifolio-acoes/portifolio-acoes.component';
import { ToastrModule, Toast } from 'ngx-toastr';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './shared/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CadastroComponent } from './shared/cadastro/cadastro.component';
import { AuthService } from './shared/auth.service';



@NgModule({
  declarations: [
    AppComponent,
    TopoComponent,
    PortifolioAcoesComponent,
    LoginComponent,
    CadastroComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NoopAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [ AuthService, AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
