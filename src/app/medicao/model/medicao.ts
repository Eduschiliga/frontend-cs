export interface Medicao {
  id?: number;
  data: Date;
  nivel_sinal_24ghz: number;
  nivel_sinal_5ghz: number;
  velocidade_24ghz: number;
  velocidade_5ghz: number;
  interferencia: number;
}

export function buildMedicao(): Medicao {
  return {
    data: new Date(),
    nivel_sinal_24ghz: 0,
    nivel_sinal_5ghz: 0,
    velocidade_24ghz: 0,
    velocidade_5ghz: 0,
    interferencia: 0
  }
}
