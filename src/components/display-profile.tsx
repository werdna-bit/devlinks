import { Link, useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { platformsRecord } from "@/helpers/link-config";
import type { AuthQueryResult } from "@/lib/auth/queries";
import type { Link as LinkType } from "./link-provider";
import { Button } from "./ui/button";

interface Props {
	user: AuthQueryResult;
	links: LinkType[];
}
export const ProfileDisplay = ({ links, user }: Props) => {
	const pathname = useLocation({
		select: (location) => location.pathname,
	});

	const copyToClipboard = async (): Promise<boolean> => {
		const fullUrl = window.location.href;
		try {
			await navigator.clipboard.writeText(fullUrl);
			toast.success("Copied to clipboard", { position: "bottom-center" });
			return true;
		} catch (err) {
			toast.error("Failed to copy text: ", { position: "bottom-center" });
			return false;
		}
	};
	if (!user) return null;

	return (
		<div className="w-full flex-1 relative bg-zinc-100">
			<div className="bg-[#633CFF] w-full h-[30%] absolute top-0 left-0 rounded-b-[100px] "></div>
			<header className="w-full rounded-xl h-[8%] flex items-center max-w-7xl absolute left-1/2 -translate-x-1/2 top-8 justify-between border p-4 bg-white">
				{pathname === "/preview" ? (
					<>
						<Link
							to="/dashboard"
							className="flex items-center justify-center text-[#633CFF] hover:bg-[#633CFF] text-sm hover:text-white transition all duration-300 ease-in-out border p-2 border-[#633CFF] px-3 rounded-sm"
						>
							<p>Back to Editor</p>
						</Link>

						<Button
							onClick={copyToClipboard}
							type="submit"
							className="mt-2 h-10 rounded-md text-base font-[500]  purpleButton"
						>
							Share Link
						</Button>
					</>
				) : (
					"work"
				)}
			</header>
			<section className="h-full w-full p-4 md:p-8 static z-100 flex items-center justify-center">
				<div className="bg-white p-4 md:p-8 rounded-sm w-full max-w-sm shadow-lg rounded-xl">
					<div className="w-full h-full flex flex-col items-center p-4 text-center text-sm md:text-base">
						<div className="w-[70%] max-w-[100px] aspect-square rounded-full mb-5 bg-zinc-200 relative overflow-hidden">
							<img
								src={user.image ?? "/no-profile.webp"}
								alt={user.name}
								className="w-full h-full object-cover"
							></img>
						</div>
						<p className="">{user.name}</p>
						<p className="">{user.email}</p>
					</div>

					<div className="w-full h-full rounded-lg overflow-y-auto py-3 grid gap-2 scroll-container max-w-xs mx-auto">
						{links.map((link) => {
							const Icon = platformsRecord[link.platform].icon;
							return (
								<Link
									to={link.url}
									target="_blank"
									rel="noopener noreferrer"
									key={link.id}
									style={{
										backgroundColor: platformsRecord[link.platform].color,
									}}
									className=" w-full h-fit text-sm p-2 flex items-center gap-2 cursor-pointer hover:scale-99 transition-all duration-300 ease-in-out text-white rounded-lg"
								>
									<Icon />
									{link.platform}
								</Link>
							);
						})}
					</div>
				</div>
			</section>
		</div>
	);
};
