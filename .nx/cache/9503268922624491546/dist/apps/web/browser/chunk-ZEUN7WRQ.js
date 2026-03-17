import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-OBGZFZ5J.js";

// apps/web/src/app/features/auth/login/login.component.ts
var LoginComponent = class _LoginComponent {
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 4, vars: 0, template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h2");
      \u0275\u0275text(1, "Login");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p");
      \u0275\u0275text(3, "Firebase Auth kommt in Phase 3.");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: true, template: `<h2>Login</h2><p>Firebase Auth kommt in Phase 3.</p>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "apps/web/src/app/features/auth/login/login.component.ts", lineNumber: 4 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-ZEUN7WRQ.js.map
