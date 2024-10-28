import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { AppRouteHandler } from "@/lib/types";
import db from "@/db";
import { blogs } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./blogs.routes";
import  slug  from 'slug'
const s = slug;


export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.query.blogs.findMany();
  return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const blog = c.req.valid("json");
  blog.slug =  s(blog.title)
  const [inserted] = await db.insert(blogs).values(blog).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const blog = await db.query.blogs.findFirst({
    where(fields, operators) {
      return operators.eq(fields.slug, slug);
    },
  });

  if (!blog) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(blog, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
  if (updates.title) {
    updates.slug = s(updates.title)
  }
  const [blog] = await db.update(blogs)
    .set(updates)
    .where(eq(blogs.slug, slug))
    .returning();

  if (!blog) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(blog, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const result = await db.delete(blogs)
    .where(eq(blogs.slug, slug));

  if (result.rowsAffected === 0) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
