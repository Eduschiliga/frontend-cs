export interface Usuario {
  usuarioId: number;
  email: string;
  login: string;
  senha: string;
  nomeCompleto: string;
}

export interface UsuarioLogin {
  login: string;
  senha: string;
}

export function buildUsuario(): Usuario {
  return {
    usuarioId: 0,
    email: '',
    login: '',
    senha: '',
    nomeCompleto: ''
  };
}

export function buildUsuarioLogin() {
  return {
    login: '',
    senha: ''
  }
}
