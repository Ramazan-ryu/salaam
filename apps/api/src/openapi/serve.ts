import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Express, Request, Response } from 'express';
import { buildOpenApiDocument } from './document';

/**
 * Development/staging only: GET /v1/openapi.json and Swagger UI at /v1/docs.
 * Assets come from the swagger-ui-dist package (no CDN); the init script is a separate file so a strict CSP can apply later.
 */
export function mountApiDocs(app: NestExpressApplication) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const swaggerUiDist = require('swagger-ui-dist') as { getAbsoluteFSPath(): string };
  const doc = buildOpenApiDocument();
  const http = app.getHttpAdapter().getInstance() as Express;

  app.useStaticAssets(swaggerUiDist.getAbsoluteFSPath(), { prefix: '/v1/docs/assets/', index: false });
  http.get('/v1/openapi.json', (_req: Request, res: Response) => res.json(doc));
  http.get('/v1/docs/init.js', (_req: Request, res: Response) =>
    res
      .type('application/javascript')
      .send(
        "window.ui = SwaggerUIBundle({ url: '/v1/openapi.json', dom_id: '#swagger', deepLinking: true, " +
          "persistAuthorization: false });",
      ),
  );
  http.get('/v1/docs', (_req: Request, res: Response) =>
    res.type('text/html').send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Salaam API — docs (development)</title>
<link rel="stylesheet" href="/v1/docs/assets/swagger-ui.css"></head>
<body><div id="swagger"></div>
<script src="/v1/docs/assets/swagger-ui-bundle.js"></script><script src="/v1/docs/init.js"></script></body></html>`),
  );
}
