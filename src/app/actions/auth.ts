"use server";

import {
  ApiRequestError,
  fetchPublic,
  fetchWithAuth,
  parseApiResponse,
} from "@/lib/fetch-config";
import { signInSchema } from "@/lib/schemas";
import { signInSchemaType } from "@/types/schema";
import { UserProps } from "@/types/user";
import { cookies } from "next/headers";

interface LoginProps extends PrevStateProps<signInSchemaType> {
  redirectUrl?: string;
  data?: UserProps | null;
}

export async function login(
  prevState: LoginProps | undefined,
  formData: FormData,
): Promise<LoginProps> {
  const cookieStore = await cookies();
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = signInSchema.safeParse(rawData);
  const isProduction = process.env.NODE_ENV === "production";

  // For server side validation
  if (!validatedFields.success) {
    return {
      message: "Missing fields. Login Failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      status: false,
      inputs: rawData as signInSchemaType,
    };
  }

  const dataToSubmit = validatedFields.data;

  try {
    const response = await fetchPublic("/auth/login-admin", {
      method: "POST",
      body: JSON.stringify(dataToSubmit),
    });
    const data = await parseApiResponse<{
      accessToken: string;
      refreshToken: string;
      user: UserProps;
      message?: string;
    }>(response);

    cookieStore.set({
      name: "admin_access_token",
      httpOnly: true,
      value: data?.accessToken,
      sameSite: "strict",
      secure: isProduction,
      maxAge: 60 * 15,
      path: "/",
    });

    cookieStore.set({
      name: "admin_refresh_token",
      httpOnly: true,
      value: data?.refreshToken,
      sameSite: "strict",
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      ...prevState,
      data: data?.user,
      message: data?.message,
      inputs: rawData as signInSchemaType,
      status: true,
    };
  } catch (error) {
    const message =
      error instanceof ApiRequestError
        ? error.message
        : "Failed to Sign in. Please Try again";
    return {
      ...prevState,
      message,
      status: false,
      data: null,
      inputs: rawData as signInSchemaType,
    };
  }
}

export async function impersonateUser(
  prevState: LoginProps | undefined,
  formData: FormData,
): Promise<LoginProps> {
  const cookieStore = await cookies();
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = signInSchema.safeParse(rawData);
  const isProduction = process.env.NODE_ENV === "production";

  // For server side validation
  if (!validatedFields.success) {
    return {
      message: "Missing fields. Login Failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      status: false,
      inputs: rawData as signInSchemaType,
    };
  }

  const dataToSubmit = validatedFields.data;

  try {
    const response = await fetchPublic("/auth/login-admin", {
      method: "POST",
      body: JSON.stringify(dataToSubmit),
    });
    const data = await parseApiResponse<{
      accessToken: string;
      refreshToken: string;
      user: UserProps;
      message?: string;
    }>(response);

    cookieStore.set({
      name: "admin_access_token",
      httpOnly: true,
      value: data?.accessToken,
      sameSite: "strict",
      secure: isProduction,
      maxAge: 60 * 15,
      path: "/",
    });

    cookieStore.set({
      name: "admin_refresh_token",
      httpOnly: true,
      value: data?.refreshToken,
      sameSite: "strict",
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      ...prevState,
      data: data?.user,
      message: data?.message,
      inputs: rawData as signInSchemaType,
      status: true,
    };
  } catch (error) {
    const message =
      error instanceof ApiRequestError
        ? error.message
        : "Failed to Sign in. Please Try again";
    return {
      ...prevState,
      message,
      status: false,
      data: null,
      inputs: rawData as signInSchemaType,
    };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  try {
    const refreshToken = cookieStore.get("admin_refresh_token")?.value;

    if (refreshToken) {
      await fetchWithAuth("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch {
    // We still clear local auth cookies even if the backend logout request fails.
  } finally {
    cookieStore.delete("admin_access_token");
    cookieStore.delete("admin_refresh_token");
  }

  return {
    success: true,
    message: "Logged out successfully",
  };
}
