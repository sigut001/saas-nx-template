import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-OMJAMIJU.js";

// apps/web/src/app/features/billing/billing.component.ts
var BillingComponent = class _BillingComponent {
  static \u0275fac = function BillingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BillingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BillingComponent, selectors: [["app-billing"]], decls: 4, vars: 0, template: function BillingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1");
      \u0275\u0275text(1, "Billing");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p");
      \u0275\u0275text(3, "Stripe-Integration kommt in Phase 5.");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BillingComponent, [{
    type: Component,
    args: [{ selector: "app-billing", standalone: true, template: `<h1>Billing</h1><p>Stripe-Integration kommt in Phase 5.</p>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BillingComponent, { className: "BillingComponent", filePath: "apps/web/src/app/features/billing/billing.component.ts", lineNumber: 4 });
})();
export {
  BillingComponent
};
//# sourceMappingURL=chunk-KSOECRB3.js.map
