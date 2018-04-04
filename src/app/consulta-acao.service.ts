import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, retry, map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';

@Injectable()
export class ConsultaAcaoService {

  constructor(private http: HttpClient) { }

  consultaAcaoPorNome(simbolo: string): Observable<any> {
    simbolo = simbolo === null ? '' : simbolo;
    return this.http.get('http://localhost:3000/acoes/?id_like=' + simbolo);
  }

  consultaAcaoPorDesc(desc: string): Observable<any> {
    desc = desc === null ? '' : desc;
    return this.http.get('http://localhost:3000/acoes/?descricao_like=' + desc);
  }


  consultaCotacaoAcao(simbolo: string): Observable<any> {
    simbolo = simbolo === null ? '' : simbolo.toUpperCase();
    // console.log('simbolo -> ' + simbolo);
    // if(simbolo == null) simbolo = '';
    // console.log('simbolo ' + simbolo);
    const URL_API = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + simbolo + "&interval=5min&apikey=E79CJHQO4CIZRHKT"
    return this.http.get(URL_API)
      .delay(15000)
      .map(dado => {
        console.log('chegou novo dado')
        // console.log('dado '+ dado['Meta Data']);
        // console.log('dado '+ dado['Error Message']);
        if (!dado['Meta Data']) {
          // if (dado['Error Message'] !== undefined) {
          console.error('Nao conseguiu o dado ' + dado['Error Message']);
          throw dado['Error Message'];
        }

        return dado;
      }
      ).retry(10);
    // retry(5);
    // catchError(console.log('ALGUM ERRO OCORREU NO SERVICO'))

  }

}