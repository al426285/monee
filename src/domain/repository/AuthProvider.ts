import { UserSession } from "../../domain/session/UserSession";
import { User } from "../../domain/model/User";
import { type ActionCodeSettings } from "firebase/auth";
export interface AuthProvider {
  logIn(email: string, password: string): Promise<UserSession>;
  googleSignIn(): Promise<UserSession>;
}