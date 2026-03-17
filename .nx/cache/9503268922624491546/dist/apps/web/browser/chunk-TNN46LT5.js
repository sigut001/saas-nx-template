import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-OBGZFZ5J.js";

// apps/web/src/app/features/organization/organization.component.ts
var OrganizationComponent = class _OrganizationComponent {
  static \u0275fac = function OrganizationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OrganizationComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OrganizationComponent, selectors: [["app-organization"]], decls: 4, vars: 0, template: function OrganizationComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1");
      \u0275\u0275text(1, "Organization");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p");
      \u0275\u0275text(3, "Team-Verwaltung kommt in Phase 5.");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OrganizationComponent, [{
    type: Component,
    args: [{ selector: "app-organization", standalone: true, template: `<h1>Organization</h1><p>Team-Verwaltung kommt in Phase 5.</p>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OrganizationComponent, { className: "OrganizationComponent", filePath: "apps/web/src/app/features/organization/organization.component.ts", lineNumber: 4 });
})();
export {
  OrganizationComponent
};
//# sourceMappingURL=chunk-TNN46LT5.js.map
