import ProductsComponent from "@/components/products/ProductsComponent";
import { Suspense } from "react";

const ProductPage = () => {

    return (
        <Suspense fallback={<div className="container-custom py-16 text-center">Loading products...</div>}>
            <ProductsComponent />
        </Suspense>
    );
}

export default ProductPage   