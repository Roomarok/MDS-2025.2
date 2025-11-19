export interface Aluno {
  _type: string,
  matricula: string,
  nome: string
}

export interface AlunoData {
  alunos: Aluno[]
}
