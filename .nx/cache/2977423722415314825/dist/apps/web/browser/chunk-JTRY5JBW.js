import {
  AuthService,
  AuthStateService
} from "./chunk-EV22XIYR.js";
import "./chunk-EWRGETIS.js";
import {
  CommonModule,
  RouterLink
} from "./chunk-O6HQMMIA.js";
import {
  Component,
  __async,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-OMJAMIJU.js";

// apps/web/src/app/features/home/home.component.ts
function HomeComponent_Conditional_11_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 22);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r0.authState.photoURL(), \u0275\u0275sanitizeUrl);
  }
}
function HomeComponent_Conditional_11_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2013 ");
  }
}
function HomeComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "h3", 18);
    \u0275\u0275text(2, "\u{1F510} Auth Debug Info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "table", 19)(4, "tr")(5, "td", 20);
    \u0275\u0275text(6, "UID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 21);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "tr")(10, "td", 20);
    \u0275\u0275text(11, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td", 21);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "tr")(15, "td", 20);
    \u0275\u0275text(16, "E-Mail verifiziert");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 21);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "tr")(20, "td", 20);
    \u0275\u0275text(21, "Rolle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 21);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "tr")(25, "td", 20);
    \u0275\u0275text(26, "Avatar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "td", 21);
    \u0275\u0275template(28, HomeComponent_Conditional_11_Conditional_28_Template, 1, 1, "img", 22)(29, HomeComponent_Conditional_11_Conditional_29_Template, 1, 0);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.authState.uid());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r0.authState.displayName()) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : "\u2013");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.authState.isEmailVerified() ? "\u2705 Ja" : "\u274C Nein");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.authState.role());
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r0.authState.photoURL() ? 28 : 29);
  }
}
function HomeComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 23);
    \u0275\u0275text(1, "\u{1F511} Login");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "a", 24);
    \u0275\u0275text(3, "\u{1F4DD} Registrieren");
    \u0275\u0275elementEnd();
  }
}
function HomeComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 25);
    \u0275\u0275text(1, "\u{1F4CA} Zum Dashboard");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 26);
    \u0275\u0275listener("click", function HomeComponent_Conditional_14_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.logout());
    });
    \u0275\u0275text(3, "\u{1F6AA} Logout");
    \u0275\u0275elementEnd();
  }
}
var HomeComponent = class _HomeComponent {
  authState = inject(AuthStateService);
  authService = inject(AuthService);
  logout() {
    return __async(this, null, function* () {
      yield this.authService.logout();
    });
  }
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], decls: 29, vars: 7, consts: [[1, "home"], [1, "home-header"], [1, "home-title"], [1, "home-subtitle"], [1, "status-card"], [1, "status-indicator"], [1, "status-dot"], [1, "status-label"], [1, "debug-info"], [1, "action-row"], [1, "quick-nav"], [1, "quick-nav-title"], [1, "quick-nav-links"], ["routerLink", "/login", 1, "nav-chip"], ["routerLink", "/register", 1, "nav-chip"], ["routerLink", "/forgot-password", 1, "nav-chip"], ["routerLink", "/app/dashboard", 1, "nav-chip"], ["routerLink", "/admin/users", 1, "nav-chip"], [1, "debug-title"], [1, "debug-table"], [1, "debug-key"], [1, "debug-value"], ["alt", "Avatar", 1, "debug-avatar", 3, "src"], ["routerLink", "/login", 1, "btn", "btn--primary"], ["routerLink", "/register", 1, "btn", "btn--outline"], ["routerLink", "/app/dashboard", 1, "btn", "btn--primary"], [1, "btn", "btn--danger", 3, "click"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F680} SaaS Base Template");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Firebase Auth Module \u2013 Test & Demo");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5);
      \u0275\u0275element(8, "span", 6);
      \u0275\u0275elementStart(9, "span", 7);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(11, HomeComponent_Conditional_11_Template, 30, 5, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 9);
      \u0275\u0275template(13, HomeComponent_Conditional_13_Template, 4, 0)(14, HomeComponent_Conditional_14_Template, 4, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 10)(16, "h3", 11);
      \u0275\u0275text(17, "Quick-Links zum Testen");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 12)(19, "a", 13);
      \u0275\u0275text(20, "/login");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "a", 14);
      \u0275\u0275text(22, "/register");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "a", 15);
      \u0275\u0275text(24, "/forgot-password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "a", 16);
      \u0275\u0275text(26, "/app/dashboard (Guard)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "a", 17);
      \u0275\u0275text(28, "/admin/users (Admin Guard)");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275classProp("status-card--authed", ctx.authState.isAuthenticated());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("status-dot--active", ctx.authState.isAuthenticated());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.authState.isAuthenticated() ? "Eingeloggt" : "Nicht eingeloggt", " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.authState.isAuthenticated() ? 11 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.authState.isAuthenticated() ? 13 : 14);
    }
  }, dependencies: [CommonModule, RouterLink], styles: ['\n\n.home[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background: #0f0f1a;\n  color: #e8e8f0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 3rem 1.5rem;\n  gap: 2rem;\n  font-family:\n    "Inter",\n    system-ui,\n    sans-serif;\n}\n.home-header[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.home-title[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 800;\n  margin: 0 0 0.5rem;\n}\n.home-subtitle[_ngcontent-%COMP%] {\n  color: #8b8ca8;\n  margin: 0;\n  font-size: 1rem;\n}\n.status-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 560px;\n  background: #1c1e2e;\n  border: 1px solid #2d2d4e;\n  border-radius: 16px;\n  padding: 1.5rem;\n  transition: border-color 0.3s;\n}\n.status-card--authed[_ngcontent-%COMP%] {\n  border-color: #22c55e;\n  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.2);\n}\n.status-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  margin-bottom: 1.25rem;\n}\n.status-dot[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  background: #4a4a6a;\n  transition: background 0.3s;\n}\n.status-dot--active[_ngcontent-%COMP%] {\n  background: #22c55e;\n  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);\n}\n.status-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 1rem;\n}\n.debug-title[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: #8b8ca8;\n  margin: 0 0 0.75rem;\n  font-weight: 600;\n}\n.debug-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n}\n.debug-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #2d2d4e;\n}\n.debug-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.debug-key[_ngcontent-%COMP%] {\n  padding: 0.5rem 0.75rem 0.5rem 0;\n  color: #8b8ca8;\n  font-size: 0.8rem;\n  font-weight: 500;\n  width: 140px;\n  vertical-align: middle;\n}\n.debug-value[_ngcontent-%COMP%] {\n  padding: 0.5rem 0;\n  font-size: 0.85rem;\n  color: #e8e8f0;\n  font-family: "Courier New", monospace;\n  word-break: break-all;\n}\n.debug-avatar[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n}\n.action-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 0.7rem 1.5rem;\n  border-radius: 10px;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  text-decoration: none;\n  transition: opacity 0.15s, transform 0.1s;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.btn[_ngcontent-%COMP%]:hover {\n  opacity: 0.85;\n}\n.btn[_ngcontent-%COMP%]:active {\n  transform: scale(0.97);\n}\n.btn--primary[_ngcontent-%COMP%] {\n  background: #6c47ff;\n  color: #fff;\n}\n.btn--outline[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #6c47ff;\n  border: 1.5px solid #6c47ff;\n}\n.btn--danger[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.15);\n  color: #fca5a5;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.quick-nav[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 560px;\n}\n.quick-nav-title[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #4a4a6a;\n  font-weight: 600;\n  margin: 0 0 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.quick-nav-links[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.nav-chip[_ngcontent-%COMP%] {\n  background: #1c1e2e;\n  border: 1px solid #2d2d4e;\n  color: #6c47ff;\n  padding: 0.35rem 0.75rem;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  text-decoration: none;\n  font-family: monospace;\n  transition: border-color 0.15s, background 0.15s;\n}\n.nav-chip[_ngcontent-%COMP%]:hover {\n  border-color: #6c47ff;\n  background: rgba(108, 71, 255, 0.08);\n}\n/*# sourceMappingURL=home.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HomeComponent, [{
    type: Component,
    args: [{ selector: "app-home", standalone: true, imports: [CommonModule, RouterLink], template: `
    <div class="home">

      <header class="home-header">
        <h1 class="home-title">\u{1F680} SaaS Base Template</h1>
        <p class="home-subtitle">Firebase Auth Module \u2013 Test & Demo</p>
      </header>

      <!-- Auth Status Card -->
      <div class="status-card" [class.status-card--authed]="authState.isAuthenticated()">
        <div class="status-indicator">
          <span class="status-dot" [class.status-dot--active]="authState.isAuthenticated()"></span>
          <span class="status-label">
            {{ authState.isAuthenticated() ? 'Eingeloggt' : 'Nicht eingeloggt' }}
          </span>
        </div>

        @if (authState.isAuthenticated()) {
          <div class="debug-info">
            <h3 class="debug-title">\u{1F510} Auth Debug Info</h3>
            <table class="debug-table">
              <tr>
                <td class="debug-key">UID</td>
                <td class="debug-value">{{ authState.uid() }}</td>
              </tr>
              <tr>
                <td class="debug-key">Name</td>
                <td class="debug-value">{{ authState.displayName() ?? '\u2013' }}</td>
              </tr>
              <tr>
                <td class="debug-key">E-Mail verifiziert</td>
                <td class="debug-value">{{ authState.isEmailVerified() ? '\u2705 Ja' : '\u274C Nein' }}</td>
              </tr>
              <tr>
                <td class="debug-key">Rolle</td>
                <td class="debug-value">{{ authState.role() }}</td>
              </tr>
              <tr>
                <td class="debug-key">Avatar</td>
                <td class="debug-value">
                  @if (authState.photoURL()) {
                    <img [src]="authState.photoURL()!" class="debug-avatar" alt="Avatar" />
                  } @else {
                    \u2013
                  }
                </td>
              </tr>
            </table>
          </div>
        }
      </div>

      <!-- Action Buttons -->
      <div class="action-row">
        @if (!authState.isAuthenticated()) {
          <a routerLink="/login" class="btn btn--primary">\u{1F511} Login</a>
          <a routerLink="/register" class="btn btn--outline">\u{1F4DD} Registrieren</a>
        } @else {
          <a routerLink="/app/dashboard" class="btn btn--primary">\u{1F4CA} Zum Dashboard</a>
          <button class="btn btn--danger" (click)="logout()">\u{1F6AA} Logout</button>
        }
      </div>

      <!-- Quick Nav -->
      <div class="quick-nav">
        <h3 class="quick-nav-title">Quick-Links zum Testen</h3>
        <div class="quick-nav-links">
          <a routerLink="/login" class="nav-chip">/login</a>
          <a routerLink="/register" class="nav-chip">/register</a>
          <a routerLink="/forgot-password" class="nav-chip">/forgot-password</a>
          <a routerLink="/app/dashboard" class="nav-chip">/app/dashboard (Guard)</a>
          <a routerLink="/admin/users" class="nav-chip">/admin/users (Admin Guard)</a>
        </div>
      </div>

    </div>
  `, styles: ['/* angular:styles/component:css;fb4cd7efb648a9d436e4b8ee5233f05890ecea35d499f20661dcc4d0ed06dd37;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/apps/web/src/app/features/home/home.component.ts */\n.home {\n  min-height: 100vh;\n  background: #0f0f1a;\n  color: #e8e8f0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 3rem 1.5rem;\n  gap: 2rem;\n  font-family:\n    "Inter",\n    system-ui,\n    sans-serif;\n}\n.home-header {\n  text-align: center;\n}\n.home-title {\n  font-size: 2rem;\n  font-weight: 800;\n  margin: 0 0 0.5rem;\n}\n.home-subtitle {\n  color: #8b8ca8;\n  margin: 0;\n  font-size: 1rem;\n}\n.status-card {\n  width: 100%;\n  max-width: 560px;\n  background: #1c1e2e;\n  border: 1px solid #2d2d4e;\n  border-radius: 16px;\n  padding: 1.5rem;\n  transition: border-color 0.3s;\n}\n.status-card--authed {\n  border-color: #22c55e;\n  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.2);\n}\n.status-indicator {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  margin-bottom: 1.25rem;\n}\n.status-dot {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  background: #4a4a6a;\n  transition: background 0.3s;\n}\n.status-dot--active {\n  background: #22c55e;\n  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);\n}\n.status-label {\n  font-weight: 600;\n  font-size: 1rem;\n}\n.debug-title {\n  font-size: 0.9rem;\n  color: #8b8ca8;\n  margin: 0 0 0.75rem;\n  font-weight: 600;\n}\n.debug-table {\n  width: 100%;\n  border-collapse: collapse;\n}\n.debug-table tr {\n  border-bottom: 1px solid #2d2d4e;\n}\n.debug-table tr:last-child {\n  border-bottom: none;\n}\n.debug-key {\n  padding: 0.5rem 0.75rem 0.5rem 0;\n  color: #8b8ca8;\n  font-size: 0.8rem;\n  font-weight: 500;\n  width: 140px;\n  vertical-align: middle;\n}\n.debug-value {\n  padding: 0.5rem 0;\n  font-size: 0.85rem;\n  color: #e8e8f0;\n  font-family: "Courier New", monospace;\n  word-break: break-all;\n}\n.debug-avatar {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n}\n.action-row {\n  display: flex;\n  gap: 0.75rem;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n.btn {\n  padding: 0.7rem 1.5rem;\n  border-radius: 10px;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  text-decoration: none;\n  transition: opacity 0.15s, transform 0.1s;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.btn:hover {\n  opacity: 0.85;\n}\n.btn:active {\n  transform: scale(0.97);\n}\n.btn--primary {\n  background: #6c47ff;\n  color: #fff;\n}\n.btn--outline {\n  background: transparent;\n  color: #6c47ff;\n  border: 1.5px solid #6c47ff;\n}\n.btn--danger {\n  background: rgba(239, 68, 68, 0.15);\n  color: #fca5a5;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.quick-nav {\n  width: 100%;\n  max-width: 560px;\n}\n.quick-nav-title {\n  font-size: 0.8rem;\n  color: #4a4a6a;\n  font-weight: 600;\n  margin: 0 0 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.quick-nav-links {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n.nav-chip {\n  background: #1c1e2e;\n  border: 1px solid #2d2d4e;\n  color: #6c47ff;\n  padding: 0.35rem 0.75rem;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  text-decoration: none;\n  font-family: monospace;\n  transition: border-color 0.15s, background 0.15s;\n}\n.nav-chip:hover {\n  border-color: #6c47ff;\n  background: rgba(108, 71, 255, 0.08);\n}\n/*# sourceMappingURL=home.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "apps/web/src/app/features/home/home.component.ts", lineNumber: 199 });
})();
export {
  HomeComponent
};
//# sourceMappingURL=chunk-JTRY5JBW.js.map
