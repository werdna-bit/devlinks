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
import { toast } from "sonner";
import { getUserLinks, saveUserLinks } from "@/functions/links";
import { $getUser } from "@/lib/auth/functions";

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
] as const;

export type PlatformType = (typeof Platforms)[number];
export type Link = { id: string; platform: PlatformType; url: string };
type Links = Link[];

interface LinksContextType {
	links: Links;
	addLink: () => void;
	saveLinks: () => Promise<void>;
	isSaving: boolean;
	isLoading: boolean;
	updateLink: (
		id: string,
		updates: Partial<{ platform: PlatformType; url: string }>,
	) => void;
	removeLink: (id: string) => void;
	reorderLinks: (startIndex: number, endIndex: number) => void;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

const STORAGE_KEY = "devlinks_links";

interface LinksProviderProps {
	children: ReactNode;
}

export function LinksProvider({ children }: LinksProviderProps) {
	const [links, setLinks] = useState<Links>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [userId, setUserId] = useState<string | null>(null);

	// Get user on mount
	useEffect(() => {
		const fetchUser = async () => {
			const user = await $getUser();
			if (user?.id) {
				setUserId(user.id);
			}
		};
		fetchUser();
	}, []);

	// Load links from database when userId is available
	useEffect(() => {
		if (!userId) return;

		const loadLinks = async () => {
			try {
				const dbLinks = await getUserLinks({ data: { userId } });

				if (dbLinks && dbLinks.length > 0) {
					// Map and cast platform to PlatformType
					const typedLinks: Links = dbLinks.map((link) => ({
						id: link.id,
						platform: link.platform as PlatformType,
						url: link.url,
					}));

					setLinks(typedLinks);
					sessionStorage.setItem(STORAGE_KEY, JSON.stringify(typedLinks));
				} else {
					// No links in DB, check sessionStorage or use default
					const stored = sessionStorage.getItem(STORAGE_KEY);
					if (stored) {
						const parsed = JSON.parse(stored);
						if (parsed.length > 0) {
							setLinks(parsed);
							return;
						}
					}
					// Set default link
					setLinks([
						{
							id: crypto.randomUUID(),
							platform: "GitHub" as PlatformType,
							url: "",
						},
					]);
				}
			} catch (error) {
				console.error("Failed to load links:", error);
				// Fallback to sessionStorage or default
				try {
					const stored = sessionStorage.getItem(STORAGE_KEY);
					if (stored) {
						const parsed = JSON.parse(stored);
						setLinks(
							parsed.length > 0
								? parsed
								: [
										{
											id: crypto.randomUUID(),
											platform: "GitHub" as PlatformType,
											url: "",
										},
									],
						);
					}
				} catch {
					setLinks([
						{
							id: crypto.randomUUID(),
							platform: "GitHub" as PlatformType,
							url: "",
						},
					]);
				}
			} finally {
				setIsLoading(false);
			}
		};

		loadLinks();
	}, [userId]);

	// Sync to sessionStorage when links change
	useEffect(() => {
		if (!isLoading) {
			try {
				sessionStorage.setItem(STORAGE_KEY, JSON.stringify(links));
			} catch (error) {
				console.error("Failed to save links to sessionStorage:", error);
			}
		}
	}, [links, isLoading]);

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
		(id: string, updates: Partial<{ platform: PlatformType; url: string }>) => {
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

	const saveLinks = useCallback(async () => {
		if (!userId) {
			toast.error("User not authenticated");
			return;
		}

		setIsSaving(true);
		try {
			await saveUserLinks({
				data: {
					userId,
					links,
				},
			});
			toast.success("Links saved successfully");
		} catch (error) {
			console.error("Failed to save links:", error);
			toast.error("Failed to save links");
		} finally {
			setIsSaving(false);
		}
	}, [userId, links]);

	const value = useMemo(
		() => ({
			links,
			addLink,
			updateLink,
			removeLink,
			saveLinks,
			reorderLinks,
			isSaving,
			isLoading,
		}),
		[
			links,
			addLink,
			updateLink,
			removeLink,
			saveLinks,
			reorderLinks,
			isSaving,
			isLoading,
		],
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
