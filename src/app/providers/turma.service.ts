import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TurmaData } from '../interfaces/turma';


@Injectable({
  providedIn: 'root',
})
export class TurmaService {
  http = inject(HttpClient);

  data: TurmaData | null = null;

  constructor(
  ) {
    this.getTurmas().subscribe(()=>{
      console.log(this.data);
    })  
  }

  load() {
    console.log('load');
    if (this.data) {
      return of(this.data);
    } else {
      return this.http
        .get<TurmaData>('assets/data/turma.json')
        .pipe(map(this.processData, this));
    }
  }

  processData(data: TurmaData): TurmaData {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    console.log('processData');
    this.data = data;
    return this.data;
  }

  getTurmas() {
    return this.load().pipe(map((data: TurmaData) => data));
  }

}
