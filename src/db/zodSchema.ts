import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { blogs, users } from './schema';
import { z } from 'zod';
import { SlugParamsSchema } from 'stoker/openapi/schemas';

export const selectBlogsSchema = createSelectSchema(blogs);

const blogTags = [
  'programming',
  'backend',
  'frontend',
  'web',
  'design',
] as const;
export const insertBlogsSchema = createInsertSchema(blogs, {
  title: schema => schema.title.min(1).max(500),
  tag: z.enum(blogTags),
})
  .required({
    title: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const patchBlogsSchema = insertBlogsSchema.partial();
export type patchBlogsType = z.infer<typeof patchBlogsSchema>;

export const SelectUserSchema = createSelectSchema(users);

export const ResponseUserSchema = createSelectSchema(users).pick({
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users, {
  name: schema => schema.name.min(1).max(500),
  email: schema => schema.email.email(),
  password: schema => schema.password.min(1).max(32),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchUserSchema = insertUserSchema.partial();
