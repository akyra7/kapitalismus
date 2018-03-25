

export class Carteira {
  $key: string;
  constructor(public nome?: string, public listaAtivos?: Ativo[]) {
    if (nome === undefined) {
      this.nome = 'sem nome';
    }
    if (listaAtivos === undefined) {
      this.listaAtivos = new Array<Ativo>();
    }
  }
}

export class Ativo {
  $key: string;
  // public qtdeTotal = 0;
  // public pMedio = 0;
  public static qtdTotal(listaOperacao: Operacao[]): number {
    if (listaOperacao !== null && listaOperacao !== undefined) {
      let qtde = 0;
      listaOperacao.forEach(op => {
        if (op.compraOuVenda === 'compra') {
          qtde = qtde + op.qtd;
        } else if (op.compraOuVenda === 'venda') {
          qtde = qtde - op.qtd;
        }
      });
      // this.qtdeTotal = qtde;
      return qtde;
    }
    return 0;
  }
  public static precoMedio(listaOperacao: Operacao[]): number {
    if (listaOperacao !== null && listaOperacao !== undefined) {
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
      if (qtde === 0) {return 0; }
      const pm = acum / qtde;
      return pm;
    }
    return 0;
  }
  // public precoMedio(): number {
  //   if (this.listaOperacao !== null && this.listaOperacao !== undefined) {
  //     let acum = 0;
  //     let qtde = 0;
  //     this.listaOperacao.forEach(op => {
  //       if (op.compraOuVenda === 'compra') {
  //         qtde = qtde + op.qtd;
  //         acum = acum + ((op.qtd * op.preco) + op.custo);
  //       } else if (op.compraOuVenda === 'venda') {
  //         qtde = qtde - op.qtd;
  //         acum = acum - ((op.qtd * op.preco) - op.custo);
  //       }
  //     });
  //     const pm = acum / qtde;
  //     return pm;
  //   }
  // }
  // public qtdTotal(): number {
  //   if (this.listaOperacao !== null && this.listaOperacao !== undefined) {
  //     let qtde = 0;
  //     this.listaOperacao.forEach(op => {
  //       qtde = qtde + op.qtd;
  //     });
  //     this.qtdeTotal = qtde;
  //     return qtde;
  //   }
  //   return 0;
  // }

  constructor(
    public cod?: string,
    public desc?: string,
    public listaOperacao?: Operacao[]
  ) { }





}

export class Operacao {
  $key: string;
  constructor(
    public cod: string,
    public compraOuVenda: string,
    public data: Date,
    public qtd: number,
    public preco: number,
    public custo: number,
    public nota?: string
  ) { }
}
