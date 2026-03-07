import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";

export const saveUserLinks = createServerFn({ method: "POST" })
	.inputValidator(
		(data: {
			userId: string;
			links: Array<{ id: string; platform: string; url: string }>;
		}) => data,
	)
	.handler(async ({ data }) => {
		const { userId, links: userLinks } = data;

		// Delete all existing links for this user
		await db.delete(links).where(eq(links.userId, userId));

		// Insert all new links (if any)
		if (userLinks.length > 0) {
			await db.insert(links).values(
				userLinks.map((link) => ({
					id: link.id,
					platform: link.platform,
					url: link.url,
					userId: userId,
				})),
			);
		}

		return { success: true };
	});

export const getUserLinks = createServerFn({ method: "GET" })
	.inputValidator((data: { userId: string }) => data)
	.handler(async ({ data }) => {
		const { userId } = data;

		const userLinks = await db.query.links.findMany({
			where: eq(links.userId, userId),
			orderBy: (links, { asc }) => [asc(links.createdAt)],
		});

		return userLinks;
	});
