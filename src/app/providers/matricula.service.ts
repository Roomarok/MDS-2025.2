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

}
