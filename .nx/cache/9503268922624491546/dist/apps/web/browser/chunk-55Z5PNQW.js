import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-OBGZFZ5J.js";

// apps/web/src/app/features/settings/settings.component.ts
var SettingsComponent = class _SettingsComponent {
  static \u0275fac = function SettingsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SettingsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SettingsComponent, selectors: [["app-settings"]], decls: 4, vars: 0, template: function SettingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "h1");
      \u0275\u0275text(1, "Settings");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "p");
      \u0275\u0275text(3, "Einstellungen kommen in Phase 5.");
      \u0275\u0275elementEnd();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SettingsComponent, [{
    type: Component,
    args: [{ selector: "app-settings", standalone: true, template: `<h1>Settings</h1><p>Einstellungen kommen in Phase 5.</p>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "apps/web/src/app/features/settings/settings.component.ts", lineNumber: 4 });
})();
export {
  SettingsComponent
};
//# sourceMappingURL=chunk-55Z5PNQW.js.map
