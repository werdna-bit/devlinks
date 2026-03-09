import { platformsRecord } from "@/helpers/link-config";
import type { AuthQueryResult } from "@/lib/auth/queries";
import { useLinks } from "./link-provider";

interface Props {
	user: AuthQueryResult;
}

export const Phone = ({ user }: Props) => {
	const { links } = useLinks();
	return (
		<div className="hidden bg-white rounded-xl md:flex items-center justify-center w-full md:w-[45%] lg:w-[40%] max-w-[400px] p-4 sm:p-6 md:p-8">
			<div className="w-full max-w-[400px] aspect-[308/632]">
				<svg
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-full"
					fill="none"
					viewBox="0 0 308 632"
				>
					<path
						stroke="#737373"
						d="M1 54.5C1 24.953 24.953 1 54.5 1h199C283.047 1 307 24.953 307 54.5v523c0 29.547-23.953 53.5-53.5 53.5h-199C24.953 631 1 607.047 1 577.5v-523Z"
					/>
					<path
						fill="#fff"
						stroke="#737373"
						d="M12 55.5C12 30.923 31.923 11 56.5 11h24C86.851 11 92 16.149 92 22.5c0 8.008 6.492 14.5 14.5 14.5h95c8.008 0 14.5-6.492 14.5-14.5 0-6.351 5.149-11.5 11.5-11.5h24c24.577 0 44.5 19.923 44.5 44.5v521c0 24.577-19.923 44.5-44.5 44.5h-195C31.923 621 12 601.077 12 576.5v-521Z"
					/>

					{user ? (
						<foreignObject x="57" y="90" width="200" height="150">
							<div className="w-full h-full flex flex-col gap-2 items-center p-4 text-center text-sm">
								<div className="w-[70%] max-w-[100px] aspect-square rounded-full bg-zinc-200 relative overflow-hidden">
									<img
										src={user.image ?? "/no-profile.webp"}
										alt={user.name}
										className="w-full h-full object-cover"
									></img>
								</div>
								<p className="">@{user.username}</p>
							</div>
						</foreignObject>
					) : (
						<>
							<circle cx="153.5" cy="112" r="48" fill="#EEE" />
							<rect
								width="160"
								height="16"
								x="73.5"
								y="185"
								fill="#EEE"
								rx="8"
								className="animate-pulse"
							/>
							<rect
								width="72"
								height="8"
								x="117.5"
								y="214"
								fill="#EEE"
								rx="4"
								className="animate-pulse"
							/>
						</>
					)}
					{links.length > 0 ? (
						<foreignObject x="35" y="240" width="237" height="340">
							<div className="w-full h-full rounded-lg overflow-y-auto py-3 grid gap-2 scroll-container">
								{links.map((link) => {
									const Icon = platformsRecord[link.platform].icon;
									return (
										<div
											key={link.id}
											style={{
												backgroundColor: platformsRecord[link.platform].color,
											}}
											className=" w-full h-fit text-sm p-2 flex items-center gap-2 cursor-pointer hover:scale-99 transition-all duration-300 ease-in-out text-white rounded-lg"
										>
											<Icon />
											{link.platform}
										</div>
									);
								})}
							</div>
						</foreignObject>
					) : (
						<>
							<rect
								width="237"
								height="44"
								x="35"
								y="278"
								fill="#EEE"
								rx="8"
								className="animate-pulse"
							/>
							<rect
								width="237"
								height="44"
								x="35"
								y="342"
								fill="#EEE"
								rx="8"
								className="animate-pulse"
							/>
							<rect
								width="237"
								height="44"
								x="35"
								y="406"
								fill="#EEE"
								rx="8"
								className="animate-pulse"
							/>
							<rect
								width="237"
								height="44"
								x="35"
								y="470"
								fill="#EEE"
								rx="8"
								className="animate-pulse"
							/>
							<rect
								width="237"
								height="44"
								x="35"
								y="534"
								fill="#EEE"
								rx="8"
								className="animate-pulse"
							/>
						</>
					)}
				</svg>
			</div>
		</div>
	);
};
