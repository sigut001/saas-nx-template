import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AuthStateService } from '@saas-base/auth-core';
import { UserProfile } from '@saas-base/core-interfaces';
import { getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, Firestore } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class TenantIntegrationService {
  private readonly _auth = inject(AuthStateService);
  private _firestore: Firestore | null = null;

  // Der rohe User-Datensatz aus der Firestore (Agency-DB)
  readonly userProfile = signal<UserProfile | null>(null);
  
  // Das wichtigste Dictionary für die isolierten Module:
  readonly integrations = computed(() => this.userProfile()?.integrations ?? {});
  
  // Ob gerade das Profil aus der DB geladen wird
  readonly isLoading = signal(false);

  constructor() {
    // Sobald sich der Authentifizierungs-Status ändert, laden wir das Profil
    effect(() => {
      const uid = this._auth.uid();
      if (uid) {
        this.fetchProfile(uid);
      } else {
        this.userProfile.set(null);
      }
    });
  }

  private unsubscribeProfile: (() => void) | null = null;

  private fetchProfile(uid: string) {
    this.isLoading.set(true);
    try {
      if (!this._firestore) {
        this._firestore = getFirestore(getApp());
      }
      
      const userRef = doc(this._firestore, 'users', uid);
      
      // Cleanup vorheriger Listener, falls vorhanden
      if (this.unsubscribeProfile) {
        this.unsubscribeProfile();
      }

      // ECHTZEIT-BINDUNG (onSnapshot) statt einmaligem Lesezugriff (getDoc)
      this.unsubscribeProfile = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          this.userProfile.set(snap.data() as UserProfile);
        } else {
          console.warn(`[TenantIntegration] user document users/${uid} not found. Modules might be blocked.`);
          this.userProfile.set({ uid, email: this._auth.currentUser()?.email ?? '' } as UserProfile);
        }
        this.isLoading.set(false);
      }, (err) => {
        console.error('[TenantIntegration] Failed to listen to user profile data:', err);
        this.isLoading.set(false);
      });

    } catch (err) {
      console.error('[TenantIntegration] Setup Failed:', err);
      this.isLoading.set(false);
    }
  }
}
