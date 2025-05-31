import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export const WishlistContext = createContext();

const WishlistContextProvider = ({ children }) => {
  const [wishlistData, setWishlistData] = useState([]);
  const [wishlistItems, setWishlistItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetched, setIsFetched] = useState(false);

  const navigate = useNavigate();

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  const getWishlist = useCallback(async () => {
    const token = getAuthToken();
    if (!token || isFetched) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/wishlist`);
      const items = response.data.items || [];
      setWishlistData(items);
      setWishlistItems(
        items.reduce((acc, item) => {
          acc[item.productId._id] = true;
          return acc;
        }, {})
      );
      setIsFetched(true);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch wishlist";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isFetched, navigate]);

  useEffect(() => {
    if (getAuthToken()) {
      getWishlist();
    }
  }, [getWishlist]);

  const removeFromWishlist = async (productId) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to remove items from your wishlist");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/wishlist/remove`, {
        productId,
      });
      const items = response.data.items || [];
      setWishlistData(items);
      setWishlistItems(
        items.reduce((acc, item) => {
          acc[item.productId._id] = true;
          return acc;
        }, {})
      );
      toast.success("Item Removed From Wishlist");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to remove from wishlist";
      toast.error(errorMsg);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    wishlistData,
    wishlistItems,
    setWishlistItems,
    isLoading,
    error,
    currency: "$",
    removeFromWishlist,
    fetchWishlist: getWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContextProvider;
