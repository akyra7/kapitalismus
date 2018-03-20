import { Component, OnInit } from '@angular/core';
import { ConsultaAcaoService } from '../consulta-acao.service';
import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/operator/retry';
import { Carteira, Ativo } from '../shared/carteira.model';
import { FbdatabaseService } from '../shared/fbdatabase.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-portifolio-acoes',
  templateUrl: './portifolio-acoes.component.html',
  styleUrls: ['./portifolio-acoes.component.css'],
  providers: [ConsultaAcaoService, FbdatabaseService]
})
export class PortifolioAcoesComponent implements OnInit {

  constructor(
    private consultaAcao: ConsultaAcaoService,
    private firebase: FbdatabaseService,
    private fauth: AngularFireAuth
  ) { }

  listaAcoes = [];
  listaAcoesAux = [];
  listaAcoesAdicionadas: Array<AcaoAdicionada>;
  valorPesquisa = '';
  acaoSelecionada = new AcaoAdicionada('', '', '');
  carteira: Carteira;
  nomeCarteira = '';
  listaAtivos: Ativo[];
  nomeEditavel = false;

  public formulario: FormGroup = new FormGroup({
    'nomeCarteira': new FormControl(null),
  });

  ngOnInit() {
    this.listaAcoesAdicionadas = new Array<AcaoAdicionada>();
    this.listaAtivos = [];
    this.carteira = new Carteira();
    this.carteira.listaAtivos = new Array<Ativo>();

    console.log('user ID -__----__-' + this.firebase.getUserId());
    // console.log('user ID -__----__-' + this.fauth.);

    this.formulario.disable();

    if (this.firebase.getUserId() !== undefined) {
      this.recuperarCarteira();
      // this.formulario.value.nomeCarteira = this.carteira.nome;
      this.formulario.setValue({ nomeCarteira: this.carteira.nome });
      console.log('this.carteira.nome ', this.carteira.nome);
      console.log('this.formulario.value.nomeCarteira ', this.formulario.value.nomeCarteira);
    }
  }

  capturaCampo(conteudo: string, event: KeyboardEvent): void {

    console.log(event.keyCode);
    if (event.keyCode === 13) {
      if (!this.simboloEncontrado()) {
        if (this.listaAcoes.length > 0) {
          this.selecionaAcao(this.listaAcoes[0].id, this.listaAcoes[0].descricao);
          this.listaAcoes = [];
          return;
        } else {
          this.valorPesquisa = null;
          this.acaoSelecionada = new AcaoAdicionada('', '', '');
          this.listaAcoes = [];
          this.listaAcoesAux = [];
          return;
        }
      }
      // Trigger the button element with a click
      document.getElementById('botao-adicionar').click();
      return;
    }


    if (conteudo.length < 2) { this.listaAcoes = []; return; }

    this.recuperaBancoDeAcoes(conteudo);

    // console.log('AQUI-> ' + this.listaAcoes);
    Object.keys(this.listaAcoes).forEach(key => {
      // console.log(this.listaAcoes[key].id + '  -  ' + this.listaAcoes[key].descricao)

    });
    this.acaoSelecionada = new AcaoAdicionada('', '', '');
    this.listaAcoesAux = this.listaAcoes;
  }


  selecionaAcao(info: string, desc: string) {
    this.acaoSelecionada.acao = info;
    this.acaoSelecionada.descricao = desc;
    this.valorPesquisa = info;
    this.listaAcoesAux = this.listaAcoes;
    this.listaAcoes = [];

    document.getElementById('campo-simbolo').focus();
  }

  simboloEncontrado() {
    for (let i = 0; i < this.listaAcoesAux.length; i++) {
      if (this.listaAcoesAux[i].id === this.acaoSelecionada.acao) { return true; }
    }
    return false;
  }

