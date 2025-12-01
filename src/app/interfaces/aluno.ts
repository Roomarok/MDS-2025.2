import { Curso } from "./curso"

export interface Aluno {
  _type: string,
  matricula: string,
  nome: string,
  ira?: number,
  curso?: Curso
}

export interface AlunoData {
  alunos: Aluno[]
}
