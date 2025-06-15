export interface Rascunho {
  rascunhoId?: number;
  assunto: string;
  emailDestinatario: string;
  corpo: string;
}

export interface RascunhoListaResponse {
  mensagem: string;
  rascunhos: Rascunho[];
}

export interface RascunhoResponse {
  mensagem: string;
  rascunho: Rascunho;
}
