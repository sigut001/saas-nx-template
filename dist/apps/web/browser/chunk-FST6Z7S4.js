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

// apps/web/src/app/shell/app-shell/app-shell.component.ts
var AppShellComponent = class _AppShellComponent {
  static \u0275fac = function AppShellComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppShellComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppShellComponent, selectors: [["app-shell"]], decls: 21, vars: 0, consts: [[1, "app-shell"], [1, "sidebar"], [1, "sidebar-logo"], [1, "sidebar-nav"], ["routerLink", "/app/dashboard"], ["routerLink", "/app/account"], ["routerLink", "/app/settings"], ["routerLink", "/app/billing"], ["routerLink", "/app/organization"], [1, "app-content"], [1, "top-bar"], [1, "content-area"]], template: function AppShellComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "aside", 1)(2, "div", 2);
      \u0275\u0275text(3, "SaaS Base");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "nav", 3)(5, "a", 4);
      \u0275\u0275text(6, "Dashboard");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "a", 5);
      \u0275\u0275text(8, "Account");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "a", 6);
      \u0275\u0275text(10, "Settings");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "a", 7);
      \u0275\u0275text(12, "Billing");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "a", 8);
      \u0275\u0275text(14, "Organization");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 9)(16, "header", 10)(17, "span");
      \u0275\u0275text(18, "SaaS Base App");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "main", 11);
      \u0275\u0275element(20, "router-outlet");
      \u0275\u0275elementEnd()()();
    }
  }, dependencies: [RouterOutlet], styles: ["\n\n.app-shell[_ngcontent-%COMP%] {\n  display: flex;\n  height: 100vh;\n}\n.sidebar[_ngcontent-%COMP%] {\n  width: 240px;\n  background: #1a1a2e;\n  color: #fff;\n  padding: 1rem;\n  flex-shrink: 0;\n}\n.sidebar-logo[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: bold;\n  padding: 1rem 0;\n  border-bottom: 1px solid #333;\n  margin-bottom: 1rem;\n}\n.sidebar-nav[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.sidebar-nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #ccc;\n  text-decoration: none;\n  padding: 0.5rem;\n  border-radius: 4px;\n}\n.sidebar-nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background: #333;\n  color: #fff;\n}\n.app-content[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.top-bar[_ngcontent-%COMP%] {\n  height: 56px;\n  background: #16213e;\n  color: #fff;\n  display: flex;\n  align-items: center;\n  padding: 0 1.5rem;\n  border-bottom: 1px solid #333;\n  flex-shrink: 0;\n}\n.content-area[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 2rem;\n  background: #0f0f1a;\n  color: #e0e0e0;\n}\n/*# sourceMappingURL=app-shell.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppShellComponent, [{
    type: Component,
    args: [{ selector: "app-shell", standalone: true, imports: [RouterOutlet], template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-logo">SaaS Base</div>
        <nav class="sidebar-nav">
          <!-- Phase 4: wird durch SidebarComponent ersetzt -->
          <a routerLink="/app/dashboard">Dashboard</a>
          <a routerLink="/app/account">Account</a>
          <a routerLink="/app/settings">Settings</a>
          <a routerLink="/app/billing">Billing</a>
          <a routerLink="/app/organization">Organization</a>
        </nav>
      </aside>
      <div class="app-content">
        <header class="top-bar">
          <!-- Phase 4: wird durch TopBarComponent ersetzt -->
          <span>SaaS Base App</span>
        </header>
        <main class="content-area">
          <router-outlet />
        </main>
      </div>
    </div>
  `, styles: ["/* angular:styles/component:css;9e7511a557560e5db7d70b71220deba3d9e03e1adaf49a932480780689f67226;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/apps/web/src/app/shell/app-shell/app-shell.component.ts */\n.app-shell {\n  display: flex;\n  height: 100vh;\n}\n.sidebar {\n  width: 240px;\n  background: #1a1a2e;\n  color: #fff;\n  padding: 1rem;\n  flex-shrink: 0;\n}\n.sidebar-logo {\n  font-size: 1.25rem;\n  font-weight: bold;\n  padding: 1rem 0;\n  border-bottom: 1px solid #333;\n  margin-bottom: 1rem;\n}\n.sidebar-nav {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.sidebar-nav a {\n  color: #ccc;\n  text-decoration: none;\n  padding: 0.5rem;\n  border-radius: 4px;\n}\n.sidebar-nav a:hover {\n  background: #333;\n  color: #fff;\n}\n.app-content {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.top-bar {\n  height: 56px;\n  background: #16213e;\n  color: #fff;\n  display: flex;\n  align-items: center;\n  padding: 0 1.5rem;\n  border-bottom: 1px solid #333;\n  flex-shrink: 0;\n}\n.content-area {\n  flex: 1;\n  overflow-y: auto;\n  padding: 2rem;\n  background: #0f0f1a;\n  color: #e0e0e0;\n}\n/*# sourceMappingURL=app-shell.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppShellComponent, { className: "AppShellComponent", filePath: "apps/web/src/app/shell/app-shell/app-shell.component.ts", lineNumber: 44 });
})();
export {
  AppShellComponent
};
//# sourceMappingURL=chunk-FST6Z7S4.js.map
