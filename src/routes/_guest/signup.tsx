import { zodResolver } from "@hookform/resolvers/zod";
import { RiGalleryView, RiLoader4Line } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Logo from "@/components/icons/logo";

import { SignInSocialButton } from "@/components/sign-in-social-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authClient from "@/lib/auth/auth-client";
import { authQueryOptions } from "@/lib/auth/queries";

export const Route = createFileRoute("/_guest/signup")({
	component: SignupForm,
});

const SignUpSchema = z
	.object({
		username: z.string().min(1, "Username is required"),
		email: z
			.email("Please enter a valid email address")
			.min(1, "Email is required"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must be at least 8 characters long")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type SignUpType = z.infer<typeof SignUpSchema>;

function SignupForm() {
	const {
		register,
		setError,
		clearErrors,
		formState: { isDirty, errors },
		handleSubmit,
	} = useForm<SignUpType>({
		resolver: zodResolver(SignUpSchema),
	});

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { mutate: signupMutate, isPending } = useMutation({
		mutationFn: async (data: SignUpType) => {
			return await authClient.signUp.email({
				username: data.username,
				displayUsername: data.username,
				email: data.email,
				name: data.email,
				password: data.password,
			});
		},
		onSuccess: () => {
			queryClient.removeQueries({
				queryKey: authQueryOptions().queryKey,
			});
			navigate({ to: "/dashboard" });
		},
		onError: (error) => {
			toast.error(error.message || "An error occurred while signing up.");
		},
	});

	const onSubmit: SubmitHandler<SignUpType> = async (data) => {
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

		signupMutate(data);
	};

	return (
		<div className="flex flex-col gap-6">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-6">
					<div className="flex items-center w-full gap-2">
						<Logo />
					</div>

					<div className="flex flex-col w-full my-4">
						<h1 className="font-[900] text-2xl text-gray-800">
							Create account
						</h1>
						<p className="font-extralight text-zinc-500">
							Let's get you started sharing your links!
						</p>
					</div>
					<div className="flex flex-col gap-5">
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
								<p className="text-red-500 text-xs">
									{errors.username.message}
								</p>
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
								readOnly={isPending}
							/>

							{errors.email && (
								<p className="text-red-500 text-xs">{errors.email.message}</p>
							)}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								{...register("password")}
								className="rounded-sm h-12 mt-1"
								type="password"
								placeholder="Password"
								readOnly={isPending}
							/>

							{errors.password && (
								<p className="text-red-500 text-xs">
									{errors.password.message}
								</p>
							)}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="confirm_password">Confirm Password</Label>
							<Input
								id="confirm_password"
								{...register("confirmPassword")}
								className="rounded-sm h-12 mt-1"
								type="password"
								placeholder="Confirm Password"
								readOnly={isPending}
							/>

							{errors.confirmPassword && (
								<p className="text-red-500 text-xs">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
						<p className="font-extralight text-xs text-zinc-500">
							Password must contain at least 8 characters
						</p>
						<Button
							type="submit"
							className="mt-2 h-12 rounded-md text-base font-[500] w-full purpleButton"
							disabled={isPending || !isDirty}
						>
							{isPending && <RiLoader4Line className="animate-spin" />}
							{isPending ? "Signing up..." : "Create new account"}
						</Button>
					</div>
				</div>
			</form>

			<div className="text-center text-sm">
				Already have an account?{" "}
				<Link to="/login" className="underline underline-offset-4 purple-text">
					Login
				</Link>
			</div>
		</div>
	);
}
