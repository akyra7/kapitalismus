

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
  constructor(public cod?: string, public desc?: string, public qtd?: number) {
  }
}
