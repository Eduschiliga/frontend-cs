export interface Email {
  emailId?: number;
  assunto: string;
  emailDestinatario: string;
  emailRemetente?: string;
  corpo: string;
  status?: 'ENVIADO' | 'LIDO' | 'RASCUNHO';
  dataEnvio?: Date;
}

export interface EmailCriacao {
  emailDestinatario: string;
  assunto: string;
  corpo: string;
}

export interface EmailListaResponse {
  mensagem: string;
  emails: Email[];
}

export interface EmailResponse {
  mensagem: string;
  email: Email;
}
