import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  User ,Manutentore} from '../../models/User';
import { DatabaseApiService } from '../../service/database-api.service';
@Component({
  selector: 'app-manutentori',
  templateUrl: './manutentori.component.html',
  styleUrls: ['./manutentori.component.css']
})
export class ManutentoriComponent implements OnInit {
  id_Sede: any;
  manutentore:Manutentore=new Manutentore();
  DateUser: User = new User();
  ListManutentori:Manutentore[]=[]

  constructor(private route: ActivatedRoute, private _Db: DatabaseApiService) { }
  GetAll(){
    this._Db.getManutentore(this.id_Sede).subscribe(x => {
      this.ListManutentori = x;
  
    })
  }
  savemanu = () => {
    this.manutentore.nome;
    this.manutentore.cognome; 
    this.manutentore.comune;
    this.manutentore.civico;
    this.manutentore.via;
    this.manutentore.provincia_sigla;
    this.manutentore.ditta;
    this.manutentore.SEDE_idSEDE=this.id_Sede;
    if (confirm('Sei sicuro che vorrei aggiungere nuovo manutentore???')) {
      this._Db.newManutentore( this.manutentore).subscribe(_ => {
        this.ngOnInit();
        alert('GooD')
        this.ClearValue();
      });
    }
    
  }

ClearValue(){
  this.manutentore.nome=null;
  this.manutentore.cognome=null; 
  this.manutentore.comune=null;
  this.manutentore.civico=null;
  this.manutentore.via=null;
  this.manutentore.provincia_sigla=null;
  this.manutentore.ditta=null;
}
  ngOnInit(): void {
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    this.DateUser = payLoad;
     
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this.id_Sede = id;
    })
    this._Db.getManutentore(this.id_Sede).subscribe(x=>{
        this.ListManutentori=x;
    })
    

  }

}
