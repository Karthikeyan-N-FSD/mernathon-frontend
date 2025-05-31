import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import useProduct from "../hooks/useProduct";

export const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchProducts: fetchProductsFromHook, fetchProductById } =
    useProduct();

  const fetchProducts = useCallback(
    async (options = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const productsData = await fetchProductsFromHook({
          ...options,
        });
        setProducts(productsData.products || []);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        toast.error(err.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProductsFromHook]
  );

  useEffect(() => {
    fetchProducts({});
  }, [fetchProducts]);

  const value = {
    products,
    setProducts,
    fetchProducts,
    fetchProductById,
    isLoading,
    error,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContextProvider;
