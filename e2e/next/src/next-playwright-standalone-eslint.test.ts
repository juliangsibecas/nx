import {
  cleanupProject,
  fileExists,
  getSelectedPackageManager,
  runCLI,
  runCreateWorkspace,
  uniq,
} from '@nx/e2e/utils';

// This test exists as coverage for a previous regression
describe('nextjs standalone playwright linting', () => {
  const packageManager = getSelectedPackageManager() || 'pnpm';

  afterEach(() => cleanupProject());

  // TODO: this currently fails on eslint v9 because the stable eslint-plugin-next does not support it, despite the PR being merged many months ago
  xit('should work', async () => {
    const wsName = uniq('next');
    const appName = uniq('app');
    runCreateWorkspace(wsName, {
      preset: 'nextjs-standalone',
      style: 'css',
      nextAppDir: true,
      nextSrcDir: true,
      appName,
      packageManager,
      e2eTestRunner: 'playwright',
    });
    // Ensure that the expected standalone setup is correct
    expect(fileExists('.eslintrc.base.json')).toBe(false);

    const output = runCLI(`lint ${appName}`);
    expect(output).toContain(
      `Successfully ran target lint for project ${appName}`
    );
  });
});
