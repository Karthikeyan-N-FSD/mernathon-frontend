import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { OrderContext } from "../context/OrderContext";
import SuccessModal from "../components/SuccessModal";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const PlaceOrder = () => {
  const { navigate, cartItems, resetContextData } = useContext(ShopContext);
  const { placeOrder } = useContext(OrderContext);
  const { getUserProfile } = useAuth();
  const { setCartItems } = useContext(CartContext);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    mobile: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { name, email, mobile, shippingAddress } = await getUserProfile();
        setUserDetails({
          name: name || "",
          email: email || "",
          mobile: mobile || "",
        });
        setShippingAddress({
          street: shippingAddress?.street || "",
          city: shippingAddress?.city || "",
          state: shippingAddress?.state || "",
          zip: shippingAddress?.zip || "",
          country: shippingAddress?.country || "",
          mobile: shippingAddress?.mobile || "",
        });
      } catch (err) {
        toast.error(err.message || "Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [getUserProfile]);

  const handlePlaceOrder = async () => {
    const { city, zip, country, street, state } = shippingAddress;
    const { name, email, mobile } = userDetails;

    const isEmailValid = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const isMobileValid = (mobile) => /^[0-9]{7,15}$/.test(mobile.trim());

    if (!state || !city || !zip || !country || !mobile || !street) {
      toast.error("Please ensure all shipping address fields are filled in your profile.");
      return;
    }

    if (!isEmailValid(email)) {
      toast.error("Please provide a valid email address in your profile.");
      return;
    }

    if (!isMobileValid(mobile)) {
      toast.error("Please provide a valid mobile number (7–15 digits) in your profile.");
      return;
    }

    setLoading(true);
    try {
      await placeOrder(
        {
          street: `${name} ${city}`,
          city,
          zip,
          country,
          state,
        },
        cartItems,
        resetContextData
      );
      setCartItems([]);
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/orders");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-evenly gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t">
        <div className="flex flex-col w-full gap-4 sm:max-w-[480px]">
          <div className="my-3 text-xl sm:text-2xl">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded disabled:bg-gray-100 cursor-not-allowed"
            type="email"
            name="email"
            placeholder="Email Address"
            value={userDetails.email}
            disabled
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="text"
            name="street"
            placeholder="Street"
            value={shippingAddress.street}
            onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
          />
          <div className="flex gap-3">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="state"
              placeholder="State"
              value={shippingAddress.state}
              onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="zip"
              placeholder="Zip Code"
              value={shippingAddress.zip}
              onChange={e => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              name="country"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}
            />
          </div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded"
            type="tel"
            name="mobile"
            placeholder="Mobile"
            value={userDetails.mobile}
            onChange={e => setUserDetails({ ...userDetails, mobile: e.target.value })}
          />
        </div>

        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>
          <div className="w-full mt-8 text-end">
            <button
              onClick={handlePlaceOrder}
              className="px-16 py-3 text-sm text-white bg-black active:bg-gray-800"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

      {showModal && <SuccessModal onClose={handleModalClose} />}
    </>
  );
};

export default PlaceOrder;