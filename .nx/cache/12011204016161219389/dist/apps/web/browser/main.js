import {
  adminGuard,
  authGuard,
  provideFirebaseAuth
} from "./chunk-UIBNHTBQ.js";
import {
  CommonModule,
  RouterModule,
  RouterOutlet,
  bootstrapApplication,
  provideRouter,
  withComponentInputBinding,
  withViewTransitions
} from "./chunk-6T3G6QQG.js";
import {
  Component,
  ViewEncapsulation,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵtext
} from "./chunk-LJ3WORBN.js";

// apps/web/src/app/app.routes.ts
var appRoutes = [
  // Root redirect
  { path: "", redirectTo: "/app/dashboard", pathMatch: "full" },
  // ─── Auth Zone (kein Guard, keine Shell) ───────────────────────────────────
  {
    path: "login",
    loadComponent: () => import("./chunk-IOPVKZ7H.js").then((m) => m.AuthShellComponent),
    children: [
      {
        path: "",
        loadComponent: () => import("./chunk-B7BOO5JT.js").then((m) => m.LoginComponent)
      }
    ]
  },
  {
    path: "register",
    loadComponent: () => import("./chunk-IOPVKZ7H.js").then((m) => m.AuthShellComponent),
    children: [
      {
        path: "",
        loadComponent: () => import("./chunk-B7BOO5JT.js").then((m) => m.RegisterComponent)
      }
    ]
  },
  {
    path: "forgot-password",
    loadComponent: () => import("./chunk-IOPVKZ7H.js").then((m) => m.AuthShellComponent),
    children: [
      {
        path: "",
        loadComponent: () => import("./chunk-B7BOO5JT.js").then((m) => m.ForgotPasswordComponent)
      }
    ]
  },
  // ─── App Zone (authGuard + AppShell) ──────────────────────────────────────
  {
    path: "app",
    loadComponent: () => import("./chunk-7JHU6HZH.js").then((m) => m.AppShellComponent),
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        title: "Dashboard",
        loadComponent: () => import("./chunk-AOIGVATG.js").then((m) => m.DashboardComponent)
      },
      {
        path: "account",
        title: "Account",
        loadComponent: () => import("./chunk-DKX7FJXA.js").then((m) => m.AccountComponent)
      },
      {
        path: "settings",
        title: "Settings",
        loadComponent: () => import("./chunk-Y7HJ2YCQ.js").then((m) => m.SettingsComponent)
      },
      {
        path: "billing",
        title: "Billing",
        loadComponent: () => import("./chunk-Q3CBOYQ4.js").then((m) => m.BillingComponent)
      },
      {
        path: "organization",
        title: "Organization",
        loadComponent: () => import("./chunk-KMYPW52P.js").then((m) => m.OrganizationComponent)
      }
      // ↓ SLOT: Hier werden Business-Feature-Routen via Generator eingetragen
    ]
  },
  // ─── Admin Zone (adminGuard + AdminShell) ─────────────────────────────────
  {
    path: "admin",
    loadComponent: () => import("./chunk-RDNU4ETM.js").then((m) => m.AdminShellComponent),
    canActivate: [adminGuard],
    children: [
      { path: "", redirectTo: "users", pathMatch: "full" },
      {
        path: "users",
        title: "Admin \u2013 Users",
        loadComponent: () => import("./chunk-3GL37WWJ.js").then((m) => m.AdminUsersComponent)
      }
    ]
  },
  // ─── 404 ──────────────────────────────────────────────────────────────────
  {
    path: "**",
    loadComponent: () => import("./chunk-F7HOKZJK.js").then((m) => m.NotFoundComponent)
  }
];

// apps/web/src/environments/environment.ts
var environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_DEV_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};

// apps/web/src/app/app.config.ts
var appConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions()),
    provideFirebaseAuth({
      firebaseConfig: environment.firebase,
      redirectAfterLogin: "/app/dashboard",
      redirectAfterLogout: "/login",
      loginRoute: "/login"
    })
  ]
};

