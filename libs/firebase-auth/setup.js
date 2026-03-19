#!/usr/bin/env node
/**
 * firebase-auth setup script
 *
 * Bindet das firebase-auth Modul automatisch in eine Angular-App ein.
 * Führe dieses Skript aus dem Root des Monorepos aus:
 *
 *   node libs/firebase-auth/setup.js --project=web
 *
 * Optionen:
 *   --project          Name des Angular-Projekts (Pflicht)
 *   --redirectAfterLogin    Route nach Login       (default: /app/dashboard)
 *   --redirectAfterLogout   Route nach Logout      (default: /login)
 *   --loginRoute            Route zum Login        (default: /login)
 */

const fs = require('fs');
const path = require('path');

// ─── CLI-Argumente parsen ─────────────────────────────────────────────────────
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value ?? true;
  return acc;
}, {});

const project = args['project'];
if (!project) {
  console.error('❌  Fehler: --project ist erforderlich');
  console.error('   Beispiel: node libs/firebase-auth/setup.js --project=web');
  process.exit(1);
}

const redirectAfterLogin = args['redirectAfterLogin'] ?? '/app/dashboard';
const redirectAfterLogout = args['redirectAfterLogout'] ?? '/login';
const loginRoute = args['loginRoute'] ?? '/login';

// ─── Pfade ermitteln ─────────────────────────────────────────────────────────
const cwd = process.cwd();

// project.json oder nx.json lesen um sourceRoot zu ermitteln
function findSourceRoot(projectName) {
  const candidates = [
    path.join(cwd, 'apps', projectName, 'project.json'),
    path.join(cwd, 'projects', projectName, 'project.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const json = JSON.parse(fs.readFileSync(candidate, 'utf-8'));
      return json.sourceRoot ?? path.join('apps', projectName, 'src');
    }
  }
  // Fallback
  return path.join('apps', projectName, 'src');
}

const sourceRoot = findSourceRoot(project);
const appRoot = path.join(cwd, sourceRoot);
const appConfigPath = path.join(appRoot, 'app', 'app.config.ts');
const appRoutesPath = path.join(appRoot, 'app', 'app.routes.ts');
const tsconfigBasePath = path.join(cwd, 'tsconfig.base.json');

// tsconfig.app.json suchen
const appDir = sourceRoot.replace(/[/\\]src$/, '');
const tsconfigAppCandidates = [
  path.join(cwd, appDir, 'tsconfig.app.json'),
  path.join(cwd, appDir, 'tsconfig.json'),
];
const tsconfigAppPath = tsconfigAppCandidates.find(fs.existsSync);

console.log(`\n🔥  Firebase Auth – Einbindung in Projekt "${project}"\n`);

// ─── 1. tsconfig.base.json – Pfad-Alias ──────────────────────────────────────
console.log('1️⃣  tsconfig.base.json aktualisieren...');
if (fs.existsSync(tsconfigBasePath)) {
  const json = JSON.parse(fs.readFileSync(tsconfigBasePath, 'utf-8'));
  json.compilerOptions = json.compilerOptions ?? {};
  json.compilerOptions.paths = json.compilerOptions.paths ?? {};

  if (!json.compilerOptions.paths['@saas-base/firebase-auth']) {
    json.compilerOptions.paths['@saas-base/firebase-auth'] = ['libs/firebase-auth/src/index.ts'];
    fs.writeFileSync(tsconfigBasePath, JSON.stringify(json, null, 2) + '\n');
    console.log('   ✔ Pfad-Alias @saas-base/firebase-auth eingetragen');
  } else {
    console.log('   ⏭ Pfad-Alias bereits vorhanden');
  }
} else {
  console.warn('   ⚠ tsconfig.base.json nicht gefunden');
}

// ─── 2. tsconfig.app.json – libs/** include ──────────────────────────────────
console.log('2️⃣  tsconfig.app.json aktualisieren...');
if (tsconfigAppPath) {
  const json = JSON.parse(fs.readFileSync(tsconfigAppPath, 'utf-8'));
  json.include = json.include ?? [];
  json.exclude = json.exclude ?? [];
  const libsGlob = '../../libs/**/*.ts';
  const genExclude = '../../libs/**/generators/**';

  if (!json.include.includes(libsGlob)) {
    json.include.push(libsGlob);
    console.log(`   ✔ ${path.relative(cwd, tsconfigAppPath)}: libs/**/*.ts zu include hinzugefügt`);
  } else {
    console.log('   ⏭ libs-include bereits vorhanden');
  }

  if (!json.exclude.includes(genExclude)) {
    json.exclude.push(genExclude);
    console.log(`   ✔ ${path.relative(cwd, tsconfigAppPath)}: generators/** zu exclude hinzugefügt`);
  }

  fs.writeFileSync(tsconfigAppPath, JSON.stringify(json, null, 2) + '\n');
} else {
  console.warn('   ⚠ tsconfig.app.json nicht gefunden');
}

// ─── 3. environment.ts + environment.prod.ts ──────────────────────────────────
console.log('3️⃣  Environment-Dateien prüfen...');
const envDir = path.join(appRoot, 'environments');
if (!fs.existsSync(envDir)) fs.mkdirSync(envDir, { recursive: true });

const envTs = path.join(envDir, 'environment.ts');
const envProdTs = path.join(envDir, 'environment.prod.ts');

const envContent = `export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};\n`;

