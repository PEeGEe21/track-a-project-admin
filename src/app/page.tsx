import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isJwtExpired } from "@/lib/auth-token";

export default async function Page() {
  const accessToken = (await cookies()).get("admin_access_token")?.value;

  if (accessToken && !isJwtExpired(accessToken)) {
    redirect("/dashboard");
  }

  redirect("/auth/login");
}
