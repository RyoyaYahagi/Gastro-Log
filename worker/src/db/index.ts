import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Cloudflare Workers 用の DB クライアント作成関数
export function createDb(databaseUrl: string) {
    const sql = neon(databaseUrl);
    return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;
