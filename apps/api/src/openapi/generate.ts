/** Writes docs/openapi.json (committed). CI regenerates and fails if the committed file differs. */
import fs from 'node:fs';
import path from 'node:path';
import { buildOpenApiDocument } from './document';

const out = path.resolve(__dirname, '..', '..', '..', '..', 'docs', 'openapi.json');
fs.writeFileSync(out, JSON.stringify(buildOpenApiDocument(), null, 2) + '\n');
console.log(`Wrote ${path.relative(process.cwd(), out)}`);