  adicionaAcao() {
    // console.log('adicionada acao: ' + this.valorPesquisa);
    // this.consultaAcao.consultaAcao(this.acaoSelecionada).subscribe();
    if (!this.simboloEncontrado()) {
      // this.listaAcoes = [];
      // this.listaAcoesAux = [];
      // this.valorPesquisa = '';
      return;
    }
    this.carteira.listaAtivos.push(new Ativo(this.acaoSelecionada.acao, this.acaoSelecionada.descricao, 0));
    console.log(' PASSEI AQUI' + this.listaAtivos);
    this.listaAcoes = [];
    this.listaAcoesAux = [];
    this.valorPesquisa = '';

    // this.recuperaCotacaoAPI(this.acaoSelecionada.acao);

  }

  limparListaAcoesSelecionadas(id: string) {

    for (let i = this.carteira.listaAtivos.length - 1; i >= 0; i--) {
      console.log(this.carteira.listaAtivos[i].cod + '' + id);
      if (this.carteira.listaAtivos[i].cod === id) {
        this.carteira.listaAtivos.splice(i, 1);
      }
    }
  }

  salvarCarteira() {
    this.carteira.nome = 'nomeDaCarteira';
    this.firebase.insereCarteira(this.carteira);
  }
  recuperarCarteira() {
    this.firebase.getCarteira().subscribe(
      (dado: Carteira) => {
        console.log('DADO recuperado: ----->    ', dado);
        if (dado === null) {
          this.carteira = new Carteira();
        } else {

          this.carteira.nome = dado.nome;
          console.log('this.carteira.nome -- ', this.carteira.nome);
          console.log('dado.nome ', dado.nome);
          this.carteira.listaAtivos = dado.listaAtivos === undefined ? new Array<Ativo>() : dado.listaAtivos;
        }
      },
      erro => {
        console.log('erro: ----->    ' + erro);

      });
    console.log('Carteira ->' + this.carteira);
    this.carteira.listaAtivos.forEach(ativo => {
      const aa = new AcaoAdicionada(ativo.cod, ativo.desc, '0');
      this.listaAcoesAdicionadas.push(aa);
    });
  }

  recuperaBancoDeAcoes(conteudo: string) {
    this.consultaAcao.consultaAcaoPorNome(conteudo).subscribe(
      resposta => {
        // console.log(resposta)
        // this.listaAcoes = []
        const listaAux = [];
        for (const acao of resposta) {
          listaAux.push(acao);
        }
        this.consultaAcao.consultaAcaoPorDesc(conteudo).subscribe(
          r2 => {
            for (const a2 of r2) {
              let duplicado = false;
              listaAux.forEach(element => {
                if (element.id === a2.id) {
                  duplicado = true;
                }
              });
              if (!duplicado) {
                listaAux.push(a2);
              }
            }
          }
        );
        this.listaAcoes = listaAux;
        // this.listaAcoesAux = this.listaAcoes;
      },
      erro => console.error('Ocorreu um erro ao consultar acao: ' + erro),
      () => console.log('consulta acao completada com sucesso')
    );
  }

  recuperaCotacaoAPI(cod: string) {
    this.consultaAcao.consultaCotacaoAcao(cod)
      .subscribe(
        resposta => {
          console.log(resposta);
          const dataUltCotacao = resposta['Meta Data']['3. Last Refreshed'];
          const ultimaCotacao = resposta['Time Series (5min)'][dataUltCotacao]['4. close'];
          // novaAcao.cotacao = ultimaCotacao;
          console.log('Data ultima cotacao ' + dataUltCotacao);
          console.log('Ultima cotacao ------->' + ultimaCotacao);
        },
        erro => catchError(erro),
        () => console.log('Lista de acoes adicionadas: ' + this.listaAcoesAdicionadas)
      );
  }

  public editaNome(): void {
    this.formulario.disabled ? this.formulario.enable() : this.formulario.disable();
    if (!this.nomeEditavel) {
      // document.getElementById('nomeCarteira').blur();
      document.getElementById('nomeCarteira').click();
      console.log('clicado');
    }
  }

  public salvaNome(): void {
    this.firebase.atualizaNomeCarteira(this.formulario.value.nomeCarteira);
  }

}


class AcaoAdicionada {
  constructor(public acao: string, public descricao: string, public cotacao: string) { }
}
