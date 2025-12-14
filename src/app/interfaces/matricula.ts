import { Aluno } from "./aluno"
import { Turma } from "./turma"

export interface Matricula {
  _type: string,
  id?: string,
  status: string,
  motivoIndeferimento?: string,
  prioridade?: number,
  aluno?: Aluno,
  turma?: Turma
}

export interface MatriculaData {
  matriculas: Matricula[]
}
