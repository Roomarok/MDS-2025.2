import { Disciplina } from "./disciplina"
import { PeriodoLetivo } from "./periodoLetivo"

export interface Turma {
  _type: string,
  vagasOfertadas?: number,
  vagasOcupadas?: number,
  codigo: string,
  disciplina?: Disciplina,
  horario?: Horario[],
  periodoLetivo?: PeriodoLetivo
}

export interface Horario {
  dia: string,
  horaInicio: string,
  horaFim: string
}

export interface TurmaData {
  turmas: Turma[]
}
