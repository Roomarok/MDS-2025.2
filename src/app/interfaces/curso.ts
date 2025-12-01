import { Professor } from "./Professor";
import { UnidadeAcademica } from "./unidadeAcademica";

export interface Curso {
  _type: string,
  codigo: string,
  nome: string,
  grauAcademico?: string,
  turno?: string,
  sede?: string,
  modalidade?: string,
  coordenacao?: Professor,
  unidadeAcademica?: UnidadeAcademica[]
}
