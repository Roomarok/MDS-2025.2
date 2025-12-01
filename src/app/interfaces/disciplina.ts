import { UnidadeAcademica } from "./unidadeAcademica"

export interface Disciplina {
  _type: string,
  codigo: string,
  nome: string,
  modalidade?: string,
  cargaHorariaTotal?: number,
  cargaHoraria?: CargaHoraria,
  unidadeAcademica?: UnidadeAcademica
}

export interface CargaHoraria {
  teorica: number,
  pratica: number,
  extensionista: number
}

export interface DisciplinaData {
  disciplinas: Disciplina[]
}
