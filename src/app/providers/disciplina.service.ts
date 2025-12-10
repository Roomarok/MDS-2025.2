import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DisciplinaData } from '../interfaces/disciplina';


@Injectable({
  providedIn: 'root',
})
export class DisciplinaService {
  http = inject(HttpClient);

  data: DisciplinaData | null = null;

  constructor(
  ) {
    this.getDisciplinas().subscribe(()=>{
      console.log(this.data);
    })  
  }

  load() {
    console.log('load');
    if (this.data) {
      return of(this.data);
    } else {
      return this.http
        .get<DisciplinaData>('assets/data/disciplina.json')
        .pipe(map(this.processData, this));
    }
  }

  processData(data: DisciplinaData): DisciplinaData {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    console.log('processData');
    this.data = data;
    return this.data;
  }

  getDisciplinas() {
    return this.load().pipe(map((data: DisciplinaData) => data));
  }

  query(params?: any) {
    if (!params) {
      return this.data.disciplinas;
    }

    return this.data.disciplinas.filter((disciplina) => {
      for (let key in params) {
        let field = disciplina[key].toString();
        if (typeof field == 'string' && this.removeAcento(field).indexOf(this.removeAcento(params[key])) >= 0) {
          return disciplina;
        } else if (field == params[key]) {
          return disciplina;
        }
      }
      return null;
    });
  }

  removeAcento(text) {
    text = text.toLowerCase();
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    return text;
  }


}
