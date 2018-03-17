import { Injectable } from '@angular/core';
import { Ativo, Carteira } from './carteira.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Observable} from 'rxjs/Observable';

// import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class FbdatabaseService {
  listaAtivos: AngularFireList<any>;
  carteira: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase, private toastr: ToastrService) { }

  getCarteira(): Observable<any> {
   return this.db.object('carteira').valueChanges();

  }

  insereCarteira(wallet: Carteira) {
    console.log('OBjeto a ser persistido' + JSON.stringify(wallet));

    this.db.database.ref('carteira').set({
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


  atualizaCarteira(wallet: Carteira) {
    this.db.database.ref('carteira').update({
      nome: wallet.nome,
      listaAtivos: wallet.listaAtivos
    });
  }
}
