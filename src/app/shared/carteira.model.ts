

export class Carteira {
  $key: string;
  nome: string;
  listaAtivos: Ativo[];
}

export class Ativo {
  $key: string;
  constructor(public cod?: string, public desc?: string, public qtd?: number) {}
}
