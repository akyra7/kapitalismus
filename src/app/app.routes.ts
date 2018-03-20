import { Routes } from '@angular/router';
import { PortifolioAcoesComponent } from './portifolio-acoes/portifolio-acoes.component';
import { AutenticacaoComponent } from './shared/autenticacao/autenticacao.component';
import { AuthGuard } from './shared/auth-guard.service';

export const ROUTES: Routes = [
  { path: '', component: AutenticacaoComponent },
  { path: 'home', component: PortifolioAcoesComponent, canActivate: [ AuthGuard ] },
];
