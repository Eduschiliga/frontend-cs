export interface UsuarioAtualizar {
  senha: string;
  nome: string;
}

export function buildUsuario(): UsuarioAtualizar {
  return {
    nome: '',
    senha: ''
  }
}
