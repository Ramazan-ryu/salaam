import fs from 'node:fs';
import path from 'node:path';

/**
 * Load the repository-root .env for local scripts and tests. Existing variables win.
 * (Parsed by hand rather than process.loadEnvFile so it also works inside Jest's sandboxed env.)
 */
export function loadDotEnv(file = path.resolve(__dirname, '..', '..', '..', '.env')): void {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m || line.trimStart().startsWith('#')) continue;
    const [, key, raw] = m;
    if (process.env[key!] !== undefined) continue;
    process.env[key!] = raw!.replace(/^(['"])(.*)\1$/, '$2');
  }
}
