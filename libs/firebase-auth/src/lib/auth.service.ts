import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
} from 'firebase/auth';
import { FIREBASE_AUTH_CONFIG } from './auth-module.config';
import { FIREBASE_AUTH } from './auth.providers';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth: Auth = inject(FIREBASE_AUTH);
  private readonly router = inject(Router);
  private readonly config = inject(FIREBASE_AUTH_CONFIG);

  private get redirectAfterLogin(): string {
    return this.config.redirectAfterLogin ?? '/app/dashboard';
  }

  private get redirectAfterLogout(): string {
    return this.config.redirectAfterLogout ?? '/login';
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigateByUrl(this.redirectAfterLogin);
  }

  async register(email: string, password: string, displayName?: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    await sendEmailVerification(credential.user);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    await this.router.navigateByUrl(this.redirectAfterLogin);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigateByUrl(this.redirectAfterLogout);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async sendEmailVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) await sendEmailVerification(user);
  }

  async getIdToken(forceRefresh = false): Promise<string | null> {
    return (await this.auth.currentUser?.getIdToken(forceRefresh)) ?? null;
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
}
