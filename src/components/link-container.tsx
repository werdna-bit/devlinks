import { RiArrowDownSLine as Chevron, RiCarFill } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import z from "zod";
import { useDebounce } from "@/hooks/useDebounce";
import type { Link } from "./link-provider";
import { Platforms, type PlatformType, useLinks } from "./link-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props {
	link: Link;
	value: number;
}

const platformUrlPatterns: Record<PlatformType, RegExp> = {
	GitHub: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
	LinkedIn: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/,
	"Stack Overflow":
		/^https?:\/\/(www\.)?stackoverflow\.com\/users\/\d+\/[\w-]+\/?$/,
	"Dev.to": /^https?:\/\/(www\.)?dev\.to\/[\w-]+\/?$/,
	CodePen: /^https?:\/\/(www\.)?codepen\.io\/[\w-]+\/?$/,
	GitLab: /^https?:\/\/(www\.)?gitlab\.com\/[\w-]+\/?$/,
	Medium: /^https?:\/\/(www\.)?medium\.com\/@?[\w-]+\/?$/,
	Hashnode: /^https?:\/\/[\w-]+\.hashnode\.dev\/?$/,
	Portfolio: /^https?:\/\/.+\..+$/,
	"X (formerly Twitter)":
		/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w-]+\/?$/,
};

export const linkSchema = z
	.object({
		id: z.string().min(1, "ID is required"),
		platform: z.enum(Platforms),
		url: z.url("Must be a valid URL"),
	})
	.superRefine((data, ctx) => {
		const pattern = platformUrlPatterns[data.platform];
		if (!pattern.test(data.url)) {
			ctx.addIssue({
				code: "custom",
				message: `Invalid ${data.platform} URL format`,
				path: ["url"],
			});
		}
	});

export const linksSchema = z.array(linkSchema);

export default function LinkContainer({ link, value }: Props) {
	const { updateLink, removeLink } = useLinks();
	const [platform, setPlatform] = useState<PlatformType>(link.platform);
	const [open, setOpen] = useState<boolean>(false);
	const [linkInput, setLinkInput] = useState(link.url);
	const finalLink = useDebounce(linkInput, 500);
	const [urlError, setUrlError] = useState<string>("");

	const popupRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popupRef.current &&
				buttonRef.current &&
				!popupRef.current.contains(event.target as Node) &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	useEffect(() => {
		if (!finalLink) {
			setUrlError("");
			return;
		}

		const result = linkSchema.safeParse({
			id: link.id,
			platform: platform,
			url: finalLink,
		});

		if (result.success) {
			setUrlError("");
			updateLink(link.id, { platform, url: finalLink });
		} else {
			const urlIssue = result.error.issues.find((e) => e.path.includes("url"));
			setUrlError(urlIssue?.message || "");
		}
	}, [platform, finalLink, link.id, updateLink]);

	if (!link) return null;

	return (
		<div className="w-full flex flex-col gap-4 bg-zinc-50 p-4 rounded-md">
			<div className="w-full flex items-center justify-between gap-4">
				<h3 className="text-zinc-500 font-[800]">= Link #{value + 1}</h3>
				<button
					onClick={() => removeLink(link.id)}
					type="button"
					className="text-sm text-zinc-600 hover:underline"
				>
					Remove
				</button>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="platform">Platform</Label>
				<div className="w-full relative ">
					<Button
						ref={buttonRef}
						onClick={() => setOpen((prev) => !prev)}
						variant={"outline"}
						className="rounded-sm w-full h-12 flex items-center justify-between mt-1"
					>
						<div className="font-light">{platform}</div>
						<Chevron />
					</Button>

					<div
						ref={popupRef}
						className={` ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"} z-100 transition-all duration-300 ease-in-out absolute top-full mt-2 z-105 shadow-lg left-0 w-full p-1 rounded-lg bg-white`}
					>
						{Platforms.map((platform) => (
							<button
								key={platform}
								className="w-full text-left  hover:bg-blue-500 px-2 rounded-sm text-zinc-600  hover:text-white cursor-pointer text-lg"
								onClick={() => {
									setPlatform(platform);
									setOpen(false);
								}}
								type="button"
							>
								{platform}
							</button>
						))}
					</div>
				</div>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="url">Url</Label>
				<Input
					id="url"
					defaultValue={link.url}
					onChange={(e) => {
						setLinkInput(e.target.value);
					}}
					type="text"
					placeholder="Enter url"
					className="rounded-sm z-50 h-12 mt-1"
				/>
				{urlError && <p className="text-red-500 text-sm">{urlError}</p>}
			</div>
		</div>
	);
}
