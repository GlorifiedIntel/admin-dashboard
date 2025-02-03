import { useSession, signIn } from "next-auth/react";
import Nav from "../components/Nav";

export default function Layout({ children }) {
  const { data: session, status } = useSession();

  // Show a loading state when the session is being fetched
  if (status === "loading") {
    return <p className="flex items-center justify-center mt-12">Loading...</p>;
  }

  // Show a sign-in button if the user is not signed in
  if (!session) {
    return (
      <div className="flex items-center justify-center mt-12">
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Sign in
        </button>
      </div>
    );
  }

  // Render the layout if the user is signed in
  return (
    <div className="bg-[#212731] min-h-screen flex">
      <Nav />
      <div className="bg-[#FDFFFC] rounded-lg p-4 mt-2 flex-grow mr-2 mb-2">
        {children}
      </div>
    </div>
  );
}
