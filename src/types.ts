export interface Organization {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  organizations: Record<string, Organization>;
}

export interface CreateMockUserRequest {
  username: string;
  name: string;
  cpf: string;
}

export interface MockUser {
  id: string;
  username: string;
  name: string;
  cpf: string;
}

export enum ConsentStatus {
  AUTHORIZED = "AUTHORISED",
  AWAITING_AUTHORIZATION = "AWAITING_AUTHORISATION",
  REVOKED = "REVOKED",
}

export interface Consent {
  consentId: string;
  status: ConsentStatus;
  permissions: string[];
  creationDateTime: string;
  expirationDateTime: string;
  statusUpdateDateTime: string;
  clientId: string;
  userId: string;
}

export enum AccountType {
  CHECKING = "CONTA_DEPOSITO_A_VISTA",
  SAVINGS = "CONTA_POUPANCA",
  PREPAID = "CONTA_PAGAMENTO_PRE_PAGA",
}

export interface Account {
  accountId: string;
  type: AccountType;
}
