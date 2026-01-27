import {
	bigint,
	integer,
	jsonb,
	pgTable,
	uniqueIndex,
	uuid,
	varchar
} from "drizzle-orm/pg-core";

export const days = pgTable(
	"days",
	{
		id: uuid().primaryKey().defaultRandom(),
		userId: varchar("user_id", { length: 256 }).notNull(), // From Clerk
		date: bigint("date", { mode: "number" }).notNull(), // millisecond timestamp
		symptoms: integer("symptoms").notNull(), // 0-100
		triggers: jsonb("triggers").$type<Record<string, number>>().notNull()
	},
	(table) => ({
		userDateUnique: uniqueIndex("days_user_id_date_unique").on(table.userId, table.date)
	})
);