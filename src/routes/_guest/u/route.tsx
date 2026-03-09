import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest/u")({
	component: AppLayout,
});

function AppLayout() {
	return (
		<div className="w-full flex min-h-svh">
			<Outlet />
		</div>
	);
}
