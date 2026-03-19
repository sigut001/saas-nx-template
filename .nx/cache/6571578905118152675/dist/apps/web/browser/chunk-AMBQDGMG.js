import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-OMJAMIJU.js";

// apps/web/src/app/features/not-found/not-found.component.ts
var NotFoundComponent = class _NotFoundComponent {
  static \u0275fac = function NotFoundComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotFoundComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NotFoundComponent, selectors: [["app-not-found"]], decls: 7, vars: 0, consts: [[2, "text-align", "center", "padding", "4rem"], [2, "font-size", "6rem", "margin", "0", "opacity", "0.2"], ["routerLink", "/app/dashboard"]], template: function NotFoundComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "404");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "h2");
      \u0275\u0275text(4, "Seite nicht gefunden");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "a", 2);
      \u0275\u0275text(6, "Zur\xFCck zum Dashboard");
      \u0275\u0275elementEnd()();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotFoundComponent, [{
    type: Component,
    args: [{ selector: "app-not-found", standalone: true, template: `
  <div style="text-align:center; padding: 4rem;">
    <h1 style="font-size: 6rem; margin: 0; opacity: 0.2;">404</h1>
    <h2>Seite nicht gefunden</h2>
    <a routerLink="/app/dashboard">Zur\xFCck zum Dashboard</a>
  </div>
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotFoundComponent, { className: "NotFoundComponent", filePath: "apps/web/src/app/features/not-found/not-found.component.ts", lineNumber: 10 });
})();
export {
  NotFoundComponent
};
//# sourceMappingURL=chunk-AMBQDGMG.js.map
