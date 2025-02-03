"use client";


import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="flex items-center justify-center mt-12">Loading...</p>;
  }

  if (session) {
    return (
      <>
      <div className="bg-[#394648] min-h-screen">
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()} className="bg-red-500 p-2 text-white rounded-lg px-4">
          Sign out
        </button>
        </div>
      </>
    );
  }

  return (
    <div className="bg-[#156064] w-screen h-screen flex items-center justify-center">
      <div className="flex items-center bg-white p-2 text-black rounded-lg px-4 shadow-lg">
        <button
          className="flex bg-white p-3 items-center text-black rounded-lg px-4"
          onClick={() => signIn("google")}>
            <Image src="/google.svg" alt="Google logo" width={20} height={20} className="mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
