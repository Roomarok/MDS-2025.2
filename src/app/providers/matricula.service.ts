import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Matricula, MatriculaData } from '../interfaces/matricula';

import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class MatriculaService {
  http = inject(HttpClient);

  data: MatriculaData | null = null;
  matriculaConfirmada = false;

  constructor(
  ) {
    this.getMatriculas().subscribe(()=>{
      console.log(this.data);
    })  
  }

  load() {
    console.log('load');
    if (this.data) {
      return of(this.data);
    } else {
      return this.http
        .get<MatriculaData>('assets/data/matricula.json')
        .pipe(map(this.processData, this));
    }
  }

  processData(data: MatriculaData): MatriculaData {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    console.log('processData');
    this.data = data;
    return this.data;
  }

  getMatriculas() {
    return this.load().pipe(map((data: MatriculaData) => data));
  }

  detail(id: string) {
    for (let matricula of this.data.matriculas) {
      if (matricula.id == id) {
        return matricula;
      }
    }
    return null;
  }

  search(params?: any) {
    if (!params) {
      return this.data.matriculas;
    }

    return this.data.matriculas.filter((matricula) => {
      for (let key in params) {
        let field = matricula[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return matricula;
        } else if (field == params[key]) {
          return matricula;
        }
      }
      return null;
    });
  }

  add(matricula: Matricula) {
    matricula.id = matricula.turma.disciplina.codigo + '-' + matricula.turma.codigo;
    this.data.matriculas.push(matricula);
  }

  patchStatus(id: string, status: string) {
    for (let matricula of this.data.matriculas) {
      if (matricula.id == id) {
        matricula.status = status;
      }
    }

  }

  delete(id: string) {
    for (var i = 0; i < this.data.matriculas.length; i++) {
      if (this.data.matriculas[i].id == id) {
        this.data.matriculas.splice(i);
      }
    }
  }

  confirmarMatricula() {
    this.matriculaConfirmada = true;
  }

  verificarMatriculaConfirmada() {
    return this.matriculaConfirmada;
  }


}
