import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Usuario } from '../../usuario.model';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';

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

  @Output() public renderizaCadastro: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private authService: AuthService, private toastr: ToastrService) { }

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
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
    this.toastr.toastrConfig.closeButton = true;
    this.toastr.success('', 'Cadastro realizado com sucesso');
    this.renderCadastro();
    // console.log(usuario);
  }

  public renderCadastro(): void {
    this.renderizaCadastro.emit(false);
  }
}
