import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import axiosInstance from "../utils/axiosInstance";

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currency = "$";
  const delivery_fee = 10;
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const getCart = async () => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/cart`);
      setCartItems(response.data.items || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch cart");
      toast.error(err.response?.data?.error || "Failed to fetch cart");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (getAuthToken()) {
      getCart();
    }
  }, []);

  const addToCart = async (productId, size) => {
    if (!size) {
      toast.error("Please Select a Size");
      return;
    }
    try {
      const response = await axiosInstance.post("/cart/add", {
        productId,
        quantity: 1,
        size,
      });
      setCartItems(response.data.items || []);
      toast.success("Item Added To The Cart");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add to cart");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please log in to update your cart");
      navigate("/login");
      return;
    }

    try {
      const currentItem = cartItems.find(
        (item) => item.productId._id === productId && item.size === size
      );
      const endpoint =
        quantity > (currentItem?.quantity || 0)
          ? `/cart/increase`
          : `/cart/decrease`;

      const response = await axiosInstance.post(endpoint, { productId, size });

      if (!response.data.items || !Array.isArray(response.data.items)) {
        throw new Error("Invalid cart items response from server");
      }

      setCartItems(response.data.items);

      toast.success(
        quantity === 0 ? "Item Removed From The Cart" : "Cart Updated"
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update cart");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find((p) => p._id === item.productId._id);
      return total + (product?.price || 0) * (item.quantity || 0);
    }, 0);
  };

  const value = {
    cartItems,
    setCartItems,
    isLoading,
    error,
    currency,
    delivery_fee,
    getCart,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
