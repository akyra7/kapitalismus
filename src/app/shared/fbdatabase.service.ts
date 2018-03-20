import { Injectable } from '@angular/core';
import { Ativo, Carteira } from './carteira.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';

// import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class FbdatabaseService {
  listaAtivos: AngularFireList<any>;
  carteira: AngularFireObject<any>;
  constructor(
    private db: AngularFireDatabase,
    private toastr: ToastrService,
    private fireAuth: AngularFireAuth,

  ) { }

  getCarteira(): Observable<any> {
    if (this.getUserId() !== undefined) {
      console.log('USER ID  getCarteira() -> ', this.getUserId());
      return this.db.object('/users/' + this.getUserId() + '/carteira').valueChanges();
    }
  }

  insereCarteira(wallet: Carteira) {
    // console.log('OBjeto a ser persistido' + JSON.stringify(wallet));
    if (this.getUserId() !== undefined) {
      console.log('USER ID -> ' + this.getUserId());

      this.db.database.ref('/users/' + this.getUserId() + '/carteira').set({
        nome: wallet.nome,
        listaAtivos: wallet.listaAtivos
      }).then(resp => {
        this.toastr.toastrConfig.positionClass = 'toast-top-center';
        this.toastr.toastrConfig.closeButton = true;
        this.toastr.success('', 'Carteira inserida com sucesso');
        // this.toastr.toastrConfig.positionClass = 'toast-top-center';
        // app.config(function(toastrConfig) {
        //   angular.extend(toastrConfig, {
        //     autoDismiss: false,
        //     containerId: 'toast-container',
        //     maxOpened: 0,
        //     newestOnTop: true,
        //     positionClass: 'toast-top-right',
        //     preventDuplicates: false,
        //     preventOpenDuplicates: false,
        //     target: 'body'
        //   });
        // });
        // this.toastr.info('', 'Carteira inserida com sucesso');
        // this.toastr.warning('', 'CUIDADO!!!');
        // this.toastr.error('', 'Erro escroto detectado');

      }
      );
    }

  }


  public atualizaNomeCarteira(novoNome: string): void {
    if (this.getUserId() === undefined) { console.log(this.getUserId()); return; }
    console.log('atualizando nome para ' + novoNome);
    this.db.database.ref('/users/' + this.getUserId() + '/carteira').update({
      nome: novoNome
    }).then(
      (sucesso) => { console.log('tivemos sucesso ', sucesso); }
    )
      .catch(
        erro => { console.log('algum erro', erro); }

      );
  }

  public atualizaCarteira(wallet: Carteira) {
    if (this.getUserId() !== undefined) {
      this.db.database.ref('/users/' + this.getUserId() + '/carteira').update({
        nome: wallet.nome,
        listaAtivos: wallet.listaAtivos
      });
    }
  }

  public getUserId(): string {
    // console.log(localStorage.getItem('idToken'));
    const userKey = Object.keys(window.localStorage).filter(item => item.startsWith('firebase:authUser'))[0];
    const userLocalStorage = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
    if (this.fireAuth.auth.currentUser === null && userLocalStorage !== undefined) {
      return userLocalStorage.uid;
    }
    console.log('AUTH:USER', userLocalStorage);
    if (this.fireAuth.auth.currentUser !== null) {
      const userId = this.fireAuth.auth.currentUser.uid;
      return userId;
    }
  }

}
