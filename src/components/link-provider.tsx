import { ScriptOnce } from "@tanstack/react-router";
import {
	createContext,
	type ReactNode,
	use,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

export const Platforms = [
	"GitHub",
	"LinkedIn",
	"Stack Overflow",
	"Dev.to",
	"CodePen",
	"GitLab",
	"Medium",
	"Hashnode",
	"Portfolio",
	"X (formerly Twitter)",
];

export type PlatformType = (typeof Platforms)[number];

export type Link = { id: string; platform: PlatformType; url: string };
type Links = Link[];

interface LinksContextType {
	links: Links;
	addLink: () => void;
	saveLinks: () => void;
	updateLink: (
		id: string,
		updates: Partial<{ platform: string; url: string }>,
	) => void;
	removeLink: (id: string) => void;
	reorderLinks: (startIndex: number, endIndex: number) => void;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

const STORAGE_KEY = "devlinks_links";

export function LinksProvider({ children }: { children: ReactNode }) {
	const [links, setLinks] = useState<Links>(() => {
		// Initialize from sessionStorage
		try {
			const stored = sessionStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				// If stored array is not empty, use it
				if (parsed.length > 0) {
					return parsed;
				}
			}
		} catch {
			// Fall through to default
		}

		// Default: return one empty Github link
		return [
			{
				id: crypto.randomUUID(),
				platform: "Github",
				url: "",
			},
		];
	});

	useEffect(() => {
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(links));
		} catch (error) {
			console.error("Failed to save links to sessionStorage:", error);
		}
	}, [links]);

	const addLink = useCallback(() => {
		setLinks((prev) => {
			if (prev.length > 0) {
				const lastLink = prev[prev.length - 1];
				if (!lastLink.platform || !lastLink.url) {
					return prev;
				}
			}
			const link = {
				id: crypto.randomUUID(),
				platform: "GitHub" as PlatformType,
				url: "",
			};
			return [...prev, link];
		});
	}, []);

	const updateLink = useCallback(
		(id: string, updates: Partial<{ platform: string; url: string }>) => {
			setLinks((prev) =>
				prev.map((link) => (link.id === id ? { ...link, ...updates } : link)),
			);
		},
		[],
	);

	const removeLink = useCallback((id: string) => {
		setLinks((prev) => {
			const filtered = prev.filter((link) => link.id !== id);

			if (filtered.length === 0) {
				return [
					{
						id: crypto.randomUUID(),
						platform: "GitHub" as PlatformType,
						url: "",
					},
				];
			}

			return filtered;
		});
	}, []);

	const reorderLinks = useCallback((startIndex: number, endIndex: number) => {
		setLinks((prev) => {
			const result = Array.from(prev);
			const [removed] = result.splice(startIndex, 1);
			result.splice(endIndex, 0, removed);
			return result;
		});
	}, []);

	const saveLinks = () => {};

	const value = useMemo(
		() => ({ links, addLink, updateLink, removeLink, saveLinks, reorderLinks }),
		[links, addLink, updateLink, removeLink, reorderLinks],
	);

	return (
		<LinksContext.Provider value={value}>{children}</LinksContext.Provider>
	);
}

export function useLinks() {
	const context = use(LinksContext);
	if (!context) {
		throw new Error("useLinks must be used within a LinksProvider");
	}
	return context;
}
