import Layout from "../components/Layout";
import {useSession} from "next-auth/react";

export default function Home() {
const {data: session} = useSession();

if(!session) return;

return <Layout>
  <div className="text-blue-900">
Welcome, {session?.user?.name}
<img src={session?.user?.image} alt="user image" width={60} height={60} />
</div>
</Layout>                        
}
