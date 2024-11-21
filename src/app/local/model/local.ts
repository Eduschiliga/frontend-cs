import {Medicao} from '../../medicao/model/medicao';

export interface Local {
  id?: number;
  nome: string;
  medicoes: Medicao[];
}

export function buildLocal(): Local {
  return {
    nome: '',
    medicoes: []
  }
}
