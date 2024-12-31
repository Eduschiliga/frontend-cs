import {Usuario} from './usuario';

export interface UsuarioAuth extends Usuario{
  isAuth: boolean;
  token?: string;
}

export function buildUsuarioAuth(): UsuarioAuth {
  return {
    usuarioId: 0,
    email: '',
    login: '',
    senha: '',
    nomeCompleto: '',
    isAuth: false,
    token: ''
  };
}
