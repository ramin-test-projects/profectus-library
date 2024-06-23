import { ContainerGrid } from "@/components/ContainerGrid/ContainerGrid";
import { Routes } from "@/constants/routes";
import Link from "next/link";

export const SuperAdminPanel = () => {
  return (
    <ContainerGrid cols={{ sm: 1, md: 2, lg: 4 }} className="gap-4">
      {Object.values(Routes.superAdmin.children).map((route) => (
        <Link
          key={route.title}
          href={route.fullPath ?? ""}
          className="rounded-2xl p-4 bg-slate-200 hover:bg-slate-400 border border-gray-400"
        >
          {route.title}
        </Link>
      ))}
    </ContainerGrid>
  );
};
