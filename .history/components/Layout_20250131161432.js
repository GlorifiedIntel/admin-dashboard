import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "../components/Nav";
import Image from 'next/image';

export default function Layout({children}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="flex items-center justify-center mt-12">Loading...</p>;
    }
    return (
      <div className="flex items-center justify-center mt-12">
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  if (session) {
    return (
      <>
      <div className="bg-[#156064] min-h-screen flex">
        <Nav />
        <div className="bg-[#FDFFFC] rounded-lg p-4 mt-2 flex-grow mr-2 mb-2">
        {children}
        </div>
        </div>
      </>
    );
  }