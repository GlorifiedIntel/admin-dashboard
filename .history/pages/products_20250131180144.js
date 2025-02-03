import Link from "next/link";
import Layout from "../components/Layout";

export default function Products() {
  return <Layout>
    <Link className="bg-[#212738] rounded-md text-white py-2 px-2" href={'/products/new'}>Add New Product</Link>
    </Layout>;
}