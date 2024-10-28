import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import type { AppBindings, AppOpenAPI } from "./types";
import { pinoLogger } from "@/middlewares/pino-logger";
import { cors } from "hono/cors";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(
    "*", // or replace with "*" to enable cors for all routes
    cors({
      origin: (origin) => origin, // replace with your origin
      credentials: true,
    }),
  );
  app.use(serveEmojiFavicon("📝"));
  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
