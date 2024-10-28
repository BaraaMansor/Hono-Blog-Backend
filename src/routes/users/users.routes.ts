import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertUserSchema, patchUserSchema, SelectUserSchema } from "@/db/zodSchema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Users"];

export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(SelectUserSchema),
      "List of users",
    ),
  },
});

export const create = createRoute({
  path: "/users",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertUserSchema,
      "The user to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        SelectUserSchema,
      "The created user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: "/users/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        SelectUserSchema,
      "The requested user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/users/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchUserSchema,
      "The user updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        SelectUserSchema,
      "The updated user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchUserSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/users/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "User deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
