import {
	RiArticleFill,
	RiCodepenFill,
	RiGithubFill,
	RiGitlabFill,
	RiGlobalLine,
	RiHashtag,
	RiLinkedinBoxFill,
	RiMediumFill,
	RiStackOverflowFill,
	RiTwitterFill,
} from "@remixicon/react";
import type { PlatformType } from "@/components/link-provider";

export const platformsRecord: Record<
	PlatformType,
	{ icon: any; color: string }
> = {
	GitHub: {
		icon: RiGithubFill,
		color: "#181717",
	},
	"X (formerly Twitter)": {
		icon: RiTwitterFill,
		color: "#1DA1F2",
	},
	LinkedIn: {
		icon: RiLinkedinBoxFill,
		color: "#0A66C2",
	},
	"Stack Overflow": {
		icon: RiStackOverflowFill,
		color: "#F58025",
	},
	"Dev.to": {
		icon: RiArticleFill,
		color: "#0A0A0A",
	},
	CodePen: {
		icon: RiCodepenFill,
		color: "#000000",
	},
	GitLab: {
		icon: RiGitlabFill,
		color: "#FC6D26",
	},
	Medium: {
		icon: RiMediumFill,
		color: "#000000",
	},
	Hashnode: {
		icon: RiHashtag,
		color: "#2962FF",
	},
	Portfolio: {
		icon: RiGlobalLine,
		color: "#6366F1",
	},
};
