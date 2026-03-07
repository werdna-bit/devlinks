import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env/client";

const authClient = createAuthClient({
	baseURL: env.VITE_BASE_URL,
	plugins: [usernameClient()],
});

export default authClient;
