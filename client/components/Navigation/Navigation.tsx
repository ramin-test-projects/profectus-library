"use client";

import { Routes } from "@/constants/routes";
import { useAuthContext } from "@/context/auth-provider/AuthProvider";
import { Button } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { logout, auth } = useAuthContext();
  const [showAddButton, setShowAddButton] = useState<boolean>(false);

  useEffect(() => {
    !!auth?.isAdmin && setShowAddButton(true);
  }, [auth?.isAdmin]);

  const isNewBookPage = pathName.toLowerCase() === Routes.book.children.new.fullPath;

  return (
    <div className="flex flex-row gap-2 border-solid border-b-[1px] border-b-slate-300 py-2 px-4 items-center">
      <div className="flex-auto">
        <Link href={Routes.home.fullPath ?? ""}>
          <img src="/image/profectus-logo.webp" className="w-36" />
        </Link>
      </div>
      {!isNewBookPage && (
        <div className={`flex-grow-0 flex-shrink-0 ${showAddButton ? "" : "hidden"}`}>
          <Button
            variant="outlined"
            onClick={() => router.push(Routes.book.children.new.fullPath ?? "")}
          >
            Add book
          </Button>
        </div>
      )}
      <div className="flex-grow-0 flex-shrink-0">
        <Button variant="contained" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
};
