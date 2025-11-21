import type { AuthProvider } from "../../domain/repository/AuthProvider";
import { FirebaseError } from "firebase/app";
import { handleAuthError } from "../../core/utils/exceptions";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  confirmPasswordReset,
  sendPasswordResetEmail,
  type ActionCodeSettings,
} from "firebase/auth";
import { firebaseApp } from "../../core/config/firebaseConfig";
import { User } from "../../domain/model/User";
import { UserSession } from "../../domain/session/UserSession";

export class FirebaseAuthAdapter implements AuthProvider {
  private auth = getAuth(firebaseApp);
  

 async deleteUser(userId: string): Promise<void> {
    const ref = doc(db, "users", userId);
    try {
      await deleteDoc(ref);
    } catch (error) {
      throw new Error(error as Error);
    }
  }


  
}