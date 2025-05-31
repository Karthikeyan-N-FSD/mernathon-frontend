import { useContext, useEffect } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Wishlist = () => {
  const {
    wishlistData,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    currency,
    fetchWishlist,
    isLoading,
    error,
  } = useContext(WishlistContext);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = (itemId) => {
    if (wishlistItems[itemId]) {
      removeFromWishlist(itemId);
    } else {
      addToWishlist(itemId);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading wishlist...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!wishlistData) {
    return <p className="text-center text-gray-500">Your wishlist is empty.</p>;
  }

  return (
    <div className="border-t pt-14 px-4">
      <div className="mb-6 text-2xl font-semibold">
        <Title text1="YOUR" text2="WISHLIST" />
      </div>
      {wishlistData.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid gap-6">
          {wishlistData.map((item) => (
            <div
              key={item.productId._id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                className="w-24 h-24 object-cover"
                src={`${import.meta.env.VITE_SERVER_URL}/images/${item.productId.image[0]}.png`}
                alt={item.productId.name || "Product"}
              />
              <div className="flex-1">
                <h3 className="font-medium">
                  {item.productId.name || "Unknown Product"}
                </h3>
                <p className="text-sm text-gray-500">
                  {currency}&nbsp;
                  {(item.productId.price || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <button
                  className="px-4 py-2 text-sm text-white bg-black active:bg-gray-700"
                  aria-label="Add to cart"
                  onClick={() =>
                    addToCart(
                      item.productId._id,
                      item.productId.sizes?.[0] || ""
                    )}
                >
                  ADD TO CART
                </button>
                <img
                  src={assets.bin_icon}
                  alt="Remove"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => toggleWishlist(item.productId._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
