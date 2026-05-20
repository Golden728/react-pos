import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";

import { removeItem } from "../../redux/slices/cartSlice";

const Cartinfo = () => {
  const cartData = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const scrollRef = useRef();

  // ================= SMART SCROLL =================
  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop <=
      el.clientHeight + 50;

    if (isNearBottom) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  // ================= TOTAL =================
  const total = cartData.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <div className="p-4">
      {/* TITLE */}
      <h1 className="text-white text-lg font-semibold mb-3">
        Order Details
      </h1>

      {/* ================= CART ITEMS ================= */}
      <div
        className="h-[350px] overflow-y-auto scrollbar-hide"
        ref={scrollRef}
      >
        {cartData.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">
            Your cart is empty
          </p>
        ) : (
          cartData.map((item) => (
            <div
              key={item.id}
              className="bg-[#1f1f1f] p-3 rounded-xl mb-3 border border-[#2a2a2a]"
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div>
                  {/* NAME */}
                  <h2 className="text-white font-semibold">
                    {item.name}
                  </h2>

                  {/* SPICE */}
                  {item.spiceLevel &&
                    item.spiceLevel !== "None" && (
                      <p className="text-yellow-400 text-xs mt-1">
                        🌶️ {item.spiceLevel}
                      </p>
                    )}

                  {/* TAGS */}
                  {item.tags?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] px-2 py-1 rounded capitalize ${
                            tag === "veg"
                              ? "bg-green-600 text-white"
                              : tag === "non-veg"
                              ? "bg-red-600 text-white"
                              : tag === "hot"
                              ? "bg-orange-500 text-white"
                              : tag === "cold"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-700 text-white"
                          }`}
                        >
                          {tag === "veg" && "🟢 "}
                          {tag === "non-veg" && "🔴 "}
                          {tag === "hot" && "🔥 "}
                          {tag === "cold" && "❄️ "}
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* QUANTITY */}
                <div className="text-gray-400 font-bold">
                  x{item.quantity}
                </div>
              </div>

              {/* BOTTOM */}
              <div className="flex justify-between items-center mt-3">
                {/* DELETE */}
                <RiDeleteBin2Fill
                  onClick={() =>
                    dispatch(removeItem(item.id))
                  }
                  className="text-red-400 cursor-pointer text-lg hover:text-red-500"
                />

                {/* PRICE */}
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    ₹{item.pricePerQuantity} ×{" "}
                    {item.quantity}
                  </p>

                  <p className="text-green-400 font-bold text-lg">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= TOTAL ================= */}
      <div className="mt-4 border-t border-[#2a2a2a] pt-3">
        <div className="flex justify-between text-white">
          <span>Total</span>

          <span className="font-bold text-yellow-400 text-xl">
            ₹{total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Cartinfo;