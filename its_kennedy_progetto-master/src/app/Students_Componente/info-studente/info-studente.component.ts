import { Component, OnInit } from '@angular/core';
import { Students, User } from 'src/app/models/User';
import { ActivatedRoute } from '@angular/router';
import { DatabaseApiService } from './../../service/database-api.service';
@Component({
  selector: 'app-info-studente',
  templateUrl: './info-studente.component.html',
  styleUrls: ['./info-studente.component.css']
})
export class InfoStudenteComponent implements OnInit {
  idUTENTE: any;
  Datafilter:string;
  studente:Students=new Students;
  DateUser: User = new User();
  constructor(private route: ActivatedRoute, private _Db: DatabaseApiService) { }
  Change(){
    this.studente.frequentazione;
    this._Db.modifyStudente(this.idUTENTE,this.studente).subscribe(b=>{
       
     });
    
 
   }
  ngOnInit(): void {
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    this.DateUser = payLoad;

    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this.idUTENTE = id;
       
      this._Db.getID_Studente(parseInt(id)).subscribe(a=>{
        this.studente=a;

      })
    });
  }

}
