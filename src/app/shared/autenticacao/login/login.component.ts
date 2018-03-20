import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null),
    'senha': new FormControl(null)
  });

  @Output() public renderizaCadastro: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor( private authService: AuthService, private fauth: AngularFireAuth ) { }



  ngOnInit() {
  }

  public logarUsuario(): void {
    console.log(this.formulario.value.email, this.formulario.value.senha);
    this.authService.logarUsuario(this.formulario.value.email, this.formulario.value.senha);

  }

  public renderCadastro(): void {
    console.log('cheguei aqui');
    this.renderizaCadastro.emit(true);
  }

  public testeUsuarioLogado(): void {
    this.fauth.authState.subscribe(
      dado => {console.log(dado); }
    );
    alert(this.fauth.auth.currentUser.uid);
  }

}
