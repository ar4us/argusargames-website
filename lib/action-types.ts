// Shared, non-"use server" types for form state.

export interface FormState {
  ok: boolean;
  error?: string;
  message?: string;
}

export const initialFormState: FormState = { ok: false };

export interface VoteResult {
  ok: boolean;
  voted?: boolean;
  vote_count?: number;
  error?: string;
}
