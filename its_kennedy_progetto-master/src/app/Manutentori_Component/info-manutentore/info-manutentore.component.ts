import { Component, OnInit } from '@angular/core';
import {  Manutentore } from './../../models/User';
import { ActivatedRoute } from '@angular/router';
import { DatabaseApiService } from './../../service/database-api.service';
@Component({
  selector: 'app-info-manutentore',
  templateUrl: './info-manutentore.component.html',
  styleUrls: ['./info-manutentore.component.css']
})
export class InfoManutentoreComponent implements OnInit {
 
  idMANUTENTORE:any;
  Manutentore:Manutentore=new Manutentore();
  constructor(private route: ActivatedRoute,private _Db:DatabaseApiService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this.idMANUTENTORE=id;
      
      this._Db.getSede_Manutentore(parseInt(id)).subscribe(s=>{
        this.Manutentore=s;
        
      })
    });
  }

}
