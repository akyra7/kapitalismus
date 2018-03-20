import { Injectable } from '@angular/core';
import { Usuario } from './usuario.model';
import { Router } from '@angular/router';
import * as firebase from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FbdatabaseService } from './fbdatabase.service';
// import  from 'angularfire2/database';


@Injectable()
export class AuthService {

  public token_id: string;

  constructor(
    private db: AngularFireDatabase,
    private fireAuth: AngularFireAuth,
    private router: Router
  ) { }

  public cadastrarUsuario(usuario: Usuario) {
    console.log(' SERVICO ', usuario);
    this.fireAuth.auth.createUserWithEmailAndPassword(usuario.email, usuario.senha).then(
      (resposta: any) => {
        console.log(resposta);
      }
    )
      .catch(
        (erro: Error) => {
          console.log(erro);
        }
      );
  }

  public logarUsuario(usuario: string, senha: string) {
    this.fireAuth.auth.signInWithEmailAndPassword(usuario, senha)
      .then(
        (resposta: any) => {
          this.fireAuth.auth.currentUser.getIdToken()
            .then(
              (idToken: string) => {
                this.token_id = idToken;
                console.log(this.token_id);
                this.router.navigate(['/home']);
                localStorage.setItem('idToken', idToken);
              }
            );
          console.log(resposta);
        }
      )
      .catch(
        (erro: Error) => {
          console.log(erro);
        }
      );
  }

  public estaLogado(): boolean {
    const tokenLocalStorage = localStorage.getItem('idToken');
    if ((this.token_id === undefined) && (tokenLocalStorage !== null)) {
      this.token_id = tokenLocalStorage;
    }
    return this.token_id !== undefined;
  }

  public fazerLogout(): void {
    this.fireAuth.auth.signOut()
    .then( () => {
        localStorage.removeItem('idToken');
        this.token_id = undefined;
        this.router.navigate(['']);
      }
    );
  }

}
