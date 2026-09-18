import { createFileRoute, redirect } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { getAdminSessionFn, loginAdminFn } from "@/db/admin.functions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/admin/login")({
	head: () => ({ meta: [{ title: "Parkfuchs Admin" }] }),
		loader: async () => {
			const session = await getAdminSessionFn();
			if (session.authenticated) {
				throw redirect({ to: "/admin", search: { query: "", status: "pending" } });
			}
			return session;
		},
		component: AdminLogin,
});

function AdminLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await loginAdminFn({ data: { email, password } });
			window.location.assign("/admin");
		} catch {
			setError("Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.");
			setLoading(false);
		}
	}

	return (
		<div className="admin-root flex min-h-screen items-center justify-center bg-background px-4 py-10 font-sans">
			<div className="w-full max-w-md">
				<Card>
					<CardHeader className="text-center">
						<CardDescription className="font-bold uppercase tracking-[0.2em] text-destructive">Parkfuchs Admin</CardDescription>
						<CardTitle className="text-3xl font-black tracking-tight">Anmelden</CardTitle>
						<CardDescription>Nur für bestehende Backend-Nutzer.</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={submit}>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="admin-email">E-Mail</FieldLabel>
							<Input
									id="admin-email"
									autoComplete="username"
									required
									type="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									className="w-full"
								/>
								</Field>
								<Field>
									<FieldLabel htmlFor="admin-password">Passwort</FieldLabel>
									<Input
										id="admin-password"
										autoComplete="current-password"
										required
										type="password"
										value={password}
										onChange={(event) => setPassword(event.target.value)}
										className="w-full"
									/>
								</Field>
								{error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
								<Button type="submit" disabled={loading} className="w-full">
									{loading ? <Spinner data-icon="inline-start" /> : null}
									{loading ? "Anmeldung läuft ..." : "Anmelden"}
								</Button>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
