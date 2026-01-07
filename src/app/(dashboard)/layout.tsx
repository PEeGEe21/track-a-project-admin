"use client";
import MainLayout from "@/components/MainLayout/MainLayout";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MainLayout>{children}</MainLayout>
    </>
  );
};

export default DashboardLayout;
