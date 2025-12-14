import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { HttpClient } from '@angular/common/http';
import { of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TurmaData, Turma } from '../interfaces/turma';
import { DisciplinaData } from '../interfaces/disciplina';


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
      return forkJoin({
        turmas: this.http.get<TurmaData>('assets/data/turma.json'),
        disciplinas: this.http.get<DisciplinaData>('assets/data/disciplina.json')
      }).pipe(map(result => this.processData(result.turmas, result.disciplinas)));
    }
  }

  processData(turmaData: TurmaData, disciplinaData: DisciplinaData): TurmaData {
    console.log('processData - merge disciplinas into turmas');
    // Enrich each turma.disciplina with full disciplina info when available
    const disciplinas = disciplinaData && disciplinaData.disciplinas ? disciplinaData.disciplinas : [];
    for (const t of turmaData.turmas) {
      if (t.disciplina && t.disciplina.codigo) {
        const full = disciplinas.find(d => d.codigo === t.disciplina.codigo);
        if (full) {
          // copy fields that may be missing on turma.disciplina
          t.disciplina = { ...t.disciplina, ...full } as any;
        }
      }
    }
    this.data = turmaData;
    return this.data;
  }

  getTurmas() {
    return this.load().pipe(map((data: TurmaData) => data));
  }

}
