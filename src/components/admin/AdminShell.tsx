import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { logoutAdminFn } from "@/db/admin.functions";
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
			<header className="border-b bg-primary text-primary-foreground shadow-sm">
				<div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
					<Link
						to="/admin"
						search={{ query: "", status: "pending" }}
						className="text-xl font-black tracking-tight text-primary-foreground sm:text-2xl"
					>
						Parkfuchs Admin
					</Link>
					<div className="flex items-center gap-3 text-right">
						<span className="hidden text-sm text-primary-foreground/75 sm:block">{displayName}</span>
						<Button
							variant="secondary"
							size="sm"
							onClick={logout}
						>
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
