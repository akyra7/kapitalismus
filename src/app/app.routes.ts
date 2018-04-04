import { Routes } from '@angular/router';
import { PortifolioComponent } from './portifolio/portifolio.component';
import { AutenticacaoComponent } from './shared/autenticacao/autenticacao.component';
import { AuthGuard } from './shared/auth-guard.service';

export const ROUTES: Routes = [
  { path: '', component: AutenticacaoComponent },
  { path: 'home', component: PortifolioComponent, canActivate: [ AuthGuard ] },
];
