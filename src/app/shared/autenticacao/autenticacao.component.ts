import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-autenticacao',
  templateUrl: './autenticacao.component.html',
  styleUrls: ['./autenticacao.component.css']
})
export class AutenticacaoComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  renderizaCadastro: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public rCadastro(b: boolean) {
    console.log(b);
    this.renderizaCadastro = b;
  }
}