const envProdContent = `export const environment = {
  production: true,
  firebase: {
    apiKey: 'YOUR_PROD_API_KEY',
    authDomain: 'YOUR_PROD_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROD_PROJECT_ID',
    storageBucket: 'YOUR_PROD_PROJECT_ID.firebasestorage.app',
    messagingSenderId: 'YOUR_PROD_MESSAGING_SENDER_ID',
    appId: 'YOUR_PROD_APP_ID',
  },
};\n`;

if (!fs.existsSync(envTs)) {
  fs.writeFileSync(envTs, envContent);
  console.log('   ✔ environment.ts erstellt (bitte Firebase-Config eintragen!)');
} else {
  console.log('   ⏭ environment.ts bereits vorhanden');
}

if (!fs.existsSync(envProdTs)) {
  fs.writeFileSync(envProdTs, envProdContent);
  console.log('   ✔ environment.prod.ts erstellt');
} else {
  console.log('   ⏭ environment.prod.ts bereits vorhanden');
}

// ─── 4. app.config.ts – provideFirebaseAuth() ────────────────────────────────
console.log('4️⃣  app.config.ts aktualisieren...');
if (fs.existsSync(appConfigPath)) {
  let content = fs.readFileSync(appConfigPath, 'utf-8');

  if (content.includes('provideFirebaseAuth')) {
    console.log('   ⏭ provideFirebaseAuth bereits vorhanden');
  } else {
    // Imports nach letztem vorhandenen Import einfügen
    const lastImport = content.lastIndexOf('\nimport ');
    const insertAfterIdx = content.indexOf('\n', lastImport + 1);

    const imports = [
      `import { provideFirebaseAuth } from '@saas-base/firebase-auth';`,
      `import { environment } from '../environments/environment';`,
    ].join('\n');

    content =
      content.slice(0, insertAfterIdx + 1) +
      imports + '\n' +
      content.slice(insertAfterIdx + 1);

    // Provider einfügen vor dem letzten '],'
    const lastClosingBracket = content.lastIndexOf('  ],');
    const providerCall = `    provideFirebaseAuth({
      firebaseConfig: environment.firebase,
      redirectAfterLogin: '${redirectAfterLogin}',
      redirectAfterLogout: '${redirectAfterLogout}',
      loginRoute: '${loginRoute}',
    }),\n`;

    if (lastClosingBracket !== -1) {
      content =
        content.slice(0, lastClosingBracket) +
        providerCall +
        content.slice(lastClosingBracket);
    }

    fs.writeFileSync(appConfigPath, content);
    console.log('   ✔ provideFirebaseAuth() eingebunden');
  }
} else {
  console.warn(`   ⚠ ${appConfigPath} nicht gefunden`);
}

// ─── 5. app.routes.ts – Guards + Auth-Routen ─────────────────────────────────
console.log('5️⃣  app.routes.ts aktualisieren...');
if (fs.existsSync(appRoutesPath)) {
  let content = fs.readFileSync(appRoutesPath, 'utf-8');

  // Guard-Import
  if (!content.includes('@saas-base/firebase-auth')) {
    content = `import { authGuard, adminGuard } from '@saas-base/firebase-auth';\n` + content;
    console.log('   ✔ Guard-Imports hinzugefügt (authGuard, adminGuard)');
  }

  // Auth-Routen
  if (!content.includes("path: 'login'")) {
    const authRoutes = `
  // ─── Auth Zone (firebase-auth Modul) ─────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('@saas-base/firebase-auth').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@saas-base/firebase-auth').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('@saas-base/firebase-auth').then((m) => m.ForgotPasswordComponent),
  },
`;

    const routesArrayStart = content.indexOf('[');
    if (routesArrayStart !== -1) {
      content =
        content.slice(0, routesArrayStart + 1) +
        authRoutes +
        content.slice(routesArrayStart + 1);
    }
    console.log('   ✔ Auth-Routen hinzugefügt (login, register, forgot-password)');
  } else {
    console.log('   ⏭ Auth-Routen bereits vorhanden');
  }

  fs.writeFileSync(appRoutesPath, content);
} else {
  console.warn(`   ⚠ ${appRoutesPath} nicht gefunden`);
}

// ─── 6. .gitignore aktualisieren ─────────────────────────────────────────────
console.log('6️⃣  .gitignore aktualisieren...');
const gitignorePath = path.join(cwd, '.gitignore');
const gitignoreEntries = `
# firebase-auth – Secrets
.env
.env.local
.env*.local
firebase-service-account.json
${sourceRoot}/environments/environment.ts
${sourceRoot}/environments/environment.prod.ts
`;

if (fs.existsSync(gitignorePath)) {
  let gitignore = fs.readFileSync(gitignorePath, 'utf-8');
  if (!gitignore.includes('firebase-auth – Secrets')) {
    gitignore += gitignoreEntries;
    fs.writeFileSync(gitignorePath, gitignore);
    console.log('   ✔ Secrets zu .gitignore hinzugefügt');
  } else {
    console.log('   ⏭ .gitignore bereits aktuell');
  }
} else {
  fs.writeFileSync(gitignorePath, gitignoreEntries);
  console.log('   ✔ .gitignore erstellt');
}

// ─── Zusammenfassung ──────────────────────────────────────────────────────────
console.log(`
✅  Fertig! firebase-auth wurde erfolgreich eingebunden.

📌  Nächste Schritte:
   1. Firebase-Config in eintragen:
      ${path.relative(cwd, envTs)}
   2. Google Sign-in in Firebase Console aktivieren:
      https://console.firebase.google.com
   3. App starten:
      npx nx serve ${project}
`);
