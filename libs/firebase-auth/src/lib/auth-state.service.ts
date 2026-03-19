import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { FIREBASE_AUTH } from './auth.providers';

/**
 * Signal-basierter Auth-State.
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly auth: Auth = inject(FIREBASE_AUTH);

  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(true);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isEmailVerified = computed(() => this.currentUser()?.emailVerified === true);
  readonly displayName = computed(
    () => this.currentUser()?.displayName ?? this.currentUser()?.email ?? null
  );
  readonly photoURL = computed(() => this.currentUser()?.photoURL ?? null);
  readonly uid = computed(() => this.currentUser()?.uid ?? null);
  readonly role = signal<'user' | 'super_admin'>('user');

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.isLoading.set(false);

      if (user) {
        user.getIdTokenResult().then((result) => {
          const claim = result.claims['role'] as string | undefined;
          this.role.set(claim === 'super_admin' ? 'super_admin' : 'user');
        });
      } else {
        this.role.set('user');
      }
    });
  }
}
