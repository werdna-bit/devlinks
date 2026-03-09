import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/preview")({
	component: AppLayout,
});

function AppLayout() {
	return (
		<div className="w-full flex min-h-svh">
			<Outlet />
		</div>
	);
}
