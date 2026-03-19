import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  GoogleAuthProvider,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  createUserWithEmailAndPassword,
  getApp,
  getApps,
  getAuth,
  initializeApp,
  onAuthStateChanged,
  registerVersion,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  ɵNgNoValidate
} from "./chunk-EWRGETIS.js";
import {
  CommonModule,
  Router,
  RouterLink
} from "./chunk-O6HQMMIA.js";
import {
  Component,
  Injectable,
  InjectionToken,
  Input,
  __async,
  __spreadValues,
  computed,
  inject,
  makeEnvironmentProviders,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-OMJAMIJU.js";

// libs/firebase-auth/src/lib/auth-module.config.ts
var DEFAULT_AUTH_FEATURES = {
  publicSignup: true,
  googleLogin: true,
  emailLogin: true,
  inviteOnly: false,
  passwordReset: true,
  emailVerification: true
};
var FIREBASE_AUTH_CONFIG = new InjectionToken("FirebaseAuthConfig");
var AUTH_FEATURES = new InjectionToken("AuthFeatures");

// node_modules/firebase/app/dist/esm/index.esm.js
var name = "firebase";
var version = "12.10.0";
registerVersion(name, version, "app");

// libs/firebase-auth/src/lib/auth.providers.ts
var FIREBASE_AUTH = new InjectionToken("FirebaseAuth");
function provideFirebaseAuth(config) {
  const app = getApps().length ? getApp() : initializeApp(config.firebaseConfig);
  const auth = getAuth(app);
  const features = __spreadValues(__spreadValues({}, DEFAULT_AUTH_FEATURES), config.features ?? {});
  return makeEnvironmentProviders([
    { provide: FIREBASE_AUTH_CONFIG, useValue: config },
    { provide: FIREBASE_AUTH, useValue: auth },
    { provide: AUTH_FEATURES, useValue: features }
  ]);
}

// libs/firebase-auth/src/lib/auth.service.ts
var AuthService = class _AuthService {
  auth = inject(FIREBASE_AUTH);
  router = inject(Router);
  config = inject(FIREBASE_AUTH_CONFIG);
  get redirectAfterLogin() {
    return this.config.redirectAfterLogin ?? "/app/dashboard";
  }
  get redirectAfterLogout() {
    return this.config.redirectAfterLogout ?? "/login";
  }
  loginWithEmail(email, password) {
    return __async(this, null, function* () {
      yield signInWithEmailAndPassword(this.auth, email, password);
      yield this.router.navigateByUrl(this.redirectAfterLogin);
    });
  }
  register(email, password, displayName) {
    return __async(this, null, function* () {
      const credential = yield createUserWithEmailAndPassword(this.auth, email, password);
      if (displayName) {
        yield updateProfile(credential.user, { displayName });
      }
      yield sendEmailVerification(credential.user);
    });
  }
  loginWithGoogle() {
    return __async(this, null, function* () {
      const provider = new GoogleAuthProvider();
      yield signInWithPopup(this.auth, provider);
      yield this.router.navigateByUrl(this.redirectAfterLogin);
    });
  }
  logout() {
    return __async(this, null, function* () {
      yield signOut(this.auth);
      yield this.router.navigateByUrl(this.redirectAfterLogout);
    });
  }
  sendPasswordReset(email) {
    return __async(this, null, function* () {
      yield sendPasswordResetEmail(this.auth, email);
    });
  }
  sendEmailVerification() {
    return __async(this, null, function* () {
      const user = this.auth.currentUser;
      if (user)
        yield sendEmailVerification(user);
    });
  }
  getIdToken(forceRefresh = false) {
    return __async(this, null, function* () {
      return (yield this.auth.currentUser?.getIdToken(forceRefresh)) ?? null;
    });
  }
  get currentUser() {
    return this.auth.currentUser;
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// libs/firebase-auth/src/lib/auth-state.service.ts
var AuthStateService = class _AuthStateService {
  auth = inject(FIREBASE_AUTH);
  currentUser = signal(null);
  isLoading = signal(true);
  isAuthenticated = computed(() => this.currentUser() !== null);
  isEmailVerified = computed(() => this.currentUser()?.emailVerified === true);
  displayName = computed(() => this.currentUser()?.displayName ?? this.currentUser()?.email ?? null);
  photoURL = computed(() => this.currentUser()?.photoURL ?? null);
  uid = computed(() => this.currentUser()?.uid ?? null);
  role = signal("user");
  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.isLoading.set(false);
      if (user) {
        user.getIdTokenResult().then((result) => {
          const claim = result.claims["role"];
          this.role.set(claim === "super_admin" ? "super_admin" : "user");
        });
      } else {
        this.role.set("user");
      }
    });
  }
  static \u0275fac = function AuthStateService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthStateService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthStateService, factory: _AuthStateService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthStateService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// libs/firebase-auth/src/lib/guards/auth.guard.ts
var authGuard = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const config = inject(FIREBASE_AUTH_CONFIG);
  if (authState.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree([config.loginRoute ?? "/login"]);
};

// libs/firebase-auth/src/lib/guards/admin.guard.ts
var adminGuard = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const config = inject(FIREBASE_AUTH_CONFIG);
  if (!authState.isAuthenticated()) {
    return router.createUrlTree([config.loginRoute ?? "/login"]);
  }
  if (authState.role() === "super_admin") {
    return true;
  }
  return router.createUrlTree([config.redirectAfterLogin ?? "/app/dashboard"]);
};

