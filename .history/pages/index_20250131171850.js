import Layout from "../components/Layout";
import {useSession} from "next-auth/react";
import Image from "next/image";

export default function Home() {
const {data: session} = useSession();

if(!session) return;

return <Layout>
  <div className="text-blue-900">
<h2>Welcome, {session?.user?.name}</h2>
<Image src={session?.user?.image} alt="user image" width={60} height={60} />
</div>
</Layout>                        
}
