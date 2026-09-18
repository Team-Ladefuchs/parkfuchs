import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { logoutAdminFn } from "@/db/admin.functions";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

interface AdminShellProps {
	children: ReactNode;
	displayName: string;
}

export default function AdminShell({ children, displayName }: AdminShellProps) {
	async function logout() {
		await logoutAdminFn();
		window.location.assign("/admin/login");
	}

	return (
		<div className="admin-root min-h-screen bg-background font-sans text-foreground">
			<header className="sticky top-0 z-30 border-b bg-primary text-primary-foreground shadow-md">
				<div className="mx-auto flex max-w-295 items-center justify-between gap-4 px-4 py-2 sm:px-6">
					<Link
						to="/admin"
						search={{ query: "", status: "pending", page: 1 }}
						className="flex items-center gap-3 text-xl font-black tracking-tight text-primary-foreground sm:gap-4 sm:text-2xl"
					>
						<span className="[&_img]:mt-0 [&_img]:w-13 [&_img]:h-13 sm:[&_img]:w-13">
							<Logo />
						</span>
						Parkfuchs Admin
					</Link>
					<div className="flex items-center gap-3 text-right">
						<span className="hidden text-sm text-primary-foreground/75 sm:block">
							{displayName}
						</span>
						<Button variant="secondary" size="sm" onClick={logout}>
							Abmelden
						</Button>
					</div>
				</div>
			</header>
			<main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8">
				{children}
			</main>
		</div>
	);
}
