/**
 * middleware.ts:
 *   export function middleware(req: NextRequest) {
 *     if (!req.cookies.get("session")) return NextResponse.redirect(new URL("/login", req.url));
 *   }
 *   export const config = { matcher: ["/dashboard/:path*"] };
 *
 * app/dashboard/page.tsx:
 *   export default async function Dashboard() {
 *     const session = await verifySession((await cookies()).get("session")?.value);
 *     if (!session) redirect("/login");
 *     return <main><h1>Welcome {session.user.name}</h1>
 *       {session.user.role === "admin" && <AdminTools />}</main>;
 *   }
 *
 * Login sets an encrypted, Secure, SameSite, HTTP-only cookie. Logout deletes
 * it in a Server Action. Keep refresh tokens server-side and rotate them.
 */
export const protectedDashboardSolution = {
  protection: ["middleware fast redirect", "Server Component authorization"],
  cookie: { httpOnly: true, secure: true, sameSite: "lax" },
};
