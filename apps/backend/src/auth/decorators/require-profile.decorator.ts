import { SetMetadata } from "@nestjs/common";

export const PROFILE_KEY= "requireProfile"; 

export const RequireProfile = (proile: "TENANT" | "OWNER") => SetMetadata(PROFILE_KEY, proile)