import { environment } from './../../environments/environment.prod';
import { Sede_Admin, User, Sede, Sede_Accese, Students, Corso, Stato, Hw, PC, Movimento, Manutentore, MovimentiManutentore } from './../models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseApiService {
  
  constructor(private http:HttpClient) { }
  getSede(){
    return this.http.get<Sede[]>(`${environment._api}sede`)
  }
  getSedeID(id){
    return this.http.get<Sede>(`${environment._api}sede/`+id)
  }
  postSede( newsede){
    return this.http.post<Sede>(`${environment._api}sede`,newsede)
  }
  getSede_Admin(){
    return this.http.get<Sede_Admin[]>(`${environment._api}sede/admin`);
  };
  getSede_AdminID(id){
    return this.http.get<Sede_Accese[]>(`${environment._api}sede/admin/`+id);
  }
  getSedeID_AdminAll(id){
    return this.http.get<Sede_Accese[]>(`${environment._api}sede/admin/all/`+id);
  }
  postSede_Admin(user){
    return this.http.post<Sede_Admin>(`${environment._api}sede/admin`,user)
  }
  getAdmin(){
    return this.http.get<User[]>(`${environment._api}admin`)
  }
  getAdminId(id){
    return this.http.get<User>( `${environment._api}admin/`+id)
  }
  // ------------------------------------------------------------------------------------------
  getSede_StudentsId(id){
    return this.http.get<Students[]>( `${environment._api}sede/`+id+`/students`)
  }
  getStudents_All(id){
    return this.http.get<Students[]>( `${environment._api}sede/`+id+`/students/all`)
  }
  getID_Studente(idUTENTE){
    return this.http.get<Students>(`${environment._api}sede/students/`+idUTENTE)
  }
  newStudente(studente){
    return this.http.post<Students>(`${environment._api}students`,studente)
  }
  modifyStudente(idUTENTE,data){
    return this.http.put<Students>(`${environment._api}sede/students/`+idUTENTE,data)
  }
  
  // ----------------------------------------------------------------------------------------------
  
  getCorsi(id){
    return this.http.get<Corso[]>(`${environment._api}corso/`+id)
  }
  
  postNewCorso(CorsoNew){
    return this.http.post<Corso>(`${environment._api}corso`,CorsoNew)
  }
  // -------------------------------------------------------------------------------------------------------------------
  getStatoRitiro(){
    return this.http.get<Stato>(`${environment._api}stato/ritiro`)
  }
  getStatoConsegna(){
    return this.http.get<Stato>(`${environment._api}stato/consegna`)
  }
  getStatoGuasto(){
    return this.http.get<Stato>(`${environment._api}stato/guasto`)
  }
  getStatoRiparazione(){
    return this.http.get<Stato>(`${environment._api}stato/riparazione`)
  }
  getStatoKO(){
    return this.http.get<Stato>(`${environment._api}stato/KO`)
  }
  // ----------------------------------------------------------------------------------------------------
  getHw(){
    return this.http.get<Hw[]>(`${environment._api}sede/hw`)
  }
  postHw(hw){
    return this.http.post<Hw>(`${environment._api}sede/hw`,hw)
  }
  // -----------------------------------------------------------------------------------------------
  getListPC(id){
    return this.http.get<PC[]>(`${environment._api}sede/`+id+`/pc`)
  }
  getID_PC(idpc){
    return this.http.get<PC>(`${environment._api}sede/pc/`+idpc)
  }
  getPc_IdStatus(id,idstato){
    return this.http.get<PC[]>(`${environment._api}sede/`+id+`/pc_stato/`+idstato)
  }
  getPC_Stato(idsede){
    return this.http.get<PC[]>(`${environment._api}sede/`+idsede+`/pc_stato/disponibili`)
  }
  getPC_Consegnati(idsede){
    return this.http.get<PC[]>(`${environment._api}sede/`+idsede+`/pc_stato/consegna`)
  }
  getPC_ritirati(idsede){
    return this.http.get<PC[]>(`${environment._api}sede/`+idsede+`/pc_stato/ritiro`)
  }
  getPC_guasti(idsede){
    return this.http.get<PC[]>(`${environment._api}sede/`+idsede+`/pc_stato/guasto`)
  }
  getPC_riparazione(idsede){
    return this.http.get<PC[]>(`${environment._api}sede/`+idsede+`/pc_stato/riparazione`)
  }
  getPC_nuovi(idsede){
    return this.http.get<PC[]>(`${environment._api}sede/`+idsede+`/pc_stato/nuovo`)
  }
  getPC_ko(idsede){
    return this.http.get<PC[]>(`${environment._api}sede/`+idsede+`/pc_stato/ko`)
  }
  postPC(newpc){
    return this.http.post<PC>(`${environment._api}sede/pc`,newpc)
  }
  updatePC(id,newstato){
    return this.http.put<PC>(`${environment._api}sede/pc/updata/`+id,newstato)
  }
 
  //-----FiltrePC---------------------------------------------------------------------------------------
  FiltreSeriale(id,seriale){
    return this.http.get<PC[]>(`${environment._api}sede/`+id+`/pc/filtre/seriale/`+seriale)
  }
  FiltreCpu(id,cpu){
    return this.http.get<PC[]>(`${environment._api}sede/`+id+`/pc/filtre/cpu/`+cpu)
  }
  // -------------------Movimenti-------------------------------------------------------------------------------------------------------------
  getMovimenti(id){
    return this.http.get<Movimento[]>(`${environment._api}sede/`+`movimento/`+id)
  }
  getMovimenticonsegna(id){
    return this.http.get<Movimento[]>(`${environment._api}sede/`+id+`/movimento/consegne`)
  }
  getMovimentiritiro(id){
    return this.http.get<Movimento[]>(`${environment._api}sede/`+id+`/movimento/ritiri`)
  }
  getMovimentiguasto(id){
    return this.http.get<Movimento[]>(`${environment._api}sede/`+id+`/movimento/guasti`)
  }
  getSedeMovimenti(idMOVIMENTO){
    return this.http.get<Movimento>(`${environment._api}sede/`+`movimenti/`+idMOVIMENTO)
  }
  postMovimenti(newMovimento){
    return this.http.post<Movimento>(`${environment._api}sede/new_movimenti`,newMovimento)
  }
  //------Manutentore
  getManutentore(id){
    return this.http.get<Manutentore[]>(`${environment._api}sede/`+ id+`/manutentore`)
  }
  getSede_Manutentore(idMANUTENTORE){
    return this.http.get<Manutentore>(`${environment._api}sede/manutentore/`+idMANUTENTORE)
  }
  newManutentore ( manutentore){
    return this.http.post<Manutentore>(`${environment._api}manutentore`,manutentore)
  }
  getMovimentiManutentore(id){
    return this.http.get<MovimentiManutentore[]>(`${environment._api}sede/`+id+`/movimentimanu`)
  }
  getMovimentiManuConsegne(id){
    return this.http.get<MovimentiManutentore[]>(`${environment._api}sede/`+id+`/movimentimanu/consegne`)
  }
  getMovimentiManuRitiri(id){
    return this.http.get<MovimentiManutentore[]>(`${environment._api}sede/`+id+`/movimentimanu/ritiri`)
  }
  getMovimentiManuKO(id){
    return this.http.get<MovimentiManutentore[]>(`${environment._api}sede/`+id+`/movimentimanu/ko`)
  }
  getMovimentiManutentoreSEDE(idMOVIMENTO_MANUTENTORE){
    return this.http.get<MovimentiManutentore>(`${environment._api}sede/movimentimanu/`+idMOVIMENTO_MANUTENTORE)
  }
  newMovimentiManutentore(movimenti){
    return this.http.post<MovimentiManutentore>(`${environment._api}sede/movimentimanu`,movimenti)
  }
}
