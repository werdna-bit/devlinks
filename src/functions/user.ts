import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import type { Link } from "@/components/link-provider";
import { db } from "@/lib/db";
import { links, user } from "@/lib/db/schema";

export const getUserDetails = createServerFn({ method: "GET" })
	.inputValidator((data: { username: string }) => data)
	.handler(async ({ data }) => {
		const { username } = data;

		const [userRecord] = await db
			.select()
			.from(user)
			.where(eq(user.username, username))
			.limit(1);

		if (!userRecord) {
			return { user: null, userLinks: [] };
		}

		const userLinks = (await db.query.links.findMany({
			where: eq(links.userId, userRecord.id),
			columns: {
				id: true,
				platform: true,
				url: true,
			},
			orderBy: (links, { asc }) => [asc(links.createdAt)],
		})) as Link[];

		return {
			user: userRecord,
			userLinks: userLinks,
		};
	});
