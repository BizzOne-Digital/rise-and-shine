import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { env } from "@/lib/env";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-[1.6rem] border-4 border-char bg-white p-8 shadow-[8px_8px_0_#FF4D00]">
        <Logo />
        <h1 className="display-lg mt-6 text-3xl">Admin sign in</h1>
        {env.authConfigured ? (
          <LoginForm />
        ) : (
          <div role="alert" className="mt-4 space-y-2 rounded-xl border-2 border-gold bg-gold/20 p-4 text-sm font-bold">
            <p>Admin sign-in needs configuration before it can be used:</p>
            <ul className="list-disc pl-5">
              {!process.env.MONGODB_URI && <li>MONGODB_URI is not set.</li>}
              {(process.env.AUTH_SECRET ?? "").length < 32 && <li>AUTH_SECRET is missing or shorter than 32 characters.</li>}
            </ul>
            <p>See .env.example and README.md.</p>
          </div>
        )}
      </div>
    </main>
  );
}
