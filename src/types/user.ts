export interface SocialProfile {
  account: string;
  url: string;
}

export interface UserProfile {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  title?: string | null;
  organization?: string | null;
  location?: string | null;
  educations: string[];
  avatar_url?: string | null;
  about_me?: string | null;
  followers: number;
  following: number;
  social_profiles: SocialProfile[];
}

export interface UserInfoUpdatePayload {
  firstname: string;
  lastname: string;
  title?: string | null;
  organization?: string | null;
  location?: string | null;
  educations: string[];
  avatar_url?: string | null;
  about_me?: string | null;
  social_profiles: SocialProfile[];
}

export interface UsernameUpdateSuccess {
  ok: true;
  username: string;
}

export interface UsernameUpdateConflict {
  ok: false;
  suggestions: string[];
}

export type UsernameUpdateResult = UsernameUpdateSuccess | UsernameUpdateConflict;
