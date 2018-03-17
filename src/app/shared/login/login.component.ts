import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

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

  constructor( private authService: AuthService ) { }



  ngOnInit() {
  }

  public logarUsuario(): void {
    console.log(this.formulario.value.email, this.formulario.value.senha);
    this.authService.logarUsuario(this.formulario.value.email, this.formulario.value.senha);

  }

}
