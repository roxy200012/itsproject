import { Component, OnInit } from '@angular/core';
import {Movimento} from '../../models/User';
import {DatabaseApiService} from '../../service/database-api.service';
import {ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-info-movimento',
  templateUrl: './info-movimento.component.html',
  styleUrls: ['./info-movimento.component.css']
})
export class InfoMovimentoComponent implements OnInit {
  id:any;
  
  movimento:Movimento=new Movimento();
  constructor(private route:ActivatedRoute,private _Db:DatabaseApiService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');

      
      this._Db.getSedeMovimenti(parseInt(id)).subscribe(s=>{
        this.movimento=s
        
      })
    });
  }

}
