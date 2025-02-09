import {Medicao} from '../../medicao/model/medicao';

export interface Local {
  localId?: number;
  nome: string;
  medicoes: Medicao[];
}

export function buildLocal(): Local {
  return {
    nome: '',
    medicoes: []
  }
}
