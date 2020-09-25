import { Component, OnInit } from '@angular/core';
import { DatabaseApiService } from '../../service/database-api.service';
import { ActivatedRoute } from '@angular/router';
import { Manutentore, MovimentiManutentore } from '../../models/User';
@Component({
  selector: 'app-info-movimentimanutentore',
  templateUrl: './info-movimentimanutentore.component.html',
  styleUrls: ['./info-movimentimanutentore.component.css']
})
export class InfoMovimentimanutentoreComponent implements OnInit {
  id: any;

  movimento: MovimentiManutentore = new MovimentiManutentore();
 
  constructor(private route: ActivatedRoute, private _Db: DatabaseApiService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this._Db.getMovimentiManutentoreSEDE(parseInt(id)).subscribe(s => {
        this.movimento = s;

      })
      
    });
  }

}
