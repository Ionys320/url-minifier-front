import type { UserInterface } from "~/interfaces/user.interface";

export interface AuthResponse {
    token: string;
    user: UserInterface
}