"use client";

import { logoutUser } from "@/app/actions/auth";
import { ButtonHTMLAttributes, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/useUserStore";

type LogoutButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  onLoggedOut?: () => void;
};

export function LogoutButton({
  onClick,
  onLoggedOut,
  ...props
}: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { logout } = useUserStore();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    startTransition(async () => {
      await logoutUser();
      logout();
      onLoggedOut?.();
      router.replace("/auth/login");
    });
  };

  return <button {...props} onClick={handleClick} disabled={isPending || props.disabled} />;
}
