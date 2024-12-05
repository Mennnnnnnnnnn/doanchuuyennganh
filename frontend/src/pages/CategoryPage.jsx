import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore"
import { useParams } from "react-router-dom";


const CategoryPage = () => {
    const {fetchProductsByCategory, products } = useProductStore();
    const {category} = useParams();
    useEffect(()=>{
        fetchProductsByCategory(category)
    },[fetchProductsByCategory, category]);

    console.log("products:",products);
  return (
    <div>
      categorypage
    </div>
  )
}

export default CategoryPage
