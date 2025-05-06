import type {
  MockUser,
  Consent,
  User,
  CreateMockUserRequest,
  Account,
} from "./types";
import { ErrorInfo, type ResponseError } from "./errors";

export async function tryFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);
  const interactionId = res.headers.get("x-fapi-interaction-id") ?? undefined;

  const body = res.status != 204 ? await res.json() : {};
  if (!res.ok) {
    const respError = body as ResponseError;
    throw new ErrorInfo(
      respError.errors[0].code,
      respError.errors[0].detail,
      interactionId
    );
  }

  return body.data as T;
}

export async function fetchMockUsers(orgId: string): Promise<MockUser[]> {
  return await tryFetch(`https://api.mockbank.local/app/orgs/${orgId}/users`, {
    credentials: "include",
  });
}

export async function createMockUser(
  user: CreateMockUserRequest,
  orgId: string
): Promise<void> {
  await tryFetch(`https://api.mockbank.local/app/orgs/${orgId}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include",
  });
  return;
}

export async function fetchMockUser(
  userId: string,
  orgId: string
): Promise<MockUser> {
  return await tryFetch(
    `https://api.mockbank.local/app/orgs/${orgId}/users/${userId}`,
    {
      credentials: "include",
    }
  );
}

export async function deleteMockUser(
  userId: string,
  orgId: string
): Promise<void> {
  return await tryFetch(
    `https://api.mockbank.local/app/orgs/${orgId}/users/${userId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
}

export async function fetchConsents(
  userId: string,
  orgId: string
): Promise<Consent[]> {
  return await tryFetch(
    `https://api.mockbank.local/app/orgs/${orgId}/users/${userId}/consents`,
    {
      credentials: "include",
    }
  );
}

export async function fetchAccounts(
  userId: string,
  orgId: string
): Promise<Account[]> {
  return await tryFetch(
    `https://api.mockbank.local/app/orgs/${orgId}/users/${userId}/accounts`,
    {
      credentials: "include",
    }
  );
}

export async function fetchAuthUrl(): Promise<string> {
  const res: { authUrl: string } = await tryFetch(
    "https://api.mockbank.local/app/directory/auth-url"
  );
  console.log(res);
  return res.authUrl;
}

export async function fetchUser(): Promise<User> {
  return await tryFetch(`https://api.mockbank.local/app/me`, {
    credentials: "include",
  });
}
