"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { signInSchema } from "@/lib/schemas";
import { Loader2, X } from "lucide-react";
import { signInSchemaType } from "@/types/schema";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import showToast from "../ToastComponent";
import { useUserStore } from "@/lib/stores/useUserStore";

const SubmitButton: React.FC<{ disabled: boolean; isSubmitting: boolean }> = ({
  disabled,
  isSubmitting,
}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "w-full py-2 rounded-md bg-[#ADED221A] border border-[#0A0A0A] hover:border-[#2B2B2B] hover:bg-[#212121] text-white font-semibold h-12 transition-all ease-in-out flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        disabled && "opacity-40"
      )}
    >
      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
    </button>
  );
};

const SignInForm = () => {
  const { setUser } = useUserStore();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<boolean | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: signInSchemaType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(
        key,
        typeof value === "boolean" ? String(value) : value ?? ""
      );
    });

    const res = await login(undefined, formData);

    if (res.errors) {
      Object.entries(res.errors).forEach(([field, messages]) => {
        setError(field as keyof signInSchemaType, {
          type: "server",
          message: messages[0],
        });
      });
      setStatus(false);
    } else {
      if (res.status) {
        if (res.data) {
          setUser(res?.data);
          setStatus(res.status ?? true);
          router.push("/dashboard");
          reset();
        } else {
          showToast("error", "Login succeeded but no user data received");
        }
      } else {
        showToast("error", res.message || "Login failed");
      }
    }
    setMessage(res.message ?? null);
  };

  return (
    <div className="space-y-5">
      {message && (
        <div
          className={cn(
            "p-3 text-sm rounded-lg text-center transition-all duration-300",
            status
              ? "bg-green-100 text-green-600 border border-green-200"
              : "bg-red-100 text-red-600 border border-red-200"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="flex-1">{message}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              aria-label="Dismiss message"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-chinese-gray">
              Email
            </label>
            <input
              type="text"
              {...register("email")}
              className={clsx(
                "w-full rounded-md border border-[#2B2B2B] bg-[#212121] px-4 py-3 text-sm h-12 transition duration-300 focus:outline-none focus:border-[#2B2B2B]",
                errors.email && "border border-red-500"
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2 text-chinese-gray">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className={clsx(
                "w-full rounded-md border border-[#2B2B2B] bg-[#212121] px-4 py-3 text-sm h-12 transition duration-300 focus:outline-none focus:border-[#2B2B2B]",
                errors.password && "border border-red-500"
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <SubmitButton disabled={isSubmitting} isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
