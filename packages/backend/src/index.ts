import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono'
import { deck, deckCards } from './db/schema';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Binding: Bindings }>()
  .basePath("/api");

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

export default app;
