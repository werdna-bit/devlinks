import { createFileRoute } from "@tanstack/react-router";
import { ProfileDisplay } from "@/components/display-profile";
import { getUserDetails } from "@/functions/user";

export const Route = createFileRoute("/_guest/u/$username")({
	component: RouteComponent,
	loader: async ({ params }) => {
		return getUserDetails({ data: { username: params.username } });
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();

	return <ProfileDisplay user={data.user} links={data.userLinks} />;
}
