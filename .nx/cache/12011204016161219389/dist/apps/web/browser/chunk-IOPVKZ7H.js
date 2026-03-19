import {
  RouterOutlet
} from "./chunk-6T3G6QQG.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart
} from "./chunk-LJ3WORBN.js";

// apps/web/src/app/shell/auth-shell/auth-shell.component.ts
var AuthShellComponent = class _AuthShellComponent {
  static \u0275fac = function AuthShellComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthShellComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AuthShellComponent, selectors: [["auth-shell"]], decls: 3, vars: 0, consts: [[1, "auth-shell"], [1, "auth-card"]], template: function AuthShellComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275element(2, "router-outlet");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [RouterOutlet], styles: ["\n\n.auth-shell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  background: #0f0f1a;\n}\n.auth-card[_ngcontent-%COMP%] {\n  background: #1a1a2e;\n  border-radius: 12px;\n  padding: 2.5rem;\n  width: 100%;\n  max-width: 420px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);\n}\n/*# sourceMappingURL=auth-shell.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthShellComponent, [{
    type: Component,
    args: [{ selector: "auth-shell", standalone: true, imports: [RouterOutlet], template: `
    <div class="auth-shell">
      <div class="auth-card">
        <router-outlet />
      </div>
    </div>
  `, styles: ["/* angular:styles/component:css;4041ce772dc9e451a074ef21a04f9a3c9b802e7b83c322ad7eff3afcf14727ae;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/apps/web/src/app/shell/auth-shell/auth-shell.component.ts */\n.auth-shell {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  background: #0f0f1a;\n}\n.auth-card {\n  background: #1a1a2e;\n  border-radius: 12px;\n  padding: 2.5rem;\n  width: 100%;\n  max-width: 420px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);\n}\n/*# sourceMappingURL=auth-shell.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AuthShellComponent, { className: "AuthShellComponent", filePath: "apps/web/src/app/shell/auth-shell/auth-shell.component.ts", lineNumber: 20 });
})();
export {
  AuthShellComponent
};
//# sourceMappingURL=chunk-IOPVKZ7H.js.map
