import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Aluno, AlunoData } from '../interfaces/aluno';

import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  http = inject(HttpClient);

  data: AlunoData | null = null;

  constructor(
  ) {
    this.getAlunos().subscribe(()=>{
      console.log(this.data);
    })  
  }

  load() {
    console.log('load');
    if (this.data) {
      return of(this.data);
    } else {
      return this.http
        .get<AlunoData>('assets/data/aluno.json')
        .pipe(map(this.processData, this));
    }
  }

  processData(data: AlunoData): AlunoData {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    console.log('processData');
    this.data = data;
    return this.data;
  }

  getAluno(matricula: string) {
    for(var i = 0; i < this.data.alunos.length; i++) {
      if(this.data.alunos[i].matricula == matricula) {
        return this.data.alunos[i];
      }
    }
  }

  getAlunos() {
    return this.load().pipe(map((data: AlunoData) => data));
  }

}
