import { Component, OnInit } from '@angular/core';

import {DatabaseApiService} from '../../service/database-api.service';
import {ActivatedRoute} from '@angular/router';
import {PC} from '../../models/User';
@Component({
  selector: 'app-info-computer',
  templateUrl: './info-computer.component.html',
  styleUrls: ['./info-computer.component.css']
})
export class InfoComputerComponent implements OnInit {
  idpc:any;
  id:any;
  pc:PC=new PC();
 
  constructor(private route:ActivatedRoute,private _Db:DatabaseApiService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this.idpc = id;
     this._Db.getID_PC(parseInt(id)).subscribe(x=>{
       this.pc=x;
     })
    
    });
  }

}
