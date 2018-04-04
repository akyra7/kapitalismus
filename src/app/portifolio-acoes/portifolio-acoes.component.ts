import { Component, OnInit } from '@angular/core';
import { ConsultaAcaoService } from '../consulta-acao.service';
import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/operator/retry';
import { Carteira, Ativo, Operacao } from '../shared/carteira.model';
import { FbdatabaseService } from '../shared/fbdatabase.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastrService } from 'ngx-toastr';
import * as JQuery from 'jquery';

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
    private toastr: ToastrService,
    private fauth: AngularFireAuth
  ) { }

  listaAcoes = new Array<Ativo>();
  listaAcoesAux = new Array<Ativo>();
  listaAcoesAdicionadas: Array<AcaoAdicionada>;
  valorPesquisa = '';
  acaoSelecionada = new AcaoAdicionada('', '', '');
  carteira: Carteira;
  nomeCarteira = '';
  listaAtivos: Ativo[];
  listaTodasAcoes: Ativo[];
  nomeEditavel = false;
  ativoSelecionadoModal = new Ativo();

  public addAtivoFormulario: FormGroup = new FormGroup({
    'nomeCarteira': new FormControl(null),
  });

  public formOperacaoModal: FormGroup = new FormGroup({
    'data': new FormControl(null),
    'radioCompraVenda': new FormControl(null),
    'qtd': new FormControl(null),
    'preco': new FormControl(null),
    'custo': new FormControl(null),
    'nota': new FormControl(null)

  });

  ngOnInit() {
    this.listaAcoesAdicionadas = new Array<AcaoAdicionada>();
    this.listaAtivos = [];
    this.carteira = new Carteira();
    this.carteira.listaAtivos = new Array<Ativo>();
    this.ativoSelecionadoModal = new Ativo();
    this.listaTodasAcoes = new Array<Ativo>();
    this.firebase.getListaTodasAcoes().subscribe(
      (resposta) => {
        console.log('lista de acoes recuperadas: ', resposta);
        resposta.forEach(element => {
          this.listaTodasAcoes.push(new Ativo(element.id, element.descricao));
        });
      }
    );

    console.log('user ID -__----__-' + this.firebase.getUserId());
    // console.log('user ID -__----__-' + this.fauth.);

    this.addAtivoFormulario.disable();

    if (this.firebase.getUserId() !== undefined) {
      this.recuperarCarteira();
      // this.addAtivoFormulario.value.nomeCarteira = this.carteira.nome;

    }
  }

  public copiaDoAtivo(a: Ativo): Ativo {
    const ativo = Object.assign({}, a);
    if (a.listaOperacao !== null && a.listaOperacao !== undefined) {
      ativo.listaOperacao = a.listaOperacao.slice();
    } else {
      ativo.listaOperacao = new Array<Operacao>();
    }
    return ativo;
  }

  salvarAcao(arg: string): void {
    console.log('arg ', arg);
    const a = this.getAcao(arg);
    console.log('a: ', a);
    if (a !== null && a !== undefined) { // se acao existe na lista de todas as acoes
      this.selecionaAcao(a.cod, a.desc);
    } else if (this.listaAcoes.length > 0) {
      console.log('acoes[0].cod: ', this.listaAcoes[0].cod);
      // this.selecionaAcao(this.listaAcoes[0].cod, this.listaAcoes[0].desc);
      this.valorPesquisa = this.listaAcoes[0].cod.slice(0);
      console.log(this.valorPesquisa);
      // this.listaAcoes = [];
      // this.listaAcoesAux = [];
      return;
    } else {
      this.toastr.info(arg + ' nao encontrado');
      this.valorPesquisa = '';
      this.acaoSelecionada = new AcaoAdicionada('', '', '');
      this.listaAcoes = [];
      this.listaAcoesAux = [];
      return;
    }

    if (this.jaExiste()) { // se ativo ja existe na carteira
      alert('ativo ja existe na carteira');
      return;
    } else {
      this.carteira.listaAtivos.push(new Ativo(this.acaoSelecionada.acao, this.acaoSelecionada.descricao, new Array<Operacao>()));
      this.salvarCarteira();

      this.listaAcoes = [];
      this.listaAcoesAux = [];
      this.valorPesquisa = '';
    }
  }

  capturaCampo(conteudo: string, event: KeyboardEvent): void {

    console.log(event);
    event.preventDefault();
    if (conteudo.length < 2) { this.listaAcoes = []; return; }
    console.log(event.keyCode);
    if (event.keyCode === 13) {      // key 13 = enter
      this.salvarAcao(conteudo);
      return;
    }

    this.recuperaBancoDeAcoesJSON(conteudo, this.listaTodasAcoes);
    this.acaoSelecionada = new AcaoAdicionada('', '', '');
    this.listaAcoesAux = Object.assign({}, this.listaAcoes);
  }


  selecionaAcao(info: string, desc: string) {
    this.acaoSelecionada.acao = info;
    this.acaoSelecionada.descricao = desc;
    this.valorPesquisa = info;
    this.listaAcoesAux = this.listaAcoes;
    this.listaAcoes = [];

    document.getElementById('campo-simbolo').focus();
  }


  jaExiste(): boolean {
    if (this.carteira.listaAtivos == null || this.carteira.listaAtivos === undefined) { return false; }
    for (let i = 0; i < this.carteira.listaAtivos.length; i++) {
      if (this.carteira.listaAtivos[i].cod.toUpperCase() === this.acaoSelecionada.acao.toUpperCase()) { return true; }
    }
    return false;
  }

  getAcao(simbolo: string): Ativo { // fazer validacao serverside se o simbolo existe no BD;

    for (let i = 0; i < this.listaTodasAcoes.length; i++) {
      if (simbolo.toUpperCase() === this.listaTodasAcoes[i].cod.toUpperCase()) { return this.listaTodasAcoes[i]; }
    }
    return null;
  }

  adicionaAcao() {
    // console.log('adicionada acao: ' + this.valorPesquisa);
    // this.consultaAcao.consultaAcao(this.acaoSelecionada).subscribe();
    // se ativo nao existe no banco de acoes cadastradas
    this.salvarAcao(this.valorPesquisa);
    // alert('ativo nao encontrado');

  }

  limparListaAcoesSelecionadas(id: string) {

    for (let i = this.carteira.listaAtivos.length - 1; i >= 0; i--) {
      // console.log(this.carteira.listaAtivos[i].cod + '' + id);
      if (this.carteira.listaAtivos[i].cod === id) {
        this.carteira.listaAtivos.splice(i, 1);
        this.firebase.atualizaCarteira(this.carteira).then(resp => {
          this.recuperarCarteira();
          this.toastr.toastrConfig.positionClass = 'toast-top-center';
          this.toastr.toastrConfig.closeButton = true;
          this.toastr.info('', id + ' removido com sucesso.');
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
        });
        // this.salvarCarteira();
      }
    }
  }

  salvarCarteira() {
    this.carteira.nome = 'nomeDaCarteira';
    this.firebase.atualizaCarteira(this.carteira).then(resp => {
      this.recuperarCarteira();
      this.toastr.toastrConfig.positionClass = 'toast-top-center';
      this.toastr.toastrConfig.closeButton = true;
      this.toastr.success('', 'Carteira inserida com sucesso');
    });
  }
  recuperarCarteira() {
    this.firebase.getCarteira().subscribe(
      (dado: Carteira) => {
        // console.log('DADO recuperado: ----->    ', dado);
        if (dado === null) {
          this.carteira = new Carteira();
        } else {

          this.carteira.nome = dado.nome;
          console.log('this.carteira.nome -- ', this.carteira.nome);
          console.log('dado.nome ', dado.nome);
          this.carteira.listaAtivos = dado.listaAtivos === undefined ? new Array<Ativo>() : dado.listaAtivos;
          this.addAtivoFormulario.setValue({ nomeCarteira: this.carteira.nome });
          // this.carteira.listaAtivos[0].qtdTotal();
          //  this.carteira.listaAtivos.forEach( (ativo) => {
          //       Ativo.qtdTotal(ativo.listaOperacao);
          //       Ativo.precoMedio(ativo.listaOperacao);
          //    });
        }
      },
      erro => {
        console.log('erro: ----->    ' + erro);

      });
  }

  recuperaBancoDeAcoesJSON(search_term: string, listaTodosAtivos: Ativo[]) {

    const search = search_term.toUpperCase();
    this.listaAcoes = JQuery.grep(listaTodosAtivos, function (value) {
      // console.log('value: ', value);
      return value.cod.toUpperCase().indexOf(search) >= 0 || value.desc.toUpperCase().indexOf(search) >= 0;
    });
    // console.log('listaAcoes' , this.listaAcoes);
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
    this.addAtivoFormulario.disabled ? this.addAtivoFormulario.enable() : this.addAtivoFormulario.disable();
    if (!this.nomeEditavel) {
      // document.getElementById('nomeCarteira').blur();
      document.getElementById('nomeCarteira').click();
      console.log('clicado');
    }
  }

  public salvaNome(): void {
    this.firebase.atualizaNomeCarteira(this.addAtivoFormulario.value.nomeCarteira);
  }

  public editarOperacoes(ativo: Ativo): void {
    if (ativo !== null || ativo !== undefined) {
      this.ativoSelecionadoModal = this.copiaDoAtivo(ativo);
      this.formOperacaoModal.reset();
      // console.log(this.ativoSelecionadoModal);
    }
  }
  public salvarOperacao(): void {
    console.log(this.formOperacaoModal);
    if (this.ativoSelecionadoModal.listaOperacao === null || this.ativoSelecionadoModal.listaOperacao === undefined) {
      this.ativoSelecionadoModal.listaOperacao = new Array<Operacao>();
    }
    const i = this.carteira.listaAtivos.findIndex(
      (a: Ativo) => {
        return (a.cod === this.ativoSelecionadoModal.cod);
      }
    );
    if (i !== undefined) {
      if (this.carteira.listaAtivos[i].listaOperacao === null || this.carteira.listaAtivos[i].listaOperacao === undefined) {
        this.carteira.listaAtivos[i].listaOperacao = new Array<Operacao>();
      }
      const op = new Operacao(
        this.ativoSelecionadoModal.cod,
        this.formOperacaoModal.value.radioCompraVenda,
        this.formOperacaoModal.value.data,
        this.formOperacaoModal.value.qtd,
        this.formOperacaoModal.value.preco,
        this.formOperacaoModal.value.custo,
        this.formOperacaoModal.value.nota,
      );


      this.carteira.listaAtivos[i].listaOperacao.push(op);


      console.log(this.carteira.listaAtivos[i]);
      this.firebase.atualizaCarteira(this.carteira).then(
        () => {
          this.ativoSelecionadoModal = this.copiaDoAtivo(this.carteira.listaAtivos[i]);
          console.log('F O I   !!!!');
        });
      this.formOperacaoModal.reset();
    } else {
      return; // nao deveria vir parar aqui nunca
    }

  }

  public excluirOperacao(op_i: number): void {
    const i = this.carteira.listaAtivos.findIndex(
      (a: Ativo) => {
        return (a.cod === this.ativoSelecionadoModal.cod);
      }
    );
    this.carteira.listaAtivos[i].listaOperacao.splice(op_i, 1);
    this.firebase.atualizaCarteira(this.carteira).then(
      (sucesso) => { this.ativoSelecionadoModal = this.copiaDoAtivo(this.carteira.listaAtivos[i]); },
      (erro) => { this.carteira.listaAtivos[i] = this.copiaDoAtivo(this.ativoSelecionadoModal); }
    );
  }

  public calculaTotal(listaOperacao: Operacao[]): number {
    return Ativo.qtdTotal(listaOperacao);
  }
  public calculaPM(ativo: Ativo): number {
    console.log(ativo);
    const listaOperacao = ativo.listaOperacao;
    if (listaOperacao !== null && listaOperacao !== undefined) {
      console.log(listaOperacao);
      let acum = 0;
      let qtde = 0;
      listaOperacao.forEach(op => {
        if (op.compraOuVenda === 'compra') {
          qtde = qtde + op.qtd;
          acum = acum + ((op.qtd * op.preco) + op.custo);
        } else if (op.compraOuVenda === 'venda') {
          qtde = qtde - op.qtd;
          acum = acum - ((op.qtd * op.preco) - op.custo);
        }
      });
      if (qtde === 0) { return 0; }
      const pm = acum / qtde;
      return pm;
    }
    return 0;
  }

}


class AcaoAdicionada {
  constructor(public acao: string, public descricao: string, public cotacao: string) { }
}
