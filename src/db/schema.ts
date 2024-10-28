import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// export const tasks = sqliteTable("tasks", {
//   id: integer("id", { mode: "number" })
//     .primaryKey({ autoIncrement: true }),
//   name: text("name")
//     .notNull(),
//   done: integer("done", { mode: "boolean" })
//     .notNull()
//     .default(false),
//   createdAt: integer("created_at", { mode: "timestamp" })
//     .$defaultFn(() => new Date()),
//   updatedAt: integer("updated_at", { mode: "timestamp" })
//     .$defaultFn(() => new Date())
//     .$onUpdate(() => new Date()),
// });

// -----------------------------------------------------------------------------
			
export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
  .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});


export const blogs = sqliteTable("blogs", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  title: text("title").notNull().unique(),
  slug: text("slug").unique(),
  description: text("description").notNull(),
  tag: text('tag').$type<'programming' | 'backend' | 'frontend' | 'web' | 'design'>().notNull(),
  userId: integer('userId').references(() => users.id, {onDelete: 'cascade'}).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
}));

export const postsRelations = relations(blogs, ({ one }) => ({
  user: one(users, {
    fields: [blogs.userId],
    references: [users.id],
  }),
}));
