import { SetMetadata } from "@nestjs/common";

export const PROFILE_KEY = "requireProfile";

export const RequireProfile = (profile: "TENANT" | "OWNER") => SetMetadata(PROFILE_KEY, profile)