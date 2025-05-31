import { useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "./../utils/axiosInstance";

const useProduct = () => {
  const fetchProducts = useCallback(async (options = {}) => {
    const { sort = "", category = "", subCategory = "", search = "" } = options;

    try {
      const response = await axiosInstance.get("/product", {
        params: {
          sort,
          category,
          subCategory,
          search,
        },
      });

      return {
        products: response.data.products,
      };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch products";
      throw new Error(message);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    try {
      const response = await axiosInstance.get(`/product/${id}`);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch product";
      toast.error(message);
      return null;
    }
  }, []);

  const fetchLatestProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/product/latest");
      return {
        products: response.data.products,
      };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch latest products";
      throw new Error(message);
    }
  }, []);

  const fetchBestSellers = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/product/bestsellers");
      return {
        products: response.data.products,
      };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch bestsellers";
      throw new Error(message);
    }
  }, []);

  const fetchRelatedProducts = useCallback(async (category, subCategory) => {
    try {
      const response = await axiosInstance.get("/product/related", {
        params: { category, subCategory },
      });
      return response.data.products;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch related products";
      throw new Error(message);
    }
  }, []);

  return {
    fetchProducts,
    fetchProductById,
    fetchLatestProducts,
    fetchBestSellers,
    fetchRelatedProducts,
  };
};

export default useProduct;
