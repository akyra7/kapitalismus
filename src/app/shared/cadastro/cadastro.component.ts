import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Usuario } from '../usuario.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  public formulario: FormGroup = new FormGroup({
    'nomeCompleto': new FormControl(null),
    'email': new FormControl(null),
    'senha': new FormControl(null)
  });

  constructor( private authService: AuthService ) { }



  ngOnInit() {
  }

  public cadastrarUsuario(): void {
    console.log(this.formulario);

    const usuario: Usuario = new Usuario(
      this.formulario.value.nomeCompleto,
      this.formulario.value.email,
      this.formulario.value.senha
    );
    this.authService.cadastrarUsuario(usuario);
    // console.log(usuario);
  }

}
