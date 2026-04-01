import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { saasFeatureGenerator } from './saas-feature';
import { SaasFeatureGeneratorSchema } from './schema';

describe('saas-feature generator', () => {
  let tree: Tree;
  const options: SaasFeatureGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await saasFeatureGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
