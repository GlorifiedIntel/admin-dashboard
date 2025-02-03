import Link from "next/link";
import Layout from "../components/Layout";

export default function Products() {
  return <Layout>
    <Link href={'/products/new'}>Add New Product</Link>
    </Layout>;
}