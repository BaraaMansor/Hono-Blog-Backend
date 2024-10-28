import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertBlogsSchema, patchBlogsSchema, selectBlogsSchema } from "@/db/zodSchema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Blogs"];

export const list = createRoute({
  path: "/blogs",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectBlogsSchema),
      "The list of blogs",
    ),
  },
});

export const create = createRoute({
  path: "/blogs",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertBlogsSchema,
      "The blog to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectBlogsSchema,
      "The created blog",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertBlogsSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: "/blogs/{slug}",
  method: "get",
  request: {
    params: SlugParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectBlogsSchema,
      "The requested blog",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Blog not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(SlugParamsSchema),
      "Invalid slug error",
    ),
  },
});

export const patch = createRoute({
  path: "/blogs/{slug}",
  method: "patch",
  request: {
    params: SlugParamsSchema,
    body: jsonContentRequired(
      patchBlogsSchema,
      "The blog updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectBlogsSchema,
      "The updated blog",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Blog not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchBlogsSchema)
        .or(createErrorSchema(SlugParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/blogs/${slug}",
  method: "delete",
  request: {
    params: SlugParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Blog deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Blog not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(SlugParamsSchema),
      "Invalid slug error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
