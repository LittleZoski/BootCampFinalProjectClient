import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import { useSession } from "next-auth/react";
import Loader from "./CustomComponents/Loader";
import router, { useRouter } from "next/router";

function Layout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const renderNav = () => {
    return !router.pathname.includes("complete-profile");
  };

  if (status === "loading") {
    <Loader />;
  }

  return (
    <>
      {session && renderNav() && <Navbar />}
      {children}
    </>
  );
}

export default Layout;
