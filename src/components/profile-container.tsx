import { zodResolver } from "@hookform/resolvers/zod";
import { RiLoader4Line } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import authClient from "@/lib/auth/auth-client";
import type { AuthQueryResult } from "@/lib/auth/queries";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const UpdateProfileSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name is too long"),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username must be less than 30 characters")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Username can only contain letters, numbers, underscores, and hyphens",
		),
	email: z.email("Must be a valid email address"),
});

type ProfileType = z.infer<typeof UpdateProfileSchema>;

interface Props {
	user: AuthQueryResult;
}

export default function Profile({ user }: Props) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isDirty },
	} = useForm<ProfileType>({
		resolver: zodResolver(UpdateProfileSchema),
		defaultValues: {
			name: user?.name,
			username: user?.username ?? "",
			email: user?.email,
		},
	});

	const { mutate: updateProfile, isPending } = useMutation({
		mutationFn: async (data: ProfileType) => {
			return await authClient.updateUser({
				name: data.name,
				username: data.username,
			});
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update profile");
		},
	});

	const onSubmit: SubmitHandler<ProfileType> = async (data) => {
		if (isPending) return;

		const { data: response, error } = await authClient.isUsernameAvailable({
			username: data.username,
		});

		if (error) {
			toast.error("Failed to check username availability. Please try again.");
			return;
		}

		if (!response?.available) {
			setError("username", {
				message: "Username is not available",
			});
			return;
		}

		updateProfile(data);
	};
	if (!user) return null;

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-6 mt-8"
		>
			<div className="flex flex-col gap-5">
				<div className="grid gap-2">
					<Label htmlFor="Name">Name</Label>
					<Input
						id="Name"
						{...register("name")}
						type="name"
						className="rounded-sm h-12 mt-1"
						placeholder="user"
						readOnly={isPending}
					/>

					{errors.name && (
						<p className="text-red-500 text-xs">{errors.name.message}</p>
					)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						{...register("username")}
						type="username"
						className="rounded-sm h-12 mt-1"
						placeholder="johndoe2002"
						readOnly={isPending}
					/>

					{errors.username && (
						<p className="text-red-500 text-xs">{errors.username.message}</p>
					)}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						{...register("email")}
						type="email"
						className="rounded-sm h-12 mt-1"
						placeholder="hello@example.com"
						disabled={true}
						readOnly={true}
					/>

					{errors.email && (
						<p className="text-red-500 text-xs">{errors.email.message}</p>
					)}
				</div>
			</div>

			<div className="flex items-center justify-end mt-4 border-t-1 py-2">
				<Button
					type="submit"
					className="mt-2 h-10 rounded-md text-base font-[500]  purpleButton"
					disabled={isPending || !isDirty}
				>
					{isPending && <RiLoader4Line className="animate-spin" />}
					{isPending ? "Updating..." : "Save"}
				</Button>
			</div>
		</form>
	);
}
