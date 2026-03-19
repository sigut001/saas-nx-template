import {
  collection,
  doc,
  getFirestore,
  setDoc,
  updateDoc
} from "./chunk-IBA3O5CQ.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  getAuth,
  ɵNgNoValidate
} from "./chunk-EWRGETIS.js";
import {
  Router
} from "./chunk-O6HQMMIA.js";
import {
  Component,
  __async,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-OMJAMIJU.js";

// apps/web/src/app/features/onboarding/onboarding.component.ts
function OnboardingComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u26A0 ", ctx_r0.error(), "");
  }
}
function OnboardingComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1, "Bitte einen Namen eingeben (mind. 2 Zeichen)");
    \u0275\u0275elementEnd();
  }
}
function OnboardingComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Slug: ", ctx_r0.slug(), "");
  }
}
function OnboardingComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 12);
    \u0275\u0275text(1, " Wird erstellt\u2026 ");
  }
}
function OnboardingComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Organisation erstellen \u2192 ");
  }
}
var OnboardingComponent = class _OnboardingComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  loading = signal(false);
  error = signal(null);
  form = this.fb.group({
    orgName: ["", [Validators.required, Validators.minLength(2)]]
  });
  get slug() {
    return () => this.toSlug(this.form.value.orgName ?? "");
  }
  isInvalid() {
    const ctrl = this.form.get("orgName");
    return !!(ctrl?.invalid && ctrl?.touched);
  }
  onSubmit() {
    return __async(this, null, function* () {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      this.loading.set(true);
      this.error.set(null);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user)
          throw new Error("Nicht angemeldet");
        const db = getFirestore();
        const orgName = this.form.value.orgName.trim();
        const slug = this.toSlug(orgName);
        const orgRef = doc(collection(db, "organizations"));
        const orgId = orgRef.id;
        yield setDoc(orgRef, {
          id: orgId,
          name: orgName,
          slug,
          plan: "free",
          subscriptionStatus: "active",
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          seats: 1,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
        yield setDoc(doc(db, "organizations", orgId, "members", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: "owner",
          joinedAt: /* @__PURE__ */ new Date(),
          invitedBy: null
        });
        yield updateDoc(doc(db, "users", user.uid), {
          activeOrganizationId: orgId,
          onboardedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
        yield this.router.navigate(["/app/dashboard"]);
      } catch (err) {
        this.error.set("Fehler beim Erstellen der Organisation. Bitte versuche es erneut.");
        console.error(err);
      } finally {
        this.loading.set(false);
      }
    });
  }
  toSlug(name) {
    return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  }
  static \u0275fac = function OnboardingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OnboardingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OnboardingComponent, selectors: [["app-onboarding"]], decls: 20, vars: 8, consts: [[1, "onboarding-wrap"], [1, "onboarding-card"], [1, "onboarding-header"], [1, "onboarding-icon"], [1, "onboarding-error"], [3, "ngSubmit", "formGroup"], [1, "field"], ["for", "orgName"], ["id", "orgName", "type", "text", "formControlName", "orgName", "placeholder", "z.B. Meine Agentur GmbH", 1, "input"], [1, "field-error"], [1, "field-hint"], ["type", "submit", 1, "btn-primary", 3, "disabled"], [1, "spinner"]], template: function OnboardingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275text(4, "\u{1F3E2}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h1");
      \u0275\u0275text(6, "Willkommen!");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p");
      \u0275\u0275text(8, "Erstelle deine Organisation um loszulegen.");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(9, OnboardingComponent_Conditional_9_Template, 2, 1, "div", 4);
      \u0275\u0275elementStart(10, "form", 5);
      \u0275\u0275listener("ngSubmit", function OnboardingComponent_Template_form_ngSubmit_10_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(11, "div", 6)(12, "label", 7);
      \u0275\u0275text(13, "Name der Organisation");
      \u0275\u0275elementEnd();
      \u0275\u0275element(14, "input", 8);
      \u0275\u0275template(15, OnboardingComponent_Conditional_15_Template, 2, 0, "span", 9)(16, OnboardingComponent_Conditional_16_Template, 2, 1, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "button", 11);
      \u0275\u0275template(18, OnboardingComponent_Conditional_18_Template, 2, 0)(19, OnboardingComponent_Conditional_19_Template, 1, 0);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(9);
      \u0275\u0275conditional(ctx.error() ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("input--error", ctx.isInvalid());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isInvalid() ? 15 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.slug() ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 18 : 19);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: ["\n\n.onboarding-wrap[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #0f1117;\n  padding: 1.5rem;\n}\n.onboarding-card[_ngcontent-%COMP%] {\n  background: #1c1e2e;\n  border: 1px solid #2d2d4e;\n  border-radius: 16px;\n  padding: 2.5rem 2rem;\n  width: 100%;\n  max-width: 440px;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n.onboarding-header[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.onboarding-icon[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 0.5rem;\n}\nh1[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #e8e8f0;\n  margin: 0 0 0.25rem;\n}\np[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.onboarding-error[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.12);\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n}\nlabel[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #c4c4d4;\n}\n.input[_ngcontent-%COMP%] {\n  padding: 0.65rem 0.875rem;\n  background: #0f0f1a;\n  border: 1px solid #2d2d4e;\n  border-radius: 8px;\n  color: #e8e8f0;\n  font-size: 0.9375rem;\n  transition: border-color 0.15s, box-shadow 0.15s;\n}\n.input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #6c47ff;\n  box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.2);\n}\n.input--error[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n}\n.field-error[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #fca5a5;\n}\n.field-hint[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: #4a4a6a;\n  font-family: monospace;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.75rem;\n  background: #6c47ff;\n  color: #fff;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  transition: opacity 0.15s;\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.btn-primary[_ngcontent-%COMP%]:not(:disabled):hover {\n  opacity: 0.9;\n}\n.spinner[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.7s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=onboarding.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OnboardingComponent, [{
    type: Component,
    args: [{ selector: "app-onboarding", standalone: true, imports: [ReactiveFormsModule], template: `
    <div class="onboarding-wrap">
      <div class="onboarding-card">

        <div class="onboarding-header">
          <div class="onboarding-icon">\u{1F3E2}</div>
          <h1>Willkommen!</h1>
          <p>Erstelle deine Organisation um loszulegen.</p>
        </div>

        @if (error()) {
          <div class="onboarding-error">\u26A0 {{ error() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="orgName">Name der Organisation</label>
            <input
              id="orgName"
              type="text"
              formControlName="orgName"
              placeholder="z.B. Meine Agentur GmbH"
              class="input"
              [class.input--error]="isInvalid()"
            />
            @if (isInvalid()) {
              <span class="field-error">Bitte einen Namen eingeben (mind. 2 Zeichen)</span>
            }
            @if (slug()) {
              <span class="field-hint">Slug: {{ slug() }}</span>
            }
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="loading()"
          >
            @if (loading()) {
              <span class="spinner"></span> Wird erstellt\u2026
            } @else {
              Organisation erstellen \u2192
            }
          </button>
        </form>

      </div>
    </div>
  `, styles: ["/* angular:styles/component:css;c1e287483f7f3c183fc3e5337d01b10556c270e0d19f388855280331629f4e9a;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/apps/web/src/app/features/onboarding/onboarding.component.ts */\n.onboarding-wrap {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #0f1117;\n  padding: 1.5rem;\n}\n.onboarding-card {\n  background: #1c1e2e;\n  border: 1px solid #2d2d4e;\n  border-radius: 16px;\n  padding: 2.5rem 2rem;\n  width: 100%;\n  max-width: 440px;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n.onboarding-header {\n  text-align: center;\n}\n.onboarding-icon {\n  font-size: 2.5rem;\n  margin-bottom: 0.5rem;\n}\nh1 {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #e8e8f0;\n  margin: 0 0 0.25rem;\n}\np {\n  font-size: 0.9rem;\n  color: #8b8ca8;\n  margin: 0;\n}\n.onboarding-error {\n  background: rgba(239, 68, 68, 0.12);\n  border: 1px solid rgba(239, 68, 68, 0.3);\n  color: #fca5a5;\n  border-radius: 8px;\n  padding: 0.75rem 1rem;\n  font-size: 0.875rem;\n}\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: 0.375rem;\n}\nlabel {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #c4c4d4;\n}\n.input {\n  padding: 0.65rem 0.875rem;\n  background: #0f0f1a;\n  border: 1px solid #2d2d4e;\n  border-radius: 8px;\n  color: #e8e8f0;\n  font-size: 0.9375rem;\n  transition: border-color 0.15s, box-shadow 0.15s;\n}\n.input:focus {\n  outline: none;\n  border-color: #6c47ff;\n  box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.2);\n}\n.input--error {\n  border-color: #ef4444;\n}\n.field-error {\n  font-size: 0.8rem;\n  color: #fca5a5;\n}\n.field-hint {\n  font-size: 0.78rem;\n  color: #4a4a6a;\n  font-family: monospace;\n}\n.btn-primary {\n  width: 100%;\n  padding: 0.75rem;\n  background: #6c47ff;\n  color: #fff;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  transition: opacity 0.15s;\n}\n.btn-primary:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.btn-primary:not(:disabled):hover {\n  opacity: 0.9;\n}\n.spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: spin 0.7s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=onboarding.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OnboardingComponent, { className: "OnboardingComponent", filePath: "apps/web/src/app/features/onboarding/onboarding.component.ts", lineNumber: 144 });
})();
export {
  OnboardingComponent
};
//# sourceMappingURL=chunk-XLWZVS6W.js.map
