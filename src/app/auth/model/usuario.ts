export interface Usuario {
  email: string;
  nome: string;
  senha: string;
}

export interface UsuarioResponse {
  mensagem: string;
  usuario: Usuario;
}

export interface UsuarioLogin {
  email: string;
  senha: string;
}

export function buildUsuario(): Usuario {
  return {
    email: '',
    nome: '',
    senha: '',
  };
}

export function buildUsuarioLogin() {
  return {
    email: '',
    senha: ''
  }
}