// apps/web/src/app/nx-welcome.ts
var NxWelcome = class _NxWelcome {
  static \u0275fac = function NxWelcome_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NxWelcome)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NxWelcome, selectors: [["app-nx-welcome"]], decls: 165, vars: 0, consts: [[1, "wrapper"], [1, "container"], ["id", "welcome"], ["id", "hero", 1, "rounded"], [1, "text-container"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", "xmlns", "http://www.w3.org/2000/svg"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"], ["href", "#commands"], [1, "logo-container"], ["fill", "currentColor", "role", "img", "viewBox", "0 0 24 24", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M11.987 14.138l-3.132 4.923-5.193-8.427-.012 8.822H0V4.544h3.691l5.247 8.833.005-3.998 3.044 4.759zm.601-5.761c.024-.048 0-3.784.008-3.833h-3.65c.002.059-.005 3.776-.003 3.833h3.645zm5.634 4.134a2.061 2.061 0 0 0-1.969 1.336 1.963 1.963 0 0 1 2.343-.739c.396.161.917.422 1.33.283a2.1 2.1 0 0 0-1.704-.88zm3.39 1.061c-.375-.13-.8-.277-1.109-.681-.06-.08-.116-.17-.176-.265a2.143 2.143 0 0 0-.533-.642c-.294-.216-.68-.322-1.18-.322a2.482 2.482 0 0 0-2.294 1.536 2.325 2.325 0 0 1 4.002.388.75.75 0 0 0 .836.334c.493-.105.46.36 1.203.518v-.133c-.003-.446-.246-.55-.75-.733zm2.024 1.266a.723.723 0 0 0 .347-.638c-.01-2.957-2.41-5.487-5.37-5.487a5.364 5.364 0 0 0-4.487 2.418c-.01-.026-1.522-2.39-1.538-2.418H8.943l3.463 5.423-3.379 5.32h3.54l1.54-2.366 1.568 2.366h3.541l-3.21-5.052a.7.7 0 0 1-.084-.32 2.69 2.69 0 0 1 2.69-2.691h.001c1.488 0 1.736.89 2.057 1.308.634.826 1.9.464 1.9 1.541a.707.707 0 0 0 1.066.596zm.35.133c-.173.372-.56.338-.755.639-.176.271.114.412.114.412s.337.156.538-.311c.104-.231.14-.488.103-.74z"], ["id", "middle-content"], ["id", "middle-left-content"], ["id", "learning-materials", 1, "rounded", "shadow"], ["href", "https://nx.dev/getting-started/intro?utm_source=nx-project", "target", "_blank", "rel", "noreferrer", 1, "list-item-link"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 5l7 7-7 7"], ["href", "https://nx.dev/blog?utm_source=nx-project", "target", "_blank", "rel", "noreferrer", 1, "list-item-link"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"], ["href", "https://www.youtube.com/@NxDevtools/videos?utm_source=nx-project&sub_confirmation=1", "target", "_blank", "rel", "noreferrer", 1, "list-item-link"], ["role", "img", "viewBox", "0 0 24 24", "fill", "currentColor", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"], ["href", "https://nx.dev/getting-started/tutorials/angular-standalone-tutorial?utm_source=nx-project", "target", "_blank", "rel", "noreferrer", 1, "list-item-link"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"], ["id", "nx-repo", "href", "https://github.com/nrwl/nx?utm_source=nx-project", "target", "_blank", "rel", "noreferrer", 1, "button-pill", "rounded", "shadow"], ["d", "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"], ["id", "other-links"], ["href", "https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console&utm_source=nx-project", "target", "_blank", "rel", "noreferrer", 1, "button-pill", "rounded", "shadow", "nx-console"], ["d", "M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"], ["href", "https://plugins.jetbrains.com/plugin/21060-nx-console", "target", "_blank", "rel", "noreferrer", 1, "button-pill", "rounded", "shadow", "nx-console-jetbrains"], ["height", "48", "width", "48", "viewBox", "20 20 60 60", "xmlns", "http://www.w3.org/2000/svg"], ["d", "m22.5 22.5h60v60h-60z"], ["fill", "#fff"], ["d", "m29.03 71.25h22.5v3.75h-22.5z"], ["d", "m28.09 38 1.67-1.58a1.88 1.88 0 0 0 1.47.87c.64 0 1.06-.44 1.06-1.31v-5.98h2.58v6a3.48 3.48 0 0 1 -.87 2.6 3.56 3.56 0 0 1 -2.57.95 3.84 3.84 0 0 1 -3.34-1.55z"], ["d", "m36 30h7.53v2.19h-5v1.44h4.49v2h-4.42v1.49h5v2.21h-7.6z"], ["d", "m47.23 32.29h-2.8v-2.29h8.21v2.27h-2.81v7.1h-2.6z"], ["d", "m29.13 43.08h4.42a3.53 3.53 0 0 1 2.55.83 2.09 2.09 0 0 1 .6 1.53 2.16 2.16 0 0 1 -1.44 2.09 2.27 2.27 0 0 1 1.86 2.29c0 1.61-1.31 2.59-3.55 2.59h-4.44zm5 2.89c0-.52-.42-.8-1.18-.8h-1.29v1.64h1.24c.79 0 1.25-.26 1.25-.81zm-.9 2.66h-1.57v1.73h1.62c.8 0 1.24-.31 1.24-.86 0-.5-.4-.87-1.27-.87z"], ["d", "m38 43.08h4.1a4.19 4.19 0 0 1 3 1 2.93 2.93 0 0 1 .9 2.19 3 3 0 0 1 -1.93 2.89l2.24 3.27h-3l-1.88-2.84h-.87v2.84h-2.56zm4 4.5c.87 0 1.39-.43 1.39-1.11 0-.75-.54-1.12-1.4-1.12h-1.44v2.26z"], ["d", "m49.59 43h2.5l4 9.44h-2.79l-.67-1.69h-3.63l-.67 1.69h-2.71zm2.27 5.73-1-2.65-1.06 2.65z"], ["d", "m56.46 43.05h2.6v9.37h-2.6z"], ["d", "m60.06 43.05h2.42l3.37 5v-5h2.57v9.37h-2.26l-3.53-5.14v5.14h-2.57z"], ["d", "m68.86 51 1.45-1.73a4.84 4.84 0 0 0 3 1.13c.71 0 1.08-.24 1.08-.65 0-.4-.31-.6-1.59-.91-2-.46-3.53-1-3.53-2.93 0-1.74 1.37-3 3.62-3a5.89 5.89 0 0 1 3.86 1.25l-1.26 1.84a4.63 4.63 0 0 0 -2.62-.92c-.63 0-.94.25-.94.6 0 .42.32.61 1.63.91 2.14.46 3.44 1.16 3.44 2.91 0 1.91-1.51 3-3.79 3a6.58 6.58 0 0 1 -4.35-1.5z"], ["id", "nx-cloud", 1, "rounded", "shadow"], ["id", "nx-cloud-logo", "role", "img", "xmlns", "http://www.w3.org/2000/svg", "stroke", "currentColor", "fill", "transparent", "viewBox", "0 0 24 24"], ["stroke-width", "2", "d", "M23 3.75V6.5c-3.036 0-5.5 2.464-5.5 5.5s-2.464 5.5-5.5 5.5-5.5 2.464-5.5 5.5H3.75C2.232 23 1 21.768 1 20.25V3.75C1 2.232 2.232 1 3.75 1h16.5C21.768 1 23 2.232 23 3.75Z"], ["stroke-width", "2", "d", "M23 6v14.1667C23 21.7307 21.7307 23 20.1667 23H6c0-3.128 2.53867-5.6667 5.6667-5.6667 3.128 0 5.6666-2.5386 5.6666-5.6666C17.3333 8.53867 19.872 6 23 6Z"], ["href", "https://nx.dev/nx-cloud?utm_source=nx-project", "target", "_blank", "rel", "noreferrer"], ["id", "commands", 1, "rounded", "shadow"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"], ["strokeLinecap", "round", "strokeLinejoin", "round", "strokeWidth", "2", "d", "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"], ["id", "love"], ["fill", "currentColor", "stroke", "none", "viewBox", "0 0 24 24", "xmlns", "http://www.w3.org/2000/svg"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"]], template: function NxWelcome_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1")(4, "span");
      \u0275\u0275text(5, " Hello there, ");
      \u0275\u0275elementEnd();
      \u0275\u0275text(6, " Welcome web \u{1F44B} ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 3)(8, "div", 4)(9, "h2");
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(10, "svg", 5);
      \u0275\u0275element(11, "path", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(12, "span");
      \u0275\u0275text(13, "You're up and running");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "a", 7);
      \u0275\u0275text(15, " What's next? ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 8);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(17, "svg", 9);
      \u0275\u0275element(18, "path", 10);
      \u0275\u0275elementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(19, "div", 11)(20, "div", 12)(21, "div", 13)(22, "h2");
      \u0275\u0275text(23, "Learning materials");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "a", 14);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(25, "svg", 5);
      \u0275\u0275element(26, "path", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(27, "span");
      \u0275\u0275text(28, " Documentation ");
      \u0275\u0275elementStart(29, "span");
      \u0275\u0275text(30, " Everything is in there ");
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(31, "svg", 5);
      \u0275\u0275element(32, "path", 16);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(33, "a", 17);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(34, "svg", 5);
      \u0275\u0275element(35, "path", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(36, "span");
      \u0275\u0275text(37, " Blog ");
      \u0275\u0275elementStart(38, "span");
      \u0275\u0275text(39, " Changelog, features & events ");
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(40, "svg", 5);
      \u0275\u0275element(41, "path", 16);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(42, "a", 19);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(43, "svg", 20)(44, "title");
      \u0275\u0275text(45, "YouTube");
      \u0275\u0275elementEnd();
      \u0275\u0275element(46, "path", 21);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(47, "span");
      \u0275\u0275text(48, " YouTube channel ");
      \u0275\u0275elementStart(49, "span");
      \u0275\u0275text(50, " Nx Show, talks & tutorials ");
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(51, "svg", 5);
      \u0275\u0275element(52, "path", 16);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(53, "a", 22);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(54, "svg", 5);
      \u0275\u0275element(55, "path", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(56, "span");
      \u0275\u0275text(57, " Interactive tutorials ");
      \u0275\u0275elementStart(58, "span");
      \u0275\u0275text(59, " Create an app, step-by-step ");
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(60, "svg", 5);
      \u0275\u0275element(61, "path", 16);
      \u0275\u0275elementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(62, "a", 24);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(63, "svg", 9);
      \u0275\u0275element(64, "path", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(65, "span");
      \u0275\u0275text(66, " Nx is open source ");
      \u0275\u0275elementStart(67, "span");
      \u0275\u0275text(68, " Love Nx? Give us a star! ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(69, "div", 26)(70, "a", 27);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(71, "svg", 9)(72, "title");
      \u0275\u0275text(73, "Visual Studio Code");
      \u0275\u0275elementEnd();
      \u0275\u0275element(74, "path", 28);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(75, "span");
      \u0275\u0275text(76, " Install Nx Console for VSCode ");
      \u0275\u0275elementStart(77, "span");
      \u0275\u0275text(78, "The official VSCode extension for Nx.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(79, "a", 29);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(80, "svg", 30);
      \u0275\u0275element(81, "path", 31);
      \u0275\u0275elementStart(82, "g", 32);
      \u0275\u0275element(83, "path", 33)(84, "path", 34)(85, "path", 35)(86, "path", 36)(87, "path", 37)(88, "path", 38)(89, "path", 39)(90, "path", 40)(91, "path", 41)(92, "path", 42);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(93, "span");
      \u0275\u0275text(94, " Install Nx Console for JetBrains ");
      \u0275\u0275elementStart(95, "span");
      \u0275\u0275text(96, "Available for WebStorm, Intellij IDEA Ultimate and more!");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(97, "div", 43)(98, "div");
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(99, "svg", 44);
      \u0275\u0275element(100, "path", 45)(101, "path", 46);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(102, "h2");
      \u0275\u0275text(103, " Nx Cloud ");
      \u0275\u0275elementStart(104, "span");
      \u0275\u0275text(105, " Enable faster CI & better DX ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(106, "p");
      \u0275\u0275text(107, " You can activate distributed tasks executions and caching by running: ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(108, "pre");
      \u0275\u0275text(109, "nx connect");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "a", 47);
      \u0275\u0275text(111, " What is Nx Cloud? ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(112, "div", 48)(113, "h2");
      \u0275\u0275text(114, "Next steps");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(115, "p");
      \u0275\u0275text(116, "Here are some things you can do with Nx:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(117, "details")(118, "summary");
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(119, "svg", 5);
      \u0275\u0275element(120, "path", 49);
      \u0275\u0275elementEnd();
      \u0275\u0275text(121, " Build, test and lint your app ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(122, "pre")(123, "span");
      \u0275\u0275text(124, "# Build");
      \u0275\u0275elementEnd();
      \u0275\u0275text(125, "\nnx build \n");
      \u0275\u0275elementStart(126, "span");
      \u0275\u0275text(127, "# Test");
      \u0275\u0275elementEnd();
      \u0275\u0275text(128, "\nnx test \n");
      \u0275\u0275elementStart(129, "span");
      \u0275\u0275text(130, "# Lint");
      \u0275\u0275elementEnd();
      \u0275\u0275text(131, "\nnx lint \n");
      \u0275\u0275elementStart(132, "span");
      \u0275\u0275text(133, "# Run them together!");
      \u0275\u0275elementEnd();
      \u0275\u0275text(134, "\nnx run-many -t build test lint");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(135, "details")(136, "summary");
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(137, "svg", 5);
      \u0275\u0275element(138, "path", 50);
      \u0275\u0275elementEnd();
      \u0275\u0275text(139, " View project details ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(140, "pre");
      \u0275\u0275text(141, "nx show project web");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(142, "details")(143, "summary");
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(144, "svg", 5);
      \u0275\u0275element(145, "path", 49);
      \u0275\u0275elementEnd();
      \u0275\u0275text(146, " View interactive project graph ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(147, "pre");
      \u0275\u0275text(148, "nx graph");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(149, "details")(150, "summary");
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(151, "svg", 5);
      \u0275\u0275element(152, "path", 49);
      \u0275\u0275elementEnd();
      \u0275\u0275text(153, " Add UI library ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(154, "pre")(155, "span");
      \u0275\u0275text(156, "# Generate UI lib");
      \u0275\u0275elementEnd();
      \u0275\u0275text(157, "\nnx g @nx/angular:lib ui\n");
      \u0275\u0275elementStart(158, "span");
      \u0275\u0275text(159, "# Add a component");
      \u0275\u0275elementEnd();
      \u0275\u0275text(160, "\nnx g @nx/angular:component ui/src/lib/button");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(161, "p", 51);
      \u0275\u0275text(162, " Carefully crafted with ");
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(163, "svg", 52);
      \u0275\u0275element(164, "path", 53);
      \u0275\u0275elementEnd()()()();
    }
  }, dependencies: [CommonModule], styles: ['/* angular:styles/component:css;8052d53e1ae4d631b2ede52bbd2e26187318fec0b66f51c5fbf7e891e53c748d;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/apps/web/src/app/nx-welcome.ts */\nhtml {\n  -webkit-text-size-adjust: 100%;\n  font-family:\n    ui-sans-serif,\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial,\n    "Noto Sans",\n    sans-serif,\n    "Apple Color Emoji",\n    "Segoe UI Emoji",\n    "Segoe UI Symbol",\n    "Noto Color Emoji";\n  line-height: 1.5;\n  tab-size: 4;\n  scroll-behavior: smooth;\n}\nbody {\n  font-family: inherit;\n  line-height: inherit;\n  margin: 0;\n}\nh1,\nh2,\np,\npre {\n  margin: 0;\n}\n*,\n::before,\n::after {\n  box-sizing: border-box;\n  border-width: 0;\n  border-style: solid;\n  border-color: currentColor;\n}\nh1,\nh2 {\n  font-size: inherit;\n  font-weight: inherit;\n}\na {\n  color: inherit;\n  text-decoration: inherit;\n}\npre {\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    "Courier New",\n    monospace;\n}\nsvg {\n  display: block;\n  vertical-align: middle;\n}\nsvg {\n  shape-rendering: auto;\n  text-rendering: optimizeLegibility;\n}\npre {\n  background-color: rgba(55, 65, 81, 1);\n  border-radius: 0.25rem;\n  color: rgba(229, 231, 235, 1);\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    "Courier New",\n    monospace;\n  overflow: auto;\n  padding: 0.5rem 0.75rem;\n}\n.shadow {\n  box-shadow:\n    0 0 #0000,\n    0 0 #0000,\n    0 10px 15px -3px rgba(0, 0, 0, 0.1),\n    0 4px 6px -2px rgba(0, 0, 0, 0.05);\n}\n.rounded {\n  border-radius: 1.5rem;\n}\n.wrapper {\n  width: 100%;\n}\n.container {\n  margin-left: auto;\n  margin-right: auto;\n  max-width: 768px;\n  padding-bottom: 3rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  color: rgba(55, 65, 81, 1);\n  width: 100%;\n}\n#welcome {\n  margin-top: 2.5rem;\n}\n#welcome h1 {\n  font-size: 3rem;\n  font-weight: 500;\n  letter-spacing: -0.025em;\n  line-height: 1;\n}\n#welcome span {\n  display: block;\n  font-size: 1.875rem;\n  font-weight: 300;\n  line-height: 2.25rem;\n  margin-bottom: 0.5rem;\n}\n#hero {\n  align-items: center;\n  background-color: hsla(214, 62%, 21%, 1);\n  border: none;\n  box-sizing: border-box;\n  color: rgba(55, 65, 81, 1);\n  display: grid;\n  grid-template-columns: 1fr;\n  margin-top: 3.5rem;\n}\n#hero .text-container {\n  color: rgba(255, 255, 255, 1);\n  padding: 3rem 2rem;\n}\n#hero .text-container h2 {\n  font-size: 1.5rem;\n  line-height: 2rem;\n  position: relative;\n}\n#hero .text-container h2 svg {\n  color: hsla(162, 47%, 50%, 1);\n  height: 2rem;\n  left: -0.25rem;\n  position: absolute;\n  top: 0;\n  width: 2rem;\n}\n#hero .text-container h2 span {\n  margin-left: 2.5rem;\n}\n#hero .text-container a {\n  background-color: rgba(255, 255, 255, 1);\n  border-radius: 0.75rem;\n  color: rgba(55, 65, 81, 1);\n  display: inline-block;\n  margin-top: 1.5rem;\n  padding: 1rem 2rem;\n  text-decoration: inherit;\n}\n#hero .logo-container {\n  display: none;\n  justify-content: center;\n  padding-left: 2rem;\n  padding-right: 2rem;\n}\n#hero .logo-container svg {\n  color: rgba(255, 255, 255, 1);\n  width: 66.666667%;\n}\n#middle-content {\n  align-items: flex-start;\n  display: grid;\n  grid-template-columns: 1fr;\n  margin-top: 3.5rem;\n}\n#middle-content #middle-left-content {\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n}\n#learning-materials {\n  padding: 2.5rem 2rem;\n}\n#learning-materials h2 {\n  font-weight: 500;\n  font-size: 1.25rem;\n  letter-spacing: -0.025em;\n  line-height: 1.75rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.list-item-link {\n  align-items: center;\n  border-radius: 0.75rem;\n  display: flex;\n  margin-top: 1rem;\n  padding: 1rem;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n  width: 100%;\n}\n.list-item-link svg:first-child {\n  margin-right: 1rem;\n  height: 1.5rem;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n  width: 1.5rem;\n}\n.list-item-link > span {\n  flex-grow: 1;\n  font-weight: 400;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n.list-item-link > span > span {\n  color: rgba(107, 114, 128, 1);\n  display: block;\n  flex-grow: 1;\n  font-size: 0.75rem;\n  font-weight: 300;\n  line-height: 1rem;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n.list-item-link svg:last-child {\n  height: 1rem;\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n  width: 1rem;\n}\n.list-item-link:hover {\n  color: rgba(255, 255, 255, 1);\n  background-color: hsla(162, 55%, 33%, 1);\n}\n.list-item-link:hover > span > span {\n  color: rgba(243, 244, 246, 1);\n}\n.list-item-link:hover svg:last-child {\n  transform: translateX(0.25rem);\n}\n.button-pill {\n  padding: 1.5rem 2rem;\n  margin-bottom: 2rem;\n  transition-duration: 300ms;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  align-items: center;\n  display: flex;\n}\n.button-pill svg {\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n  flex-shrink: 0;\n  width: 3rem;\n}\n.button-pill > span {\n  letter-spacing: -0.025em;\n  font-weight: 400;\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.button-pill span span {\n  display: block;\n  font-size: 0.875rem;\n  font-weight: 300;\n  line-height: 1.25rem;\n}\n.button-pill:hover svg,\n.button-pill:hover {\n  color: rgba(255, 255, 255, 1) !important;\n}\n.nx-console:hover {\n  background-color: rgba(0, 122, 204, 1);\n}\n.nx-console svg {\n  color: rgba(0, 122, 204, 1);\n}\n.nx-console-jetbrains {\n  margin-top: 2rem;\n}\n.nx-console-jetbrains:hover {\n  background-color: rgba(255, 49, 140, 1);\n}\n.nx-console-jetbrains svg {\n  color: rgba(255, 49, 140, 1);\n}\n#nx-repo:hover {\n  background-color: rgba(24, 23, 23, 1);\n}\n#nx-repo svg {\n  color: rgba(24, 23, 23, 1);\n}\n#nx-cloud {\n  margin-bottom: 2rem;\n  margin-top: 2rem;\n  padding: 2.5rem 2rem;\n}\n#nx-cloud > div {\n  align-items: center;\n  display: flex;\n}\n#nx-cloud > div svg {\n  border-radius: 0.375rem;\n  flex-shrink: 0;\n  width: 3rem;\n}\n#nx-cloud > div h2 {\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -0.025em;\n  line-height: 1.75rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n#nx-cloud > div h2 span {\n  display: block;\n  font-size: 0.875rem;\n  font-weight: 300;\n  line-height: 1.25rem;\n}\n#nx-cloud p {\n  font-size: 1rem;\n  line-height: 1.5rem;\n  margin-top: 1rem;\n}\n#nx-cloud pre {\n  margin-top: 1rem;\n}\n#nx-cloud a {\n  color: rgba(107, 114, 128, 1);\n  display: block;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  margin-top: 1.5rem;\n  text-align: right;\n}\n#nx-cloud a:hover {\n  text-decoration: underline;\n}\n#commands {\n  padding: 2.5rem 2rem;\n  margin-top: 3.5rem;\n}\n#commands h2 {\n  font-size: 1.25rem;\n  font-weight: 400;\n  letter-spacing: -0.025em;\n  line-height: 1.75rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n#commands p {\n  font-size: 1rem;\n  font-weight: 300;\n  line-height: 1.5rem;\n  margin-top: 1rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\ndetails {\n  align-items: center;\n  display: flex;\n  margin-top: 1rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  width: 100%;\n}\ndetails pre > span {\n  color: rgba(181, 181, 181, 1);\n}\nsummary {\n  border-radius: 0.5rem;\n  display: flex;\n  font-weight: 400;\n  padding: 0.5rem;\n  cursor: pointer;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\nsummary:hover {\n  background-color: rgba(243, 244, 246, 1);\n}\nsummary svg {\n  height: 1.5rem;\n  margin-right: 1rem;\n  width: 1.5rem;\n}\n#love {\n  color: rgba(107, 114, 128, 1);\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  margin-top: 3.5rem;\n  opacity: 0.6;\n  text-align: center;\n}\n#love svg {\n  color: rgba(252, 165, 165, 1);\n  width: 1.25rem;\n  height: 1.25rem;\n  display: inline;\n  margin-top: -0.25rem;\n}\n@media screen and (min-width: 768px) {\n  #hero {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  #hero .logo-container {\n    display: flex;\n  }\n  #middle-content {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 4rem;\n  }\n}\n/*# sourceMappingURL=nx-welcome.css.map */\n'], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NxWelcome, [{
    type: Component,
    args: [{ selector: "app-nx-welcome", imports: [CommonModule], template: `
    <!--
     * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     This is a starter component and can be deleted.
     * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     Delete this file and get started with your project!
     * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     -->

    <style>
      html {
        -webkit-text-size-adjust: 100%;
        font-family:
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          'Helvetica Neue',
          Arial,
          'Noto Sans',
          sans-serif,
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji';
        line-height: 1.5;
        tab-size: 4;
        scroll-behavior: smooth;
      }
      body {
        font-family: inherit;
        line-height: inherit;
        margin: 0;
      }
      h1,
      h2,
      p,
      pre {
        margin: 0;
      }
      *,
      ::before,
      ::after {
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        border-color: currentColor;
      }
      h1,
      h2 {
        font-size: inherit;
        font-weight: inherit;
      }
      a {
        color: inherit;
        text-decoration: inherit;
      }
      pre {
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
      }
      svg {
        display: block;
        vertical-align: middle;
      }
      svg {
        shape-rendering: auto;
        text-rendering: optimizeLegibility;
      }
      pre {
        background-color: rgba(55, 65, 81, 1);
        border-radius: 0.25rem;
        color: rgba(229, 231, 235, 1);
        font-family:
          ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        overflow: auto;
        padding: 0.5rem 0.75rem;
      }
      .shadow {
        box-shadow:
          0 0 #0000,
          0 0 #0000,
          0 10px 15px -3px rgba(0, 0, 0, 0.1),
          0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      .rounded {
        border-radius: 1.5rem;
      }
      .wrapper {
        width: 100%;
      }
      .container {
        margin-left: auto;
        margin-right: auto;
        max-width: 768px;
        padding-bottom: 3rem;
        padding-left: 1rem;
        padding-right: 1rem;
        color: rgba(55, 65, 81, 1);
        width: 100%;
      }
      #welcome {
        margin-top: 2.5rem;
      }
      #welcome h1 {
        font-size: 3rem;
        font-weight: 500;
        letter-spacing: -0.025em;
        line-height: 1;
      }
      #welcome span {
        display: block;
        font-size: 1.875rem;
        font-weight: 300;
        line-height: 2.25rem;
        margin-bottom: 0.5rem;
      }
      #hero {
        align-items: center;
        background-color: hsla(214, 62%, 21%, 1);
        border: none;
        box-sizing: border-box;
        color: rgba(55, 65, 81, 1);
        display: grid;
        grid-template-columns: 1fr;
        margin-top: 3.5rem;
      }
      #hero .text-container {
        color: rgba(255, 255, 255, 1);
        padding: 3rem 2rem;
      }
      #hero .text-container h2 {
        font-size: 1.5rem;
        line-height: 2rem;
        position: relative;
      }
      #hero .text-container h2 svg {
        color: hsla(162, 47%, 50%, 1);
        height: 2rem;
        left: -0.25rem;
        position: absolute;
        top: 0;
        width: 2rem;
      }
      #hero .text-container h2 span {
        margin-left: 2.5rem;
      }
      #hero .text-container a {
        background-color: rgba(255, 255, 255, 1);
        border-radius: 0.75rem;
        color: rgba(55, 65, 81, 1);
        display: inline-block;
        margin-top: 1.5rem;
        padding: 1rem 2rem;
        text-decoration: inherit;
      }
      #hero .logo-container {
        display: none;
        justify-content: center;
        padding-left: 2rem;
        padding-right: 2rem;
      }
      #hero .logo-container svg {
        color: rgba(255, 255, 255, 1);
        width: 66.666667%;
      }
      #middle-content {
        align-items: flex-start;
        display: grid;
        grid-template-columns: 1fr;
        margin-top: 3.5rem;
      }
      #middle-content #middle-left-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      #learning-materials {
        padding: 2.5rem 2rem;
      }
      #learning-materials h2 {
        font-weight: 500;
        font-size: 1.25rem;
        letter-spacing: -0.025em;
        line-height: 1.75rem;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      .list-item-link {
        align-items: center;
        border-radius: 0.75rem;
        display: flex;
        margin-top: 1rem;
        padding: 1rem;
        transition-property:
          background-color,
          border-color,
          color,
          fill,
          stroke,
          opacity,
          box-shadow,
          transform,
          filter,
          backdrop-filter,
          -webkit-backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        width: 100%;
      }
      .list-item-link svg:first-child {
        margin-right: 1rem;
        height: 1.5rem;
        transition-property:
          background-color,
          border-color,
          color,
          fill,
          stroke,
          opacity,
          box-shadow,
          transform,
          filter,
          backdrop-filter,
          -webkit-backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        width: 1.5rem;
      }
      .list-item-link > span {
        flex-grow: 1;
        font-weight: 400;
        transition-property:
          background-color,
          border-color,
          color,
          fill,
          stroke,
          opacity,
          box-shadow,
          transform,
          filter,
          backdrop-filter,
          -webkit-backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }
      .list-item-link > span > span {
        color: rgba(107, 114, 128, 1);
        display: block;
        flex-grow: 1;
        font-size: 0.75rem;
        font-weight: 300;
        line-height: 1rem;
        transition-property:
          background-color,
          border-color,
          color,
          fill,
          stroke,
          opacity,
          box-shadow,
          transform,
          filter,
          backdrop-filter,
          -webkit-backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }
      .list-item-link svg:last-child {
        height: 1rem;
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        width: 1rem;
      }
      .list-item-link:hover {
        color: rgba(255, 255, 255, 1);
        background-color: hsla(162, 55%, 33%, 1);
      }

      .list-item-link:hover > span > span {
        color: rgba(243, 244, 246, 1);
      }
      .list-item-link:hover svg:last-child {
        transform: translateX(0.25rem);
      }

      .button-pill {
        padding: 1.5rem 2rem;
        margin-bottom: 2rem;
        transition-duration: 300ms;
        transition-property:
          background-color,
          border-color,
          color,
          fill,
          stroke,
          opacity,
          box-shadow,
          transform,
          filter,
          backdrop-filter,
          -webkit-backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        align-items: center;
        display: flex;
      }
      .button-pill svg {
        transition-property:
          background-color,
          border-color,
          color,
          fill,
          stroke,
          opacity,
          box-shadow,
          transform,
          filter,
          backdrop-filter,
          -webkit-backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        flex-shrink: 0;
        width: 3rem;
      }
      .button-pill > span {
        letter-spacing: -0.025em;
        font-weight: 400;
        font-size: 1.125rem;
        line-height: 1.75rem;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      .button-pill span span {
        display: block;
        font-size: 0.875rem;
        font-weight: 300;
        line-height: 1.25rem;
      }
      .button-pill:hover svg,
      .button-pill:hover {
        color: rgba(255, 255, 255, 1) !important;
      }
      .nx-console:hover {
        background-color: rgba(0, 122, 204, 1);
      }
      .nx-console svg {
        color: rgba(0, 122, 204, 1);
      }
      .nx-console-jetbrains {
        margin-top: 2rem;
      }
      .nx-console-jetbrains:hover {
        background-color: rgba(255, 49, 140, 1);
      }
      .nx-console-jetbrains svg {
        color: rgba(255, 49, 140, 1);
      }
      #nx-repo:hover {
        background-color: rgba(24, 23, 23, 1);
      }
      #nx-repo svg {
        color: rgba(24, 23, 23, 1);
      }
      #nx-cloud {
        margin-bottom: 2rem;
        margin-top: 2rem;
        padding: 2.5rem 2rem;
      }
      #nx-cloud > div {
        align-items: center;
        display: flex;
      }
      #nx-cloud > div svg {
        border-radius: 0.375rem;
        flex-shrink: 0;
        width: 3rem;
      }
      #nx-cloud > div h2 {
        font-size: 1.125rem;
        font-weight: 400;
        letter-spacing: -0.025em;
        line-height: 1.75rem;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      #nx-cloud > div h2 span {
        display: block;
        font-size: 0.875rem;
        font-weight: 300;
        line-height: 1.25rem;
      }
      #nx-cloud p {
        font-size: 1rem;
        line-height: 1.5rem;
        margin-top: 1rem;
      }
      #nx-cloud pre {
        margin-top: 1rem;
      }
      #nx-cloud a {
        color: rgba(107, 114, 128, 1);
        display: block;
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-top: 1.5rem;
        text-align: right;
      }
      #nx-cloud a:hover {
        text-decoration: underline;
      }
      #commands {
        padding: 2.5rem 2rem;
        margin-top: 3.5rem;
      }
      #commands h2 {
        font-size: 1.25rem;
        font-weight: 400;
        letter-spacing: -0.025em;
        line-height: 1.75rem;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      #commands p {
        font-size: 1rem;
        font-weight: 300;
        line-height: 1.5rem;
        margin-top: 1rem;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      details {
        align-items: center;
        display: flex;
        margin-top: 1rem;
        padding-left: 1rem;
        padding-right: 1rem;
        width: 100%;
      }
      details pre > span {
        color: rgba(181, 181, 181, 1);
      }
      summary {
        border-radius: 0.5rem;
        display: flex;
        font-weight: 400;
        padding: 0.5rem;
        cursor: pointer;
        transition-property:
          background-color,
          border-color,
          color,
          fill,
          stroke,
          opacity,
          box-shadow,
          transform,
          filter,
          backdrop-filter,
          -webkit-backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }
      summary:hover {
        background-color: rgba(243, 244, 246, 1);
      }
      summary svg {
        height: 1.5rem;
        margin-right: 1rem;
        width: 1.5rem;
      }
      #love {
        color: rgba(107, 114, 128, 1);
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-top: 3.5rem;
        opacity: 0.6;
        text-align: center;
      }
      #love svg {
        color: rgba(252, 165, 165, 1);
        width: 1.25rem;
        height: 1.25rem;
        display: inline;
        margin-top: -0.25rem;
      }
      @media screen and (min-width: 768px) {
        #hero {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #hero .logo-container {
          display: flex;
        }
        #middle-content {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 4rem;
        }
      }
    </style>

    <div class="wrapper">
      <div class="container">
        <!--  WELCOME  -->
        <div id="welcome">
          <h1>
            <span> Hello there, </span>
            Welcome web \u{1F44B}
          </h1>
        </div>
        <!--  HERO  -->
        <div id="hero" class="rounded">
          <div class="text-container">
            <h2>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span>You&apos;re up and running</span>
            </h2>
            <a href="#commands"> What&apos;s next? </a>
          </div>
          <div class="logo-container">
            <svg
              fill="currentColor"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.987 14.138l-3.132 4.923-5.193-8.427-.012 8.822H0V4.544h3.691l5.247 8.833.005-3.998 3.044 4.759zm.601-5.761c.024-.048 0-3.784.008-3.833h-3.65c.002.059-.005 3.776-.003 3.833h3.645zm5.634 4.134a2.061 2.061 0 0 0-1.969 1.336 1.963 1.963 0 0 1 2.343-.739c.396.161.917.422 1.33.283a2.1 2.1 0 0 0-1.704-.88zm3.39 1.061c-.375-.13-.8-.277-1.109-.681-.06-.08-.116-.17-.176-.265a2.143 2.143 0 0 0-.533-.642c-.294-.216-.68-.322-1.18-.322a2.482 2.482 0 0 0-2.294 1.536 2.325 2.325 0 0 1 4.002.388.75.75 0 0 0 .836.334c.493-.105.46.36 1.203.518v-.133c-.003-.446-.246-.55-.75-.733zm2.024 1.266a.723.723 0 0 0 .347-.638c-.01-2.957-2.41-5.487-5.37-5.487a5.364 5.364 0 0 0-4.487 2.418c-.01-.026-1.522-2.39-1.538-2.418H8.943l3.463 5.423-3.379 5.32h3.54l1.54-2.366 1.568 2.366h3.541l-3.21-5.052a.7.7 0 0 1-.084-.32 2.69 2.69 0 0 1 2.69-2.691h.001c1.488 0 1.736.89 2.057 1.308.634.826 1.9.464 1.9 1.541a.707.707 0 0 0 1.066.596zm.35.133c-.173.372-.56.338-.755.639-.176.271.114.412.114.412s.337.156.538-.311c.104-.231.14-.488.103-.74z"
              />
            </svg>
          </div>
        </div>
        <!--  MIDDLE CONTENT  -->
        <div id="middle-content">
          <div id="middle-left-content">
            <div id="learning-materials" class="rounded shadow">
              <h2>Learning materials</h2>
              <a
                href="https://nx.dev/getting-started/intro?utm_source=nx-project"
                target="_blank"
                rel="noreferrer"
                class="list-item-link"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>
                  Documentation
                  <span> Everything is in there </span>
                </span>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
              <a
                href="https://nx.dev/blog?utm_source=nx-project"
                target="_blank"
                rel="noreferrer"
                class="list-item-link"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <span>
                  Blog
                  <span> Changelog, features & events </span>
                </span>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@NxDevtools/videos?utm_source=nx-project&sub_confirmation=1"
                target="_blank"
                rel="noreferrer"
                class="list-item-link"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>YouTube</title>
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
                <span>
                  YouTube channel
                  <span> Nx Show, talks & tutorials </span>
                </span>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
              <a
                href="https://nx.dev/getting-started/tutorials/angular-standalone-tutorial?utm_source=nx-project"
                target="_blank"
                rel="noreferrer"
                class="list-item-link"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                <span>
                  Interactive tutorials
                  <span> Create an app, step-by-step </span>
                </span>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
            <a
              id="nx-repo"
              class="button-pill rounded shadow"
              href="https://github.com/nrwl/nx?utm_source=nx-project"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                fill="currentColor"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
              <span>
                Nx is open source
                <span> Love Nx? Give us a star! </span>
              </span>
            </a>
          </div>
          <div id="other-links">
            <a
              class="button-pill rounded shadow nx-console"
              href="https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console&utm_source=nx-project"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                fill="currentColor"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Visual Studio Code</title>
                <path
                  d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
                />
              </svg>
              <span>
                Install Nx Console for VSCode
                <span>The official VSCode extension for Nx.</span>
              </span>
            </a>
            <a
              class="button-pill rounded shadow nx-console-jetbrains"
              href="https://plugins.jetbrains.com/plugin/21060-nx-console"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                height="48"
                width="48"
                viewBox="20 20 60 60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m22.5 22.5h60v60h-60z" />
                <g fill="#fff">
                  <path d="m29.03 71.25h22.5v3.75h-22.5z" />
                  <path
                    d="m28.09 38 1.67-1.58a1.88 1.88 0 0 0 1.47.87c.64 0 1.06-.44 1.06-1.31v-5.98h2.58v6a3.48 3.48 0 0 1 -.87 2.6 3.56 3.56 0 0 1 -2.57.95 3.84 3.84 0 0 1 -3.34-1.55z"
                  />
                  <path
                    d="m36 30h7.53v2.19h-5v1.44h4.49v2h-4.42v1.49h5v2.21h-7.6z"
                  />
                  <path d="m47.23 32.29h-2.8v-2.29h8.21v2.27h-2.81v7.1h-2.6z" />
                  <path
                    d="m29.13 43.08h4.42a3.53 3.53 0 0 1 2.55.83 2.09 2.09 0 0 1 .6 1.53 2.16 2.16 0 0 1 -1.44 2.09 2.27 2.27 0 0 1 1.86 2.29c0 1.61-1.31 2.59-3.55 2.59h-4.44zm5 2.89c0-.52-.42-.8-1.18-.8h-1.29v1.64h1.24c.79 0 1.25-.26 1.25-.81zm-.9 2.66h-1.57v1.73h1.62c.8 0 1.24-.31 1.24-.86 0-.5-.4-.87-1.27-.87z"
                  />
                  <path
                    d="m38 43.08h4.1a4.19 4.19 0 0 1 3 1 2.93 2.93 0 0 1 .9 2.19 3 3 0 0 1 -1.93 2.89l2.24 3.27h-3l-1.88-2.84h-.87v2.84h-2.56zm4 4.5c.87 0 1.39-.43 1.39-1.11 0-.75-.54-1.12-1.4-1.12h-1.44v2.26z"
                  />
                  <path
                    d="m49.59 43h2.5l4 9.44h-2.79l-.67-1.69h-3.63l-.67 1.69h-2.71zm2.27 5.73-1-2.65-1.06 2.65z"
                  />
                  <path d="m56.46 43.05h2.6v9.37h-2.6z" />
                  <path
                    d="m60.06 43.05h2.42l3.37 5v-5h2.57v9.37h-2.26l-3.53-5.14v5.14h-2.57z"
                  />
                  <path
                    d="m68.86 51 1.45-1.73a4.84 4.84 0 0 0 3 1.13c.71 0 1.08-.24 1.08-.65 0-.4-.31-.6-1.59-.91-2-.46-3.53-1-3.53-2.93 0-1.74 1.37-3 3.62-3a5.89 5.89 0 0 1 3.86 1.25l-1.26 1.84a4.63 4.63 0 0 0 -2.62-.92c-.63 0-.94.25-.94.6 0 .42.32.61 1.63.91 2.14.46 3.44 1.16 3.44 2.91 0 1.91-1.51 3-3.79 3a6.58 6.58 0 0 1 -4.35-1.5z"
                  />
                </g>
              </svg>
              <span>
                Install Nx Console for JetBrains
                <span
                  >Available for WebStorm, Intellij IDEA Ultimate and
                  more!</span
                >
              </span>
            </a>
            <div id="nx-cloud" class="rounded shadow">
              <div>
                <svg
                  id="nx-cloud-logo"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  fill="transparent"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-width="2"
                    d="M23 3.75V6.5c-3.036 0-5.5 2.464-5.5 5.5s-2.464 5.5-5.5 5.5-5.5 2.464-5.5 5.5H3.75C2.232 23 1 21.768 1 20.25V3.75C1 2.232 2.232 1 3.75 1h16.5C21.768 1 23 2.232 23 3.75Z"
                  />
                  <path
                    stroke-width="2"
                    d="M23 6v14.1667C23 21.7307 21.7307 23 20.1667 23H6c0-3.128 2.53867-5.6667 5.6667-5.6667 3.128 0 5.6666-2.5386 5.6666-5.6666C17.3333 8.53867 19.872 6 23 6Z"
                  />
                </svg>
                <h2>
                  Nx Cloud
                  <span> Enable faster CI & better DX </span>
                </h2>
              </div>
              <p>
                You can activate distributed tasks executions and caching by
                running:
              </p>
              <pre>nx connect</pre>
              <a
                href="https://nx.dev/nx-cloud?utm_source=nx-project"
                target="_blank"
                rel="noreferrer"
              >
                What is Nx Cloud?
              </a>
            </div>
          </div>
        </div>
        <!--  COMMANDS  -->
        <div id="commands" class="rounded shadow">
          <h2>Next steps</h2>
          <p>Here are some things you can do with Nx:</p>
          <details>
            <summary>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Build, test and lint your app
            </summary>
            <pre><span># Build</span>
nx build 
<span># Test</span>
nx test 
<span># Lint</span>
nx lint 
<span># Run them together!</span>
nx run-many -t build test lint</pre>
          </details>
          <details>
            <summary>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View project details
            </summary>
            <pre>nx show project web</pre>
          </details>

          <details>
            <summary>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View interactive project graph
            </summary>
            <pre>nx graph</pre>
          </details>

          <details>
            <summary>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Add UI library
            </summary>
            <pre><span># Generate UI lib</span>
nx g &#64;nx/angular:lib ui
<span># Add a component</span>
nx g &#64;nx/angular:component ui/src/lib/button</pre>
          </details>
        </div>
        <p id="love">
          Carefully crafted with
          <svg
            fill="currentColor"
            stroke="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </p>
      </div>
    </div>
  `, encapsulation: ViewEncapsulation.None, styles: ['/* angular:styles/component:css;8052d53e1ae4d631b2ede52bbd2e26187318fec0b66f51c5fbf7e891e53c748d;C:/Users/Simon/Desktop/web-entwicklung/submodules/saas-nx-template/apps/web/src/app/nx-welcome.ts */\nhtml {\n  -webkit-text-size-adjust: 100%;\n  font-family:\n    ui-sans-serif,\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial,\n    "Noto Sans",\n    sans-serif,\n    "Apple Color Emoji",\n    "Segoe UI Emoji",\n    "Segoe UI Symbol",\n    "Noto Color Emoji";\n  line-height: 1.5;\n  tab-size: 4;\n  scroll-behavior: smooth;\n}\nbody {\n  font-family: inherit;\n  line-height: inherit;\n  margin: 0;\n}\nh1,\nh2,\np,\npre {\n  margin: 0;\n}\n*,\n::before,\n::after {\n  box-sizing: border-box;\n  border-width: 0;\n  border-style: solid;\n  border-color: currentColor;\n}\nh1,\nh2 {\n  font-size: inherit;\n  font-weight: inherit;\n}\na {\n  color: inherit;\n  text-decoration: inherit;\n}\npre {\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    "Courier New",\n    monospace;\n}\nsvg {\n  display: block;\n  vertical-align: middle;\n}\nsvg {\n  shape-rendering: auto;\n  text-rendering: optimizeLegibility;\n}\npre {\n  background-color: rgba(55, 65, 81, 1);\n  border-radius: 0.25rem;\n  color: rgba(229, 231, 235, 1);\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    "Courier New",\n    monospace;\n  overflow: auto;\n  padding: 0.5rem 0.75rem;\n}\n.shadow {\n  box-shadow:\n    0 0 #0000,\n    0 0 #0000,\n    0 10px 15px -3px rgba(0, 0, 0, 0.1),\n    0 4px 6px -2px rgba(0, 0, 0, 0.05);\n}\n.rounded {\n  border-radius: 1.5rem;\n}\n.wrapper {\n  width: 100%;\n}\n.container {\n  margin-left: auto;\n  margin-right: auto;\n  max-width: 768px;\n  padding-bottom: 3rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  color: rgba(55, 65, 81, 1);\n  width: 100%;\n}\n#welcome {\n  margin-top: 2.5rem;\n}\n#welcome h1 {\n  font-size: 3rem;\n  font-weight: 500;\n  letter-spacing: -0.025em;\n  line-height: 1;\n}\n#welcome span {\n  display: block;\n  font-size: 1.875rem;\n  font-weight: 300;\n  line-height: 2.25rem;\n  margin-bottom: 0.5rem;\n}\n#hero {\n  align-items: center;\n  background-color: hsla(214, 62%, 21%, 1);\n  border: none;\n  box-sizing: border-box;\n  color: rgba(55, 65, 81, 1);\n  display: grid;\n  grid-template-columns: 1fr;\n  margin-top: 3.5rem;\n}\n#hero .text-container {\n  color: rgba(255, 255, 255, 1);\n  padding: 3rem 2rem;\n}\n#hero .text-container h2 {\n  font-size: 1.5rem;\n  line-height: 2rem;\n  position: relative;\n}\n#hero .text-container h2 svg {\n  color: hsla(162, 47%, 50%, 1);\n  height: 2rem;\n  left: -0.25rem;\n  position: absolute;\n  top: 0;\n  width: 2rem;\n}\n#hero .text-container h2 span {\n  margin-left: 2.5rem;\n}\n#hero .text-container a {\n  background-color: rgba(255, 255, 255, 1);\n  border-radius: 0.75rem;\n  color: rgba(55, 65, 81, 1);\n  display: inline-block;\n  margin-top: 1.5rem;\n  padding: 1rem 2rem;\n  text-decoration: inherit;\n}\n#hero .logo-container {\n  display: none;\n  justify-content: center;\n  padding-left: 2rem;\n  padding-right: 2rem;\n}\n#hero .logo-container svg {\n  color: rgba(255, 255, 255, 1);\n  width: 66.666667%;\n}\n#middle-content {\n  align-items: flex-start;\n  display: grid;\n  grid-template-columns: 1fr;\n  margin-top: 3.5rem;\n}\n#middle-content #middle-left-content {\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n}\n#learning-materials {\n  padding: 2.5rem 2rem;\n}\n#learning-materials h2 {\n  font-weight: 500;\n  font-size: 1.25rem;\n  letter-spacing: -0.025em;\n  line-height: 1.75rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.list-item-link {\n  align-items: center;\n  border-radius: 0.75rem;\n  display: flex;\n  margin-top: 1rem;\n  padding: 1rem;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n  width: 100%;\n}\n.list-item-link svg:first-child {\n  margin-right: 1rem;\n  height: 1.5rem;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n  width: 1.5rem;\n}\n.list-item-link > span {\n  flex-grow: 1;\n  font-weight: 400;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n.list-item-link > span > span {\n  color: rgba(107, 114, 128, 1);\n  display: block;\n  flex-grow: 1;\n  font-size: 0.75rem;\n  font-weight: 300;\n  line-height: 1rem;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n.list-item-link svg:last-child {\n  height: 1rem;\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n  width: 1rem;\n}\n.list-item-link:hover {\n  color: rgba(255, 255, 255, 1);\n  background-color: hsla(162, 55%, 33%, 1);\n}\n.list-item-link:hover > span > span {\n  color: rgba(243, 244, 246, 1);\n}\n.list-item-link:hover svg:last-child {\n  transform: translateX(0.25rem);\n}\n.button-pill {\n  padding: 1.5rem 2rem;\n  margin-bottom: 2rem;\n  transition-duration: 300ms;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  align-items: center;\n  display: flex;\n}\n.button-pill svg {\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n  flex-shrink: 0;\n  width: 3rem;\n}\n.button-pill > span {\n  letter-spacing: -0.025em;\n  font-weight: 400;\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.button-pill span span {\n  display: block;\n  font-size: 0.875rem;\n  font-weight: 300;\n  line-height: 1.25rem;\n}\n.button-pill:hover svg,\n.button-pill:hover {\n  color: rgba(255, 255, 255, 1) !important;\n}\n.nx-console:hover {\n  background-color: rgba(0, 122, 204, 1);\n}\n.nx-console svg {\n  color: rgba(0, 122, 204, 1);\n}\n.nx-console-jetbrains {\n  margin-top: 2rem;\n}\n.nx-console-jetbrains:hover {\n  background-color: rgba(255, 49, 140, 1);\n}\n.nx-console-jetbrains svg {\n  color: rgba(255, 49, 140, 1);\n}\n#nx-repo:hover {\n  background-color: rgba(24, 23, 23, 1);\n}\n#nx-repo svg {\n  color: rgba(24, 23, 23, 1);\n}\n#nx-cloud {\n  margin-bottom: 2rem;\n  margin-top: 2rem;\n  padding: 2.5rem 2rem;\n}\n#nx-cloud > div {\n  align-items: center;\n  display: flex;\n}\n#nx-cloud > div svg {\n  border-radius: 0.375rem;\n  flex-shrink: 0;\n  width: 3rem;\n}\n#nx-cloud > div h2 {\n  font-size: 1.125rem;\n  font-weight: 400;\n  letter-spacing: -0.025em;\n  line-height: 1.75rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n#nx-cloud > div h2 span {\n  display: block;\n  font-size: 0.875rem;\n  font-weight: 300;\n  line-height: 1.25rem;\n}\n#nx-cloud p {\n  font-size: 1rem;\n  line-height: 1.5rem;\n  margin-top: 1rem;\n}\n#nx-cloud pre {\n  margin-top: 1rem;\n}\n#nx-cloud a {\n  color: rgba(107, 114, 128, 1);\n  display: block;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  margin-top: 1.5rem;\n  text-align: right;\n}\n#nx-cloud a:hover {\n  text-decoration: underline;\n}\n#commands {\n  padding: 2.5rem 2rem;\n  margin-top: 3.5rem;\n}\n#commands h2 {\n  font-size: 1.25rem;\n  font-weight: 400;\n  letter-spacing: -0.025em;\n  line-height: 1.75rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n#commands p {\n  font-size: 1rem;\n  font-weight: 300;\n  line-height: 1.5rem;\n  margin-top: 1rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\ndetails {\n  align-items: center;\n  display: flex;\n  margin-top: 1rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  width: 100%;\n}\ndetails pre > span {\n  color: rgba(181, 181, 181, 1);\n}\nsummary {\n  border-radius: 0.5rem;\n  display: flex;\n  font-weight: 400;\n  padding: 0.5rem;\n  cursor: pointer;\n  transition-property:\n    background-color,\n    border-color,\n    color,\n    fill,\n    stroke,\n    opacity,\n    box-shadow,\n    transform,\n    filter,\n    backdrop-filter,\n    -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\nsummary:hover {\n  background-color: rgba(243, 244, 246, 1);\n}\nsummary svg {\n  height: 1.5rem;\n  margin-right: 1rem;\n  width: 1.5rem;\n}\n#love {\n  color: rgba(107, 114, 128, 1);\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  margin-top: 3.5rem;\n  opacity: 0.6;\n  text-align: center;\n}\n#love svg {\n  color: rgba(252, 165, 165, 1);\n  width: 1.25rem;\n  height: 1.25rem;\n  display: inline;\n  margin-top: -0.25rem;\n}\n@media screen and (min-width: 768px) {\n  #hero {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  #hero .logo-container {\n    display: flex;\n  }\n  #middle-content {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 4rem;\n  }\n}\n/*# sourceMappingURL=nx-welcome.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NxWelcome, { className: "NxWelcome", filePath: "apps/web/src/app/nx-welcome.ts", lineNumber: 953 });
})();

// apps/web/src/app/app.ts
var App = class _App {
  title = "web";
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 2, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-nx-welcome")(1, "router-outlet");
    }
  }, dependencies: [NxWelcome, RouterModule, RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ imports: [NxWelcome, RouterModule], selector: "app-root", template: "<app-nx-welcome></app-nx-welcome>\n<router-outlet></router-outlet>\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "apps/web/src/app/app.ts", lineNumber: 11 });
})();

// apps/web/src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
