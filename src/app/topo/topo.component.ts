import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css']
})
export class TopoComponent implements OnInit {

  constructor( private authService: AuthService ) {}

  ngOnInit() {
  }

  public estaLogado(): boolean {
    return this.authService.estaLogado();
  }

  public fazerLogout(): void {
    return this.authService.fazerLogout();
  }

}
