import { Component, OnInit } from '@angular/core';
import { DatabaseApiService } from './../../service/database-api.service';
import { User, PC, Hw, Movimento } from './../../models/User';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-etichette-component',
  templateUrl: './etichette-component.component.html',
  styleUrls: ['./etichette-component.component.css']
})
export class EtichetteComponentComponent implements OnInit {
  user: User = new User();
  id: any;
  Hw:Hw[]=[];
  listaHw: Hw[]=[];
  listaPC: PC[] = [];
  hw: Hw = new Hw();
  pc: PC=new PC();
  DataFiltre:string;
  constructor(private route: ActivatedRoute, private _DB: DatabaseApiService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this.id = id
    });
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    this.user = payLoad;

    this._DB.getListPC(this.id).subscribe(x => {
      this.listaPC = x;
    })
    this._DB.getHw().subscribe(x=>{
      this.Hw=x
    }) 
  }

}
