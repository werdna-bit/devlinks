import { createFileRoute } from "@tanstack/react-router";
import { ProfileDisplay } from "@/components/display-profile";
import { useLinks } from "@/components/link-provider";

export const Route = createFileRoute("/_auth/preview/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { links } = useLinks();
	const { user } = Route.useRouteContext();

	if (!user) return null;

	return <ProfileDisplay user={user} links={links} />;
}
