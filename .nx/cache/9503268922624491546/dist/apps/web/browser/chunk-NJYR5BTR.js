import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-OBGZFZ5J.js";

// apps/web/src/app/features/dashboard/dashboard.component.ts
var DashboardComponent = class _DashboardComponent {
  static \u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], decls: 4, vars: 0, template: function DashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1");
      \u0275\u0275text(1, "Dashboard");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p");
      \u0275\u0275text(3, "KPI-Widgets kommen in Phase 4.");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardComponent, [{
    type: Component,
    args: [{ selector: "app-dashboard", standalone: true, template: `<h1>Dashboard</h1><p>KPI-Widgets kommen in Phase 4.</p>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "apps/web/src/app/features/dashboard/dashboard.component.ts", lineNumber: 4 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-NJYR5BTR.js.map
