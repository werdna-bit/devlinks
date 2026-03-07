import { RiEyeLine, RiLinkM, RiUserLine } from "@remixicon/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import Logo from "@/components/icons/logo";
import LogoSmall from "@/components/icons/logo-small";
import LinkContainer from "@/components/link-container";
import { useLinks } from "@/components/link-provider";
import Profile from "@/components/profile-container";
import { useLocalStorage } from "@/hooks/useStorage";

export const Route = createFileRoute("/_auth/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [tab, setTab] = useLocalStorage<"links" | "profile">("tab", "profile");

	const { links, addLink, saveLinks } = useLinks();

	const { user } = Route.useRouteContext();

	return (
		<section className="flex flex-col bg-zinc-100 gap-4 flex-1 w-full">
			<header className="w-full bg-white h-[7%] md:h-[10%] max-h-[150px]">
				<div className=" w-full max-w-7xl mx-auto flex p-4 md:p-6 items-center justify-between h-full">
					<div className="">
						<span className="hidden md:block">
							<Logo />
						</span>
						<span className="md:hidden">
							<LogoSmall />
						</span>
					</div>
					<div className="flex items-center gap-1 h-9 ">
						<button
							onClick={() => setTab("links")}
							type="button"
							className={`${tab === "links" ? "purple-text bg-purple-400/20" : "text-zinc-400 hover:bg-purple-400/40"} transition-all duration-300 ease-in-out cursor-pointer h-full flex-1 rounded-sm p-2 flex items-center justify-center gap-2`}
						>
							<RiLinkM size={20} />
							<span className="hidden md:block">Links</span>
						</button>

						<button
							onClick={() => setTab("profile")}
							type="button"
							className={`${tab === "profile" ? "purple-text bg-purple-400/20" : "text-zinc-400 hover:bg-purple-400/10"} transition-all duration-300 ease-in-out cursor-pointer h-full flex-1 rounded-sm p-2 flex items-center justify-center gap-2`}
						>
							<RiUserLine size={20} />
							<p className="hidden md:block text-nowrap">Profile Details</p>
						</button>
					</div>
					<Link
						to="/"
						className="text-[#633CFF] hover:bg-[#633CFF] hover:text-white transition all duration-300 ease-in-out border p-2 border-[#633CFF] px-3 rounded-sm"
					>
						<RiEyeLine size={17} />
					</Link>
				</div>
			</header>
			<div className="flex-1 flex flex-col md:flex-row max-w-7xl p-4 mx-auto gap-4  w-full">
				<div className="hidden md:block w-[40%]"></div>

				<div className="flex-1 bg-white rounded-md p-4 overflow-y-scroll">
					{tab === "links" ? (
						<div
							key="links"
							className="animate-in fade-in slide-in-from-bottom-2 duration-500"
						>
							<h1 className="text-2xl font-[700]">Customize your links</h1>
							<p className="font-light text-zinc-500 mt-2">
								Add/edit/delete the links below and share your profile to the
								world.
							</p>

							<button
								onClick={addLink}
								type="button"
								className=" mt-8 flex items-center justify-center text-[#633CFF] hover:bg-[#633CFF] w-full hover:text-white transition all duration-300 ease-in-out border p-2 border-[#633CFF] px-3 rounded-sm"
							>
								<p>Add new link</p>
							</button>
							<div className="flex flex-col gap-2 mt-8">
								{links.map((link, index) => (
									<LinkContainer key={link.id} value={index} link={link} />
								))}
							</div>
						</div>
					) : (
						<div
							key="profile"
							className="animate-in fade-in slide-in-from-bottom-2 duration-500"
						>
							<h1 className="text-2xl font-[700]">Profile Details</h1>
							<p className="font-light text-zinc-500 mt-2">
								Add your details to create a personal touch to you profile.
							</p>
							<Profile user={user} />
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
