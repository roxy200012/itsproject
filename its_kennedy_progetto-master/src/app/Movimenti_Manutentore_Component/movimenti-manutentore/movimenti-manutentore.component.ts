import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Manutentore, MovimentiManutentore, User, PC } from 'src/app/models/User';
import { DatabaseApiService } from 'src/app/service/database-api.service';

@Component({
  selector: 'app-movimenti-manutentore',
  templateUrl: './movimenti-manutentore.component.html',
  styleUrls: ['./movimenti-manutentore.component.css']
})
export class MovimentiManutentoreComponent implements OnInit {
  id: any;
  id_pc: any;
  id_Admin: any;


  upPC: PC = new PC();
  ListaPc: PC[] = [];
  Lista_Admin: User[] = [];
  Lista_Manutentori: Manutentore[] = [];
  newMovimenti: MovimentiManutentore = new MovimentiManutentore();
  Lista_Movimenti: MovimentiManutentore[] = [];
  constructor(private route: ActivatedRoute, private _Db: DatabaseApiService) { }
  PCup() {
    this.upPC.idpc;
    this.upPC.STATO_idSTATO;
    this._Db.updatePC(this.id_pc, this.upPC).subscribe(x => { })
  }
  Save() {
    this.newMovimenti.PC_idpc;
    this.newMovimenti.ADMIN_idADMIN = this.id_Admin;
    this.newMovimenti.STATO_idSTATO;
    this.newMovimenti.MANUTENTORE_idMANUTENTORE;
    this.newMovimenti.data_consegna;
    this.newMovimenti.note;
    this.newMovimenti.note_movimento;
    this.newMovimenti.N_Fattura_Riparazione;
    if (confirm('Sei sicuro che vorrei aggiungere nuovo Movimento???')) {
      this._Db.newMovimentiManutentore(this.newMovimenti).subscribe(_ => {
        this.ngOnInit();
        alert('GooD')
        this.PCup()
      });
    }


  }
  getALL() {
    this._Db.getMovimentiManutentore(parseInt(this.id)).subscribe(y => {
      this.Lista_Movimenti = y;
    })
  }
  getConsegne() {
    this._Db.getMovimentiManuConsegne(parseInt(this.id)).subscribe(y => {
      this.Lista_Movimenti = y;
    })
  }
  getritiri() {
    this._Db.getMovimentiManuRitiri(parseInt(this.id)).subscribe(y => {
      this.Lista_Movimenti = y;
    })
  }
  getko() {
    this._Db.getMovimentiManuKO(parseInt(this.id)).subscribe(y => {
      this.Lista_Movimenti = y;
    })
  }
  GetPC_status(id_query) {
    this._Db.getPc_IdStatus(this.id, id_query).subscribe(x => {
      this.ListaPc = x
    })
  }
  ngOnInit(): void {
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    this.id_Admin = payLoad.idADMIN
    console.log(this.id_Admin)


    this.route.paramMap.subscribe(param => {
      const id = param.get('id');
      this.id = id
      console.log(this.id)
      this._Db.getManutentore(id).subscribe(x => {
        this.Lista_Manutentori = x;
      })

      this._Db.getMovimentiManutentore(this.id).subscribe(y => {
        this.Lista_Movimenti = y;
      })
      this._Db.getAdmin().subscribe(z => {
        this.Lista_Admin = z;
      })

    });
  }
}

