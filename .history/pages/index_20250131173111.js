import Layout from "../components/Layout";
import {useSession} from "next-auth/react";
import Image from "next/image";

export default function Home() {
const {data: session} = useSession();

if(!session) return;

return <Layout>
  <div className="text-blue-900 text-xl font-normal flex justify-between">
Welcome, {session?.user?.name}
<Image src={session?.user?.image} alt="user image" width={30} height={30} />
</div>
</Layout>                        
}
