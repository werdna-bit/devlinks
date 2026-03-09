import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useLinks } from "@/components/link-provider";

export const Route = createFileRoute("/_auth/preview")({
	component: AppLayout,
});

function AppLayout() {
	const { links } = useLinks();
	return (
		<div className="w-full flex min-h-svh">
			<Outlet />
		</div>
	);
}
