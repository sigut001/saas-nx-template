import {
  RouterOutlet
} from "./chunk-3KEPFTFC.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-OBGZFZ5J.js";

// apps/web/src/app/shell/admin-shell/admin-shell.component.ts
var AdminShellComponent = class _AdminShellComponent {
  static \u0275fac = function AdminShellComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminShellComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminShellComponent, selectors: [["admin-shell"]], decls: 15, vars: 0, consts: [[1, "admin-shell"], [1, "admin-sidebar"], [1, "admin-logo"], ["routerLink", "/admin/users"], ["routerLink", "/admin/organizations"], ["routerLink", "/admin/flags"], ["routerLink", "/admin/stats"], [1, "admin-content"]], template: function AdminShellComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "aside", 1)(2, "div", 2);
      \u0275\u0275text(3, "\u2699\uFE0F Admin");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "nav")(5, "a", 3);
      \u0275\u0275text(6, "Users");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "a", 4);
      \u0275\u0275text(8, "Organizations");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "a", 5);
      \u0275\u0275text(10, "Feature Flags");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "a", 6);
      \u0275\u0275text(12, "Stats");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(13, "main", 7);
      \u0275\u0275element(14, "router-outlet");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [RouterOutlet], styles: ["\n\n.admin-shell[_ngcontent-%COMP%] {\n  display: flex;\n  height: 100vh;\n}\n.admin-sidebar[_ngcontent-%COMP%] {\n  width: 220px;\n  background: #1a0a2e;\n  color: #fff;\n  padding: 1rem;\n  flex-shrink: 0;\n}\n.admin-logo[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: bold;\n  padding: 1rem 0;\n  border-bottom: 1px solid #400;\n  margin-bottom: 1rem;\n}\n.admin-sidebar[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.admin-sidebar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #ffaaaa;\n  text-decoration: none;\n  padding: 0.5rem;\n  border-radius: 4px;\n}\n.admin-sidebar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background: #400;\n}\n.admin-content[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 2rem;\n  background: #0f0a1a;\n  color: #e0d0e0;\n  overflow-y: auto;\n}\n/*# sourceMappingURL=admin-shell.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminShellComponent, [{
    type: Component,
    args: [{ selector: "admin-shell", standalone: true, imports: [RouterOutlet], template: `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-logo">\u2699\uFE0F Admin</div>
        <nav>
          <a routerLink="/admin/users">Users</a>
          <a routerLink="/admin/organizations">Organizations</a>
          <a routerLink="/admin/flags">Feature Flags</a>
          <a routerLink="/admin/stats">Stats</a>
        </nav>
      </aside>
      <main class="admin-content">
        <router-outlet />
      </main>
    </div>
  `, styles: ["/* angular:styles/component:css;0eab7c394844a13b3121dea2f4d0e3c7e83be5d8c316ba659cebc8a2a7d1d2d9;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/apps/web/src/app/shell/admin-shell/admin-shell.component.ts */\n.admin-shell {\n  display: flex;\n  height: 100vh;\n}\n.admin-sidebar {\n  width: 220px;\n  background: #1a0a2e;\n  color: #fff;\n  padding: 1rem;\n  flex-shrink: 0;\n}\n.admin-logo {\n  font-size: 1.1rem;\n  font-weight: bold;\n  padding: 1rem 0;\n  border-bottom: 1px solid #400;\n  margin-bottom: 1rem;\n}\n.admin-sidebar nav {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.admin-sidebar a {\n  color: #ffaaaa;\n  text-decoration: none;\n  padding: 0.5rem;\n  border-radius: 4px;\n}\n.admin-sidebar a:hover {\n  background: #400;\n}\n.admin-content {\n  flex: 1;\n  padding: 2rem;\n  background: #0f0a1a;\n  color: #e0d0e0;\n  overflow-y: auto;\n}\n/*# sourceMappingURL=admin-shell.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminShellComponent, { className: "AdminShellComponent", filePath: "apps/web/src/app/shell/admin-shell/admin-shell.component.ts", lineNumber: 34 });
})();
export {
  AdminShellComponent
};
//# sourceMappingURL=chunk-OPWE5OH7.js.map
