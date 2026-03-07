import { zodResolver } from "@hookform/resolvers/zod";
import { RiGalleryView, RiLoader4Line } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Logo from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authClient from "@/lib/auth/auth-client";
import { authQueryOptions } from "@/lib/auth/queries";

export const Route = createFileRoute("/_guest/login")({
	component: LoginForm,
});

const LoginSchema = z.object({
	email: z.email().min(1),
	password: z.string().min(8, "Password must be atleast 8 characters long"),
});

type LoginType = z.infer<typeof LoginSchema>;

function LoginForm() {
	const {
		register,
		formState: { isDirty, errors },
		handleSubmit,
	} = useForm<LoginType>({
		resolver: zodResolver(LoginSchema),
	});
	const queryClient = useQueryClient();

	const navigate = useNavigate();

	const { mutate: emailLoginMutate, isPending } = useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			const result = await authClient.signIn.email({
				email: data.email,
				password: data.password,
			});

			// Throw error if login failed
			if (result.error) {
				throw new Error(result.error.message || "Invalid email or password");
			}

			return result;
		},
		onSuccess: async (result) => {
			await queryClient.invalidateQueries({
				queryKey: authQueryOptions().queryKey,
			});
			await queryClient.refetchQueries({
				queryKey: authQueryOptions().queryKey,
			});

			toast.success(`Successfully logged in. Welcome back`);

			setTimeout(async () => {
				try {
					await navigate({ to: "/dashboard" });
				} catch (error) {
					window.location.href = "/dashboard";
				}
			}, 100);
		},
		onError: (error) => {
			toast.error(error.message || "Invalid email or password");
		},
	});

	const onSubmit: SubmitHandler<LoginType> = (data) => {
		if (isPending) return;

		emailLoginMutate(data);
	};

	return (
		<div className="flex flex-col gap-6">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-6">
					<div className="flex items-center w-full gap-2">
						<Logo />
					</div>

					<div className="flex flex-col w-full my-4">
						<h1 className="font-[900] text-2xl text-gray-800">Login</h1>
						<p className="font-extralight text-zinc-500">
							Add your details below to get back into the app
						</p>
					</div>
					<div className="flex flex-col gap-5">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								{...register("email")}
								type="email"
								placeholder="hello@example.com"
								className="rounded-sm h-12 mt-1"
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
								type="password"
								className="rounded-sm h-12 mt-1"
								placeholder="Enter password here"
								readOnly={isPending}
							/>
							{errors.password && (
								<p className="text-red-500 text-xs">
									{errors.password.message}
								</p>
							)}
						</div>
						<Button
							type="submit"
							className="mt-2 h-12 rounded-md text-base font-[500] w-full purpleButton"
							disabled={isPending || !isDirty}
						>
							{isPending && <RiLoader4Line className="animate-spin" />}
							{isPending ? "Logging in..." : "Login"}
						</Button>
					</div>
				</div>
			</form>

			<div className="text-center text-sm">
				Don&apos;t have an account?{" "}
				<Link to="/signup" className="underline underline-offset-4 purple-text">
					Sign up
				</Link>
			</div>
		</div>
	);
}
