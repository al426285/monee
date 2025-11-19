//USERSERVICE QUE PASA LAS PRUBEAS;)
import type { AuthProvider } from "../repository/AuthProvider";
import type { UserRepository } from "../repository/UserRepository";
import { FirebaseAuthAdapter } from "../../data/auth/FirebaseAuthAdapter";
import { UserSession } from "../session/UserSession";
import { UserRepositoryFirebase } from "../../data/repository/UserRepositoryFirebase";
import { User } from "../model/User";
//para evitar errores de tipo en el manejo de errores (lo rojo)
import type { FirebaseError } from "firebase/app";
import {
  validatePassword,
  isValidEmail,
  isValidNickname,
} from "../../core/utils/validators";
import { handleAuthError } from "../../core/utils/exceptions";

export class UserService {
  private static instance: UserService;
  private authProvider!: AuthProvider;
  private userRepository!: UserRepository;

  private constructor() {}

  public static getInstance(
    authProvider?: AuthProvider,
    repProvider?: UserRepository
  ): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
      UserService.instance.authProvider =
        authProvider ?? new FirebaseAuthAdapter();
      UserService.instance.userRepository =
        repProvider ?? new UserRepositoryFirebase();
    } else {
      // Permitir reemplazar providers si se pasan
      if (authProvider) UserService.instance.authProvider = authProvider;
      if (repProvider) UserService.instance.userRepository = repProvider;
    }
    return UserService.instance;
  }


  // logIn devuelve el token (según AuthProvider.logIn)
  async logIn(email: string, password: string): Promise<UserSession> {
    const userSession = await this.authProvider.logIn(email, password);
    userSession.saveToCache();
    return userSession;
  }

 

  async googleSignIn(): Promise<UserSession> {
    try {
      const session = await this.authProvider.googleSignIn();
      session.saveToCache();
      return session;
    } catch (error) {
      handleAuthError(error as FirebaseError);
      return new UserSession;
    }
  }

 

}
