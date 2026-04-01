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
