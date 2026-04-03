import {
  formatFiles,
  generateFiles,
  Tree,
  names
} from '@nx/devkit';
import { SaasFeatureGeneratorSchema } from './schema';
import { libraryGenerator } from '@nx/angular/generators';

export async function saasFeatureGenerator(
  tree: Tree,
  options: SaasFeatureGeneratorSchema,
) {
  // 1. Angular Library erstellen
  const fullProjectPath = options.directory 
    ? `libs/${options.directory}/${options.name}` 
    : `libs/${options.name}`;

  await libraryGenerator(tree, {
    name: options.name,
    directory: fullProjectPath,
    projectNameAndRootFormat: 'as-provided',
    standalone: true,
    routing: true,
    style: 'scss',
    skipModule: true,
    tags: 'type:feature'
  });

  // Pfade für den lokalen Generator Tree
  const srcRoot = `${fullProjectPath}/src/lib`;

  // Hilfsklassen für Namen (camelCase, PascalCase etc.)
  const { className, propertyName, fileName } = names(options.name);
  
  // 2. Erzeuge manifest.ts (für die UI Shell)
  const manifestPath = `${srcRoot}/manifest.ts`;
  const manifestContent = `
export const ${propertyName}Manifest = {
  label: '${className}',
  icon: 'appstore',
  route: '${fileName}'
};
`;
  tree.write(manifestPath, manifestContent);

  // 2.a Erzeuge Debug-Komponente
  const debugPath = `${srcRoot}/debug/${fileName}-debug.component.ts`;
  const debugContent = `
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'saas-base-${fileName}-debug',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="debug-panel" [class.open]="isOpen">
      <div class="debug-header" (click)="toggle()">
        <span>🐞 ${className} Debugger</span>
        <span class="toggle-icon">{{ isOpen ? '▼' : '▲' }}</span>
      </div>
      <div class="debug-content" *ngIf="isOpen">
        <label>Live Data:</label>
        <pre><code>{{ data | json }}</code></pre>
      </div>
    </div>
  \`,
  styles: [
    \`
      .debug-panel {
        position: fixed;
        bottom: 0;
        right: 20px;
        width: 400px;
        background: #1e1e1e;
        color: #00ff00;
        font-family: monospace;
        border-radius: 8px 8px 0 0;
        z-index: 9999;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
        font-size: 12px;
        transition: transform 0.3s ease-in-out;
      }
      .debug-header {
        padding: 10px 15px;
        background: #333;
        color: #fff;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px 8px 0 0;
        font-weight: bold;
      }
      .debug-content {
        padding: 15px;
        max-height: 400px;
        overflow-y: auto;
      }
      pre {
        background: #000;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
      }
      label {
        color: #888;
        display: block;
        margin-top: 10px;
        margin-bottom: 5px;
        text-transform: uppercase;
        font-size: 10px;
      }
    \`
  ]
})
export class ${className}DebugComponent {
  @Input() data: any = null;
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
`;
  tree.write(debugPath, debugContent);


  // 3. Passe index.ts Export an
  const indexPath = `${fullProjectPath}/src/index.ts`;
  // Hole aktuellen inhalt
  const indexContent = tree.read(indexPath)?.toString() || '';
  const newIndexContent = `${indexContent.trim()}\nexport * from './lib/manifest';\n`;
  tree.write(indexPath, newIndexContent);

  // 4. Formattieren
  await formatFiles(tree);
}

export default saasFeatureGenerator;
