import { Injectable } from '@angular/core';
import { Usuario } from './usuario.model';
import * as firebase from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
// import  from 'angularfire2/database';


@Injectable()
export class AuthService {

  constructor(
    private db: AngularFireDatabase,
    private fireAuth: AngularFireAuth
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
        console.log(resposta);
      }
    )
    .catch(
      (erro: Error) => {
        console.log(erro);
      }
    );
  }

}
