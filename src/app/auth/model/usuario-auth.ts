import {Usuario} from './usuario';

export interface UsuarioAuth extends Usuario{
  isAuth: boolean;
  token?: string;
}

export function buildUsuarioAuth(): UsuarioAuth {
  return {
    email: '',
    senha: '',
    nome: '',
    isAuth: false,
    token: ''
  };
}