// libs/firebase-auth/src/lib/components/login/login.component.ts
function LoginComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "span", 19);
    \u0275\u0275text(2, "\u26A0");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
function LoginComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getEmailError(), " ");
  }
}
function LoginComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 12);
    \u0275\u0275text(1, "Vergessen?");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1, "Bitte Passwort eingeben");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 20);
    \u0275\u0275text(1, "Anmelden\u2026 ");
  }
}
function LoginComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Anmelden ");
  }
}
function LoginComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function LoginComponent_Conditional_26_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onGoogleLogin());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 22);
    \u0275\u0275element(2, "path", 23)(3, "path", 24)(4, "path", 25)(5, "path", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " Mit Google anmelden ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r0.isLoading());
  }
}
function LoginComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1, " Noch kein Konto? ");
    \u0275\u0275elementStart(2, "a", 27);
    \u0275\u0275text(3, "Registrieren");
    \u0275\u0275elementEnd()();
  }
}
var LoginComponent = class _LoginComponent {
  /** Auth-Features aus zentraler Config (AUTH_FEATURES Token) */
  features = inject(AUTH_FEATURES, { optional: true }) ?? DEFAULT_AUTH_FEATURES;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  isLoading = signal(false);
  errorMessage = signal(null);
  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required]
  });
  isFieldInvalid(field) {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
  getEmailError() {
    const ctrl = this.form.get("email");
    if (ctrl?.errors?.["required"])
      return "E-Mail ist erforderlich";
    if (ctrl?.errors?.["email"])
      return "Bitte eine g\xFCltige E-Mail eingeben";
    return "";
  }
  onSubmit() {
    return __async(this, null, function* () {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      this.isLoading.set(true);
      this.errorMessage.set(null);
      try {
        const { email, password } = this.form.value;
        yield this.authService.loginWithEmail(email, password);
      } catch (err) {
        this.errorMessage.set(this.mapFirebaseError(err?.code));
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  onGoogleLogin() {
    return __async(this, null, function* () {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      try {
        yield this.authService.loginWithGoogle();
      } catch (err) {
        this.errorMessage.set(this.mapFirebaseError(err?.code));
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  mapFirebaseError(code) {
    const errors = {
      "auth/user-not-found": "Kein Konto mit dieser E-Mail gefunden.",
      "auth/wrong-password": "Falsches Passwort.",
      "auth/invalid-credential": "E-Mail oder Passwort ist falsch.",
      "auth/too-many-requests": "Zu viele Versuche. Bitte warte kurz.",
      "auth/user-disabled": "Dieses Konto wurde deaktiviert.",
      "auth/popup-closed-by-user": "Anmeldung abgebrochen.",
      "auth/network-request-failed": "Keine Internetverbindung."
    };
    return errors[code] ?? "Ein Fehler ist aufgetreten. Bitte versuche es erneut.";
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["lib-login"]], decls: 28, vars: 13, consts: [[1, "auth-container"], [1, "auth-header"], [1, "auth-title"], [1, "auth-subtitle"], ["role", "alert", 1, "auth-error"], ["novalidate", "", 1, "auth-form", 3, "ngSubmit", "formGroup"], [1, "form-field"], ["for", "email", 1, "form-label"], ["id", "email", "type", "email", "formControlName", "email", "placeholder", "name@beispiel.de", "autocomplete", "email", 1, "form-input"], [1, "form-error-text"], [1, "form-label-row"], ["for", "password", 1, "form-label"], ["routerLink", "/forgot-password", 1, "auth-link", "auth-link--sm"], ["id", "password", "type", "password", "formControlName", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", "autocomplete", "current-password", 1, "form-input"], ["type", "submit", 1, "btn", "btn--primary", 3, "disabled"], [1, "auth-divider"], [1, "auth-divider-text"], ["type", "button", 1, "btn", "btn--google", 3, "disabled"], [1, "auth-footer-text"], [1, "auth-error-icon"], [1, "btn-spinner"], ["type", "button", 1, "btn", "btn--google", 3, "click", "disabled"], ["viewBox", "0 0 24 24", "width", "18", "height", "18", 1, "google-icon"], ["fill", "#4285F4", "d", "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"], ["fill", "#34A853", "d", "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"], ["fill", "#FBBC05", "d", "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"], ["fill", "#EA4335", "d", "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"], ["routerLink", "/register", 1, "auth-link"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Willkommen zur\xFCck");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Melde dich in deinem Konto an");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(6, LoginComponent_Conditional_6_Template, 4, 1, "div", 4);
      \u0275\u0275elementStart(7, "form", 5);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_7_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(8, "div", 6)(9, "label", 7);
      \u0275\u0275text(10, "E-Mail");
      \u0275\u0275elementEnd();
      \u0275\u0275element(11, "input", 8);
      \u0275\u0275template(12, LoginComponent_Conditional_12_Template, 2, 1, "span", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 6)(14, "div", 10)(15, "label", 11);
      \u0275\u0275text(16, "Passwort");
      \u0275\u0275elementEnd();
      \u0275\u0275template(17, LoginComponent_Conditional_17_Template, 2, 0, "a", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275element(18, "input", 13);
      \u0275\u0275template(19, LoginComponent_Conditional_19_Template, 2, 0, "span", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "button", 14);
      \u0275\u0275template(21, LoginComponent_Conditional_21_Template, 2, 0)(22, LoginComponent_Conditional_22_Template, 1, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 15)(24, "span", 16);
      \u0275\u0275text(25, "oder");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(26, LoginComponent_Conditional_26_Template, 7, 1, "button", 17)(27, LoginComponent_Conditional_27_Template, 4, 0, "p", 18);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.errorMessage() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("form-input--error", ctx.isFieldInvalid("email"));
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isFieldInvalid("email") ? 12 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.features.passwordReset ? 17 : -1);
      \u0275\u0275advance();
      \u0275\u0275classProp("form-input--error", ctx.isFieldInvalid("password"));
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isFieldInvalid("password") ? 19 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.isLoading());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 21 : 22);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.features.googleLogin ? 26 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.features.publicSignup && !ctx.features.inviteOnly ? 27 : -1);
    }
  }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], styles: ['\n\n.auth-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1.25rem;\n}\n.auth-header[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.auth-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #e8e8f0;\n  margin: 0 0 0.25rem;\n}\n.auth-subtitle[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-error[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(239, 68, 68, 0.12);\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-error-icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  flex-shrink: 0;\n}\n.auth-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n}\n.form-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #c4c4d4;\n}\n.form-label-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.form-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.625rem 0.875rem;\n  background: #0f0f1a;\n  border: 1px solid #2d2d4e;\n  border-radius: 8px;\n  color: #e8e8f0;\n  font-size: 0.9375rem;\n  transition: border-color 0.15s, box-shadow 0.15s;\n  box-sizing: border-box;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #6c47ff;\n  box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.2);\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: #4a4a6a;\n}\n.form-input--error[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n}\n.form-input--error[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);\n}\n.form-error-text[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #fca5a5;\n}\n.btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.7rem 1rem;\n  border-radius: 8px;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: opacity 0.15s, transform 0.1s;\n  width: 100%;\n}\n.btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.btn[_ngcontent-%COMP%]:not(:disabled):hover {\n  opacity: 0.9;\n}\n.btn[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: scale(0.98);\n}\n.btn--primary[_ngcontent-%COMP%] {\n  background: #6c47ff;\n  color: #fff;\n}\n.btn--google[_ngcontent-%COMP%] {\n  background: #1c1e2e;\n  color: #e8e8f0;\n  border: 1px solid #2d2d4e;\n}\n.btn--google[_ngcontent-%COMP%]:not(:disabled):hover {\n  background: #22243a;\n}\n.btn-spinner[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.7s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.google-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.auth-divider[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.auth-divider[_ngcontent-%COMP%]::before, \n.auth-divider[_ngcontent-%COMP%]::after {\n  content: "";\n  flex: 1;\n  height: 1px;\n  background: #2d2d4e;\n}\n.auth-divider-text[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #4a4a6a;\n  white-space: nowrap;\n}\n.auth-footer-text[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-link[_ngcontent-%COMP%] {\n  color: #6c47ff;\n  text-decoration: none;\n  font-weight: 500;\n}\n.auth-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.auth-link--sm[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n}\n/*# sourceMappingURL=login.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "lib-login", standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], template: `
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Willkommen zur\xFCck</h1>
        <p class="auth-subtitle">Melde dich in deinem Konto an</p>
      </div>

      <!-- Error Banner -->
      @if (errorMessage()) {
        <div class="auth-error" role="alert">
          <span class="auth-error-icon">\u26A0</span>
          {{ errorMessage() }}
        </div>
      }

      <!-- E-Mail / Passwort Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" novalidate>

        <div class="form-field">
          <label class="form-label" for="email">E-Mail</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('email')"
            placeholder="name@beispiel.de"
            autocomplete="email"
          />
          @if (isFieldInvalid('email')) {
            <span class="form-error-text">
              {{ getEmailError() }}
            </span>
          }
        </div>

        <div class="form-field">
          <div class="form-label-row">
            <label class="form-label" for="password">Passwort</label>
            @if (features.passwordReset) {
              <a routerLink="/forgot-password" class="auth-link auth-link--sm">Vergessen?</a>
            }
          </div>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('password')"
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            autocomplete="current-password"
          />
          @if (isFieldInvalid('password')) {
            <span class="form-error-text">Bitte Passwort eingeben</span>
          }
        </div>

        <button
          type="submit"
          class="btn btn--primary"
          [disabled]="isLoading()"
        >
          @if (isLoading()) {
            <span class="btn-spinner"></span>Anmelden\u2026
          } @else {
            Anmelden
          }
        </button>
      </form>

      <!-- Divider -->
      <div class="auth-divider">
        <span class="auth-divider-text">oder</span>
      </div>

      <!-- Google Login -->
      @if (features.googleLogin) {
        <button
          type="button"
          class="btn btn--google"
          (click)="onGoogleLogin()"
          [disabled]="isLoading()"
        >
          <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Mit Google anmelden
        </button>
      }

      @if (features.publicSignup && !features.inviteOnly) {
        <p class="auth-footer-text">
          Noch kein Konto?
          <a routerLink="/register" class="auth-link">Registrieren</a>
        </p>
      }
    </div>
  `, styles: ['/* angular:styles/component:css;313b2de18e61a1f0d738b74ac725464f115a599584aa5d4d4c0f128e7d11026f;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/libs/firebase-auth/src/lib/components/login/login.component.ts */\n.auth-container {\n  display: flex;\n  flex-direction: column;\n  gap: 1.25rem;\n}\n.auth-header {\n  text-align: center;\n}\n.auth-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #e8e8f0;\n  margin: 0 0 0.25rem;\n}\n.auth-subtitle {\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-error {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(239, 68, 68, 0.12);\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-error-icon {\n  font-size: 1rem;\n  flex-shrink: 0;\n}\n.auth-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.form-field {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n}\n.form-label {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #c4c4d4;\n}\n.form-label-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.form-input {\n  width: 100%;\n  padding: 0.625rem 0.875rem;\n  background: #0f0f1a;\n  border: 1px solid #2d2d4e;\n  border-radius: 8px;\n  color: #e8e8f0;\n  font-size: 0.9375rem;\n  transition: border-color 0.15s, box-shadow 0.15s;\n  box-sizing: border-box;\n}\n.form-input:focus {\n  outline: none;\n  border-color: #6c47ff;\n  box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.2);\n}\n.form-input::placeholder {\n  color: #4a4a6a;\n}\n.form-input--error {\n  border-color: #ef4444;\n}\n.form-input--error:focus {\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);\n}\n.form-error-text {\n  font-size: 0.8rem;\n  color: #fca5a5;\n}\n.btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.7rem 1rem;\n  border-radius: 8px;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: opacity 0.15s, transform 0.1s;\n  width: 100%;\n}\n.btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.btn:not(:disabled):hover {\n  opacity: 0.9;\n}\n.btn:not(:disabled):active {\n  transform: scale(0.98);\n}\n.btn--primary {\n  background: #6c47ff;\n  color: #fff;\n}\n.btn--google {\n  background: #1c1e2e;\n  color: #e8e8f0;\n  border: 1px solid #2d2d4e;\n}\n.btn--google:not(:disabled):hover {\n  background: #22243a;\n}\n.btn-spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: spin 0.7s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.google-icon {\n  flex-shrink: 0;\n}\n.auth-divider {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.auth-divider::before,\n.auth-divider::after {\n  content: "";\n  flex: 1;\n  height: 1px;\n  background: #2d2d4e;\n}\n.auth-divider-text {\n  font-size: 0.8rem;\n  color: #4a4a6a;\n  white-space: nowrap;\n}\n.auth-footer-text {\n  text-align: center;\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-link {\n  color: #6c47ff;\n  text-decoration: none;\n  font-weight: 500;\n}\n.auth-link:hover {\n  text-decoration: underline;\n}\n.auth-link--sm {\n  font-size: 0.8rem;\n}\n/*# sourceMappingURL=login.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "libs/firebase-auth/src/lib/components/login/login.component.ts", lineNumber: 199 });
})();

// libs/firebase-auth/src/lib/components/register/register.component.ts
function RegisterComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "span");
    \u0275\u0275text(2, "\u2709");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage(), " ");
  }
}
function RegisterComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "span");
    \u0275\u0275text(2, "\u26A0");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
function RegisterComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1, "Bitte eine g\xFCltige E-Mail eingeben");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1, "Mindestens 8 Zeichen");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1, "Passw\xF6rter stimmen nicht \xFCberein");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 19);
    \u0275\u0275text(1, "Registrieren\u2026 ");
  }
}
function RegisterComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Konto erstellen ");
  }
}
function RegisterComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 18);
    \u0275\u0275text(1, " Bereits Konto? ");
    \u0275\u0275elementStart(2, "a", 20);
    \u0275\u0275text(3, "Anmelden");
    \u0275\u0275elementEnd()();
  }
}
function passwordMatchValidator(control) {
  const pw = control.get("password")?.value;
  const confirm = control.get("confirmPassword")?.value;
  return pw && confirm && pw !== confirm ? { passwordMismatch: true } : null;
}
var RegisterComponent = class _RegisterComponent {
  showLoginLink = true;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  isLoading = signal(false);
  errorMessage = signal(null);
  successMessage = signal(null);
  form = this.fb.group({
    displayName: [""],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    confirmPassword: ["", Validators.required]
  }, { validators: passwordMatchValidator });
  isFieldInvalid(field) {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
  onSubmit() {
    return __async(this, null, function* () {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);
      try {
        const { email, password, displayName } = this.form.value;
        yield this.authService.register(email, password, displayName || void 0);
        this.successMessage.set("Registrierung erfolgreich! Bitte pr\xFCfe deine E-Mails und best\xE4tige dein Konto.");
        this.form.reset();
      } catch (err) {
        this.errorMessage.set(this.mapFirebaseError(err?.code));
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  mapFirebaseError(code) {
    const errors = {
      "auth/email-already-in-use": "Diese E-Mail-Adresse ist bereits registriert.",
      "auth/invalid-email": "Ung\xFCltige E-Mail-Adresse.",
      "auth/weak-password": "Passwort zu schwach. Mindestens 8 Zeichen.",
      "auth/network-request-failed": "Keine Internetverbindung."
    };
    return errors[code] ?? "Registrierung fehlgeschlagen. Bitte versuche es erneut.";
  }
  static \u0275fac = function RegisterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RegisterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RegisterComponent, selectors: [["lib-register"]], inputs: { showLoginLink: "showLoginLink" }, decls: 32, vars: 17, consts: [[1, "auth-container"], [1, "auth-header"], [1, "auth-title"], [1, "auth-subtitle"], ["role", "status", 1, "auth-success"], ["role", "alert", 1, "auth-error"], ["novalidate", "", 1, "auth-form", 3, "ngSubmit", "formGroup"], [1, "form-field"], ["for", "displayName", 1, "form-label"], ["id", "displayName", "type", "text", "formControlName", "displayName", "placeholder", "Max Mustermann", "autocomplete", "name", 1, "form-input"], ["for", "email", 1, "form-label"], ["id", "email", "type", "email", "formControlName", "email", "placeholder", "name@beispiel.de", "autocomplete", "email", 1, "form-input"], [1, "form-error-text"], ["for", "password", 1, "form-label"], ["id", "password", "type", "password", "formControlName", "password", "placeholder", "Mindestens 8 Zeichen", "autocomplete", "new-password", 1, "form-input"], ["for", "confirmPassword", 1, "form-label"], ["id", "confirmPassword", "type", "password", "formControlName", "confirmPassword", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", "autocomplete", "new-password", 1, "form-input"], ["type", "submit", 1, "btn", "btn--primary", 3, "disabled"], [1, "auth-footer-text"], [1, "btn-spinner"], ["routerLink", "/login", 1, "auth-link"]], template: function RegisterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Konto erstellen");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Registriere dich kostenlos");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(6, RegisterComponent_Conditional_6_Template, 4, 1, "div", 4)(7, RegisterComponent_Conditional_7_Template, 4, 1, "div", 5);
      \u0275\u0275elementStart(8, "form", 6);
      \u0275\u0275listener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_8_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(9, "div", 7)(10, "label", 8);
      \u0275\u0275text(11, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275element(12, "input", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 7)(14, "label", 10);
      \u0275\u0275text(15, "E-Mail");
      \u0275\u0275elementEnd();
      \u0275\u0275element(16, "input", 11);
      \u0275\u0275template(17, RegisterComponent_Conditional_17_Template, 2, 0, "span", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 7)(19, "label", 13);
      \u0275\u0275text(20, "Passwort");
      \u0275\u0275elementEnd();
      \u0275\u0275element(21, "input", 14);
      \u0275\u0275template(22, RegisterComponent_Conditional_22_Template, 2, 0, "span", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "div", 7)(24, "label", 15);
      \u0275\u0275text(25, "Passwort best\xE4tigen");
      \u0275\u0275elementEnd();
      \u0275\u0275element(26, "input", 16);
      \u0275\u0275template(27, RegisterComponent_Conditional_27_Template, 2, 0, "span", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "button", 17);
      \u0275\u0275template(29, RegisterComponent_Conditional_29_Template, 2, 0)(30, RegisterComponent_Conditional_30_Template, 1, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(31, RegisterComponent_Conditional_31_Template, 4, 0, "p", 18);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_9_0;
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.successMessage() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorMessage() ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("form-input--error", ctx.isFieldInvalid("displayName"));
      \u0275\u0275advance(4);
      \u0275\u0275classProp("form-input--error", ctx.isFieldInvalid("email"));
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isFieldInvalid("email") ? 17 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("form-input--error", ctx.isFieldInvalid("password"));
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isFieldInvalid("password") ? 22 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("form-input--error", ctx.isFieldInvalid("confirmPassword") || (ctx.form.errors == null ? null : ctx.form.errors["passwordMismatch"]));
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.form.errors == null ? null : ctx.form.errors["passwordMismatch"]) && ((tmp_9_0 = ctx.form.get("confirmPassword")) == null ? null : tmp_9_0.touched) ? 27 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.isLoading());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 29 : 30);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showLoginLink ? 31 : -1);
    }
  }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], styles: ["\n\n.auth-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1.25rem;\n}\n.auth-header[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.auth-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #e8e8f0;\n  margin: 0 0 0.25rem;\n}\n.auth-subtitle[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-error[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(239, 68, 68, 0.12);\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-success[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(34, 197, 94, 0.12);\n  border: 1px solid rgba(34, 197, 94, 0.3);\n  color: #86efac;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n}\n.form-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #c4c4d4;\n}\n.form-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.625rem 0.875rem;\n  background: #0f0f1a;\n  border: 1px solid #2d2d4e;\n  border-radius: 8px;\n  color: #e8e8f0;\n  font-size: 0.9375rem;\n  transition: border-color 0.15s, box-shadow 0.15s;\n  box-sizing: border-box;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #6c47ff;\n  box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.2);\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: #4a4a6a;\n}\n.form-input--error[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n}\n.form-error-text[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #fca5a5;\n}\n.btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.7rem 1rem;\n  border-radius: 8px;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: opacity 0.15s, transform 0.1s;\n  width: 100%;\n}\n.btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.btn[_ngcontent-%COMP%]:not(:disabled):hover {\n  opacity: 0.9;\n}\n.btn[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: scale(0.98);\n}\n.btn--primary[_ngcontent-%COMP%] {\n  background: #6c47ff;\n  color: #fff;\n}\n.btn-spinner[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.7s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-footer-text[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-link[_ngcontent-%COMP%] {\n  color: #6c47ff;\n  text-decoration: none;\n  font-weight: 500;\n}\n.auth-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n/*# sourceMappingURL=register.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RegisterComponent, [{
    type: Component,
    args: [{ selector: "lib-register", standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], template: `
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Konto erstellen</h1>
        <p class="auth-subtitle">Registriere dich kostenlos</p>
      </div>

      <!-- Success Banner -->
      @if (successMessage()) {
        <div class="auth-success" role="status">
          <span>\u2709</span> {{ successMessage() }}
        </div>
      }

      <!-- Error Banner -->
      @if (errorMessage()) {
        <div class="auth-error" role="alert">
          <span>\u26A0</span> {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" novalidate>

        <div class="form-field">
          <label class="form-label" for="displayName">Name</label>
          <input
            id="displayName"
            type="text"
            formControlName="displayName"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('displayName')"
            placeholder="Max Mustermann"
            autocomplete="name"
          />
        </div>

        <div class="form-field">
          <label class="form-label" for="email">E-Mail</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('email')"
            placeholder="name@beispiel.de"
            autocomplete="email"
          />
          @if (isFieldInvalid('email')) {
            <span class="form-error-text">Bitte eine g\xFCltige E-Mail eingeben</span>
          }
        </div>

        <div class="form-field">
          <label class="form-label" for="password">Passwort</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('password')"
            placeholder="Mindestens 8 Zeichen"
            autocomplete="new-password"
          />
          @if (isFieldInvalid('password')) {
            <span class="form-error-text">Mindestens 8 Zeichen</span>
          }
        </div>

        <div class="form-field">
          <label class="form-label" for="confirmPassword">Passwort best\xE4tigen</label>
          <input
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            class="form-input"
            [class.form-input--error]="isFieldInvalid('confirmPassword') || form.errors?.['passwordMismatch']"
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            autocomplete="new-password"
          />
          @if (form.errors?.['passwordMismatch'] && form.get('confirmPassword')?.touched) {
            <span class="form-error-text">Passw\xF6rter stimmen nicht \xFCberein</span>
          }
        </div>

        <button
          type="submit"
          class="btn btn--primary"
          [disabled]="isLoading()"
        >
          @if (isLoading()) {
            <span class="btn-spinner"></span>Registrieren\u2026
          } @else {
            Konto erstellen
          }
        </button>
      </form>

      @if (showLoginLink) {
        <p class="auth-footer-text">
          Bereits Konto?
          <a routerLink="/login" class="auth-link">Anmelden</a>
        </p>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;13a073e5c9100707d060a1c93c7730d79f487384e97fd6e23307d70ca88e1ff4;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/libs/firebase-auth/src/lib/components/register/register.component.ts */\n.auth-container {\n  display: flex;\n  flex-direction: column;\n  gap: 1.25rem;\n}\n.auth-header {\n  text-align: center;\n}\n.auth-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #e8e8f0;\n  margin: 0 0 0.25rem;\n}\n.auth-subtitle {\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-error {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(239, 68, 68, 0.12);\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-success {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(34, 197, 94, 0.12);\n  border: 1px solid rgba(34, 197, 94, 0.3);\n  color: #86efac;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.form-field {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n}\n.form-label {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #c4c4d4;\n}\n.form-input {\n  width: 100%;\n  padding: 0.625rem 0.875rem;\n  background: #0f0f1a;\n  border: 1px solid #2d2d4e;\n  border-radius: 8px;\n  color: #e8e8f0;\n  font-size: 0.9375rem;\n  transition: border-color 0.15s, box-shadow 0.15s;\n  box-sizing: border-box;\n}\n.form-input:focus {\n  outline: none;\n  border-color: #6c47ff;\n  box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.2);\n}\n.form-input::placeholder {\n  color: #4a4a6a;\n}\n.form-input--error {\n  border-color: #ef4444;\n}\n.form-error-text {\n  font-size: 0.8rem;\n  color: #fca5a5;\n}\n.btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.7rem 1rem;\n  border-radius: 8px;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: opacity 0.15s, transform 0.1s;\n  width: 100%;\n}\n.btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.btn:not(:disabled):hover {\n  opacity: 0.9;\n}\n.btn:not(:disabled):active {\n  transform: scale(0.98);\n}\n.btn--primary {\n  background: #6c47ff;\n  color: #fff;\n}\n.btn-spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: spin 0.7s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-footer-text {\n  text-align: center;\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-link {\n  color: #6c47ff;\n  text-decoration: none;\n  font-weight: 500;\n}\n.auth-link:hover {\n  text-decoration: underline;\n}\n/*# sourceMappingURL=register.component.css.map */\n"] }]
  }], null, { showLoginLink: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RegisterComponent, { className: "RegisterComponent", filePath: "libs/firebase-auth/src/lib/components/register/register.component.ts", lineNumber: 185 });
})();

// libs/firebase-auth/src/lib/components/forgot-password/forgot-password.component.ts
function ForgotPasswordComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "span");
    \u0275\u0275text(2, "\u2709");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "a", 5);
    \u0275\u0275text(5, "Zur\xFCck zum Login");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage(), " ");
  }
}
function ForgotPasswordComponent_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "span");
    \u0275\u0275text(2, "\u26A0");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
