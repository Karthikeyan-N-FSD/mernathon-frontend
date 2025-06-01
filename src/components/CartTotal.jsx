import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import Title from "./Title";
import axiosInstance from "../utils/axiosInstance";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(CartContext);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async () => {
    setIsApplying(true);
    setCouponMsg("");
    try {
      const res = await axiosInstance.post("/subscribe/validate", {
        code: coupon,
      });
      if (res.data.valid) {
        setDiscount(res.data.discount);
        setCouponMsg(res.data.message);
      } else {
        setDiscount(0);
        setCouponMsg(res.data.message);
      }
    } catch (err) {
      setDiscount(0);
      setCouponMsg("Server error. Try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const subtotal = getCartAmount();
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + delivery_fee;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTAL"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p className="text-lg font-medium">Sub Total</p>
          <p className="text-lg font-medium">
            {currency}{" "}
            {subtotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <p className="text-lg font-medium">Discount</p>
            <p className="text-lg font-medium">
              -{currency}{" "}
              {discountAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        )}
        <hr />
        <div className="flex justify-between">
          <p className="text-lg font-medium">Shipping Fee</p>
          <p className="text-lg font-medium">
            {currency}{" "}
            {delivery_fee.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter 6-digit coupon code"
              className="w-full sm:w-2/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              maxLength={6}
            />
            <button
              className={`w-full sm:w-1/3 bg-black text-white p-2 rounded transition-colors text-base font-medium ${
                isApplying ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleApplyCoupon}
              disabled={isApplying || coupon.length !== 6}
            >
              {isApplying ? "Applying..." : "Apply Coupon"}
            </button>
          </div>
          {couponMsg && (
            <p
              className={`text-xs ${
                discount > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {couponMsg}
            </p>
          )}
        </div>
        <hr />
        <div className="flex justify-between">
          <p className="text-2xl font-semibold">Total Amount</p>
          <p className="text-2xl font-semibold">
            {currency}{" "}
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
