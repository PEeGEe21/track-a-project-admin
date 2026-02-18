"use server";

import { fetchPublic, fetchWithAuth } from "@/lib/fetch-config";
import { signInSchema } from "@/lib/schemas";
import { signInSchemaType } from "@/types/schema";
import { UserProps } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LoginProps extends PrevStateProps<signInSchemaType> {
  redirectUrl?: string;
  data?: UserProps | null;
}

export async function login(
  prevState: LoginProps | undefined,
  formData: FormData
): Promise<LoginProps> {
  const cookieStore = await cookies();
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = signInSchema.safeParse(rawData);

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

  // console.log(dataToSubmit)
  try {
    const response = await fetchPublic("/auth/login-admin", {
      method: "POST",
      body: JSON.stringify(dataToSubmit),
    });
    const data = await response.json();

    if (!response?.ok) {
      console.log("fine");
      return {
        ...prevState,
        message: data?.message,
        data: null,
        inputs: rawData as signInSchemaType,
        status: false,
      };
    }

    cookieStore.set({
      name: "admin_access_token",
      httpOnly: true,
      value: data?.accessToken,
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    cookieStore.set({
      name: "admin_refresh_token",
      httpOnly: true,
      value: data?.refreshToken,
      sameSite: "strict",
      // path: "/api/auth/refresh",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      ...prevState,
      data: data?.user,
      message: data?.message,
      inputs: rawData as signInSchemaType,
      status: true,
    };
  } catch (error) {
    console.log(error, "here");
    return {
      ...prevState,
      message: "Failed to Sign in. Please Try again",
      status: false,
      data: null,
      inputs: rawData as signInSchemaType,
    };
  }
}

export async function impersonateUser(
  prevState: LoginProps | undefined,
  formData: FormData
): Promise<LoginProps> {
  const cookieStore = await cookies();
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = signInSchema.safeParse(rawData);

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

  // console.log(dataToSubmit)
  try {
    const response = await fetchPublic("/auth/login-admin", {
      method: "POST",
      body: JSON.stringify(dataToSubmit),
    });
    const data = await response.json();

    if (!response?.ok) {
      console.log("fine");
      return {
        ...prevState,
        message: data?.message,
        data: null,
        inputs: rawData as signInSchemaType,
        status: false,
      };
    }

    cookieStore.set({
      name: "admin_access_token",
      httpOnly: true,
      value: data?.accessToken,
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    cookieStore.set({
      name: "admin_refresh_token",
      httpOnly: true,
      value: data?.refreshToken,
      sameSite: "strict",
      // path: "/api/auth/refresh",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      ...prevState,
      data: data?.user,
      message: data?.message,
      inputs: rawData as signInSchemaType,
      status: true,
    };
  } catch (error) {
    console.log(error, "here");
    return {
      ...prevState,
      message: "Failed to Sign in. Please Try again",
      status: false,
      data: null,
      inputs: rawData as signInSchemaType,
    };
  }
}

export async function logoutUser() {
  const cookiesFunc = await cookies();
  try {
    const refresh_token = (await cookies()).get("admin_refresh_token")?.value;

    const response = await fetchWithAuth("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: refresh_token }),
    });

    if (!response?.ok) {
      return {
        message: "Something went wrong.",
        success: false,
      };
    }

    // Clear all auth-related cookies
    cookiesFunc.delete("admin_access_token");
    cookiesFunc.delete("admin_refresh_token");

    return { success: true, message: "Logged out successfully" };
  } catch {
    return {
      message: "Something went wrong.",
      success: false,
    };
  } finally {
    redirect(`/auth/login`);
  }
}