function ForgotPasswordComponent_Conditional_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275text(1, "Bitte eine g\xFCltige E-Mail eingeben");
    \u0275\u0275elementEnd();
  }
}
function ForgotPasswordComponent_Conditional_7_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 14);
    \u0275\u0275text(1, "Senden\u2026 ");
  }
}
function ForgotPasswordComponent_Conditional_7_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Reset-Link senden ");
  }
}
function ForgotPasswordComponent_Conditional_7_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 13)(1, "a", 15);
    \u0275\u0275text(2, "\u2190 Zur\xFCck zum Login");
    \u0275\u0275elementEnd()();
  }
}
function ForgotPasswordComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275template(0, ForgotPasswordComponent_Conditional_7_Conditional_0_Template, 4, 1, "div", 6);
    \u0275\u0275elementStart(1, "form", 7);
    \u0275\u0275listener("ngSubmit", function ForgotPasswordComponent_Conditional_7_Template_form_ngSubmit_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    });
    \u0275\u0275elementStart(2, "div", 8)(3, "label", 9);
    \u0275\u0275text(4, "E-Mail");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 10);
    \u0275\u0275template(6, ForgotPasswordComponent_Conditional_7_Conditional_6_Template, 2, 0, "span", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 12);
    \u0275\u0275template(8, ForgotPasswordComponent_Conditional_7_Conditional_8_Template, 2, 0)(9, ForgotPasswordComponent_Conditional_7_Conditional_9_Template, 1, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, ForgotPasswordComponent_Conditional_7_Conditional_10_Template, 3, 0, "p", 13);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.errorMessage() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r0.form);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("form-input--error", ctx_r0.isFieldInvalid("email"));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isFieldInvalid("email") ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.isLoading());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isLoading() ? 8 : 9);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.showLoginLink ? 10 : -1);
  }
}
var ForgotPasswordComponent = class _ForgotPasswordComponent {
  showLoginLink = true;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  isLoading = signal(false);
  errorMessage = signal(null);
  successMessage = signal(null);
  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]]
  });
  isFieldInvalid(field) {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
  onSubmit() {
    return __async(this, null, function* () {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      this.isLoading.set(true);
      this.errorMessage.set(null);
      try {
        yield this.authService.sendPasswordReset(this.form.value.email);
        this.successMessage.set("E-Mail gesendet! Pr\xFCfe deinen Posteingang und folge dem Link.");
      } catch (err) {
        const msg = err?.code === "auth/user-not-found" ? "Kein Konto mit dieser E-Mail gefunden." : "Fehler beim Senden. Bitte versuche es erneut.";
        this.errorMessage.set(msg);
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  static \u0275fac = function ForgotPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ForgotPasswordComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForgotPasswordComponent, selectors: [["lib-forgot-password"]], inputs: { showLoginLink: "showLoginLink" }, decls: 8, vars: 1, consts: [[1, "auth-container"], [1, "auth-header"], [1, "auth-title"], [1, "auth-subtitle"], ["role", "status", 1, "auth-success"], ["routerLink", "/login", 1, "btn", "btn--secondary"], ["role", "alert", 1, "auth-error"], ["novalidate", "", 1, "auth-form", 3, "ngSubmit", "formGroup"], [1, "form-field"], ["for", "email", 1, "form-label"], ["id", "email", "type", "email", "formControlName", "email", "placeholder", "name@beispiel.de", "autocomplete", "email", 1, "form-input"], [1, "form-error-text"], ["type", "submit", 1, "btn", "btn--primary", 3, "disabled"], [1, "auth-footer-text"], [1, "btn-spinner"], ["routerLink", "/login", 1, "auth-link"]], template: function ForgotPasswordComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "Passwort zur\xFCcksetzen");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, " Gib deine E-Mail ein \u2013 wir senden dir einen Reset-Link. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(6, ForgotPasswordComponent_Conditional_6_Template, 6, 1)(7, ForgotPasswordComponent_Conditional_7_Template, 11, 8);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.successMessage() ? 6 : 7);
    }
  }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], styles: ["\n\n.auth-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1.25rem;\n}\n.auth-header[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.auth-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #e8e8f0;\n  margin: 0 0 0.25rem;\n}\n.auth-subtitle[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-error[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(239, 68, 68, 0.12);\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-success[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(34, 197, 94, 0.12);\n  border: 1px solid rgba(34, 197, 94, 0.3);\n  color: #86efac;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.form-field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n}\n.form-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #c4c4d4;\n}\n.form-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.625rem 0.875rem;\n  background: #0f0f1a;\n  border: 1px solid #2d2d4e;\n  border-radius: 8px;\n  color: #e8e8f0;\n  font-size: 0.9375rem;\n  transition: border-color 0.15s, box-shadow 0.15s;\n  box-sizing: border-box;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #6c47ff;\n  box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.2);\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: #4a4a6a;\n}\n.form-input--error[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n}\n.form-error-text[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #fca5a5;\n}\n.btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.7rem 1rem;\n  border-radius: 8px;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: opacity 0.15s, transform 0.1s;\n  width: 100%;\n}\n.btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.btn[_ngcontent-%COMP%]:not(:disabled):hover {\n  opacity: 0.9;\n}\n.btn--primary[_ngcontent-%COMP%] {\n  background: #6c47ff;\n  color: #fff;\n}\n.btn--secondary[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #6c47ff;\n  border: 1px solid #6c47ff;\n  text-decoration: none;\n}\n.btn-spinner[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.7s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-footer-text[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-link[_ngcontent-%COMP%] {\n  color: #6c47ff;\n  text-decoration: none;\n  font-weight: 500;\n}\n.auth-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n/*# sourceMappingURL=forgot-password.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ForgotPasswordComponent, [{
    type: Component,
    args: [{ selector: "lib-forgot-password", standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], template: `
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Passwort zur\xFCcksetzen</h1>
        <p class="auth-subtitle">
          Gib deine E-Mail ein \u2013 wir senden dir einen Reset-Link.
        </p>
      </div>

      @if (successMessage()) {
        <div class="auth-success" role="status">
          <span>\u2709</span> {{ successMessage() }}
        </div>
        <a routerLink="/login" class="btn btn--secondary">Zur\xFCck zum Login</a>
      } @else {

        @if (errorMessage()) {
          <div class="auth-error" role="alert">
            <span>\u26A0</span> {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form" novalidate>
          <div class="form-field">
            <label class="form-label" for="email">E-Mail</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-input"
              [class.form-input--error]="isFieldInvalid('email')"
              placeholder="name@beispiel.de"
              autocomplete="email"
            />
            @if (isFieldInvalid('email')) {
              <span class="form-error-text">Bitte eine g\xFCltige E-Mail eingeben</span>
            }
          </div>

          <button type="submit" class="btn btn--primary" [disabled]="isLoading()">
            @if (isLoading()) {
              <span class="btn-spinner"></span>Senden\u2026
            } @else {
              Reset-Link senden
            }
          </button>
        </form>

        @if (showLoginLink) {
          <p class="auth-footer-text">
            <a routerLink="/login" class="auth-link">\u2190 Zur\xFCck zum Login</a>
          </p>
        }
      }
    </div>
  `, styles: ["/* angular:styles/component:css;b1da51f09f46ec5c5a9d24a7ceaeb079dfc0e9c5ed1ddc825c9c3937c7d209cb;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/libs/firebase-auth/src/lib/components/forgot-password/forgot-password.component.ts */\n.auth-container {\n  display: flex;\n  flex-direction: column;\n  gap: 1.25rem;\n}\n.auth-header {\n  text-align: center;\n}\n.auth-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #e8e8f0;\n  margin: 0 0 0.25rem;\n}\n.auth-subtitle {\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-error {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(239, 68, 68, 0.12);\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-success {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(34, 197, 94, 0.12);\n  border: 1px solid rgba(34, 197, 94, 0.3);\n  color: #86efac;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.auth-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.form-field {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n}\n.form-label {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #c4c4d4;\n}\n.form-input {\n  width: 100%;\n  padding: 0.625rem 0.875rem;\n  background: #0f0f1a;\n  border: 1px solid #2d2d4e;\n  border-radius: 8px;\n  color: #e8e8f0;\n  font-size: 0.9375rem;\n  transition: border-color 0.15s, box-shadow 0.15s;\n  box-sizing: border-box;\n}\n.form-input:focus {\n  outline: none;\n  border-color: #6c47ff;\n  box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.2);\n}\n.form-input::placeholder {\n  color: #4a4a6a;\n}\n.form-input--error {\n  border-color: #ef4444;\n}\n.form-error-text {\n  font-size: 0.8rem;\n  color: #fca5a5;\n}\n.btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.7rem 1rem;\n  border-radius: 8px;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: opacity 0.15s, transform 0.1s;\n  width: 100%;\n}\n.btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.btn:not(:disabled):hover {\n  opacity: 0.9;\n}\n.btn--primary {\n  background: #6c47ff;\n  color: #fff;\n}\n.btn--secondary {\n  background: transparent;\n  color: #6c47ff;\n  border: 1px solid #6c47ff;\n  text-decoration: none;\n}\n.btn-spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: spin 0.7s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.auth-footer-text {\n  text-align: center;\n  font-size: 0.875rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.auth-link {\n  color: #6c47ff;\n  text-decoration: none;\n  font-weight: 500;\n}\n.auth-link:hover {\n  text-decoration: underline;\n}\n/*# sourceMappingURL=forgot-password.component.css.map */\n"] }]
  }], null, { showLoginLink: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForgotPasswordComponent, { className: "ForgotPasswordComponent", filePath: "libs/firebase-auth/src/lib/components/forgot-password/forgot-password.component.ts", lineNumber: 120 });
})();

export {
  DEFAULT_AUTH_FEATURES,
  FIREBASE_AUTH_CONFIG,
  AUTH_FEATURES,
  provideFirebaseAuth,
  AuthService,
  AuthStateService,
  authGuard,
  adminGuard,
  LoginComponent,
  RegisterComponent,
  ForgotPasswordComponent
};
/*! Bundled license information:

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=chunk-EV22XIYR.js.map
