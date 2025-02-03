import Layout from "../../../components/Layout"; 


export default function EditProductPage() {
        const router = useRouter();
        const {id} = router.query;
        useEffect(() => {
        axios.get('/api/products?id='+id).then(response => {
        console.log(response.data);
        });
        }, [id]);
return (
        <Layout>  
        edit product form here
        </Layout>
);
}