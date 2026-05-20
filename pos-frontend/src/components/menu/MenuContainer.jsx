import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { GrRadialSelected } from "react-icons/gr";

import { getCategories, getDishesByCategory } from "../../https";
import { addItems } from "../../redux/slices/cartSlice";

const MenuContainer = () => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSpiceSelector, setShowSpiceSelector] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [spiceLevel, setSpiceLevel] = useState("Medium");

  // ================= GET CATEGORIES =================
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // ================= GET DISHES =================
  const { data: dishes = [] } = useQuery({
    queryKey: ["dishes", selectedCategory?._id],
    queryFn: () => getDishesByCategory(selectedCategory._id),
    enabled: !!selectedCategory,
  });

  // ================= CHECK SPICE REQUIRED =================
  const requiresSpiceLevel = (item) => {
    const tags = item.tags || [];

    // ❌ NO SPICE FOR THESE
    if (
      tags.includes("cold") ||
      selectedCategory?.name?.toLowerCase().includes("dessert") ||
      selectedCategory?.name?.toLowerCase().includes("beverage") ||
      selectedCategory?.name?.toLowerCase().includes("drink") ||
      selectedCategory?.name?.toLowerCase().includes("alcohol")
    ) {
      return false;
    }

    return true;
  };

  // ================= ADD TO CART =================
  const addToCart = (item, spice = "None") => {
    dispatch(
      addItems({
        id: Date.now() + Math.random(),

        name: item.name,

        spiceLevel: spice,

        pricePerQuantity: Number(item.price),

        quantity: 1,

        price: Number(item.price),

        tags: item.tags || [],
      })
    );
  };

  // ================= CLICK =================
  const handleItemClick = (item) => {
    setSelectedItem(item);

    // ✅ SHOW SPICE ONLY WHEN NEEDED
    if (requiresSpiceLevel(item)) {
      setShowSpiceSelector(true);
    } else {
      addToCart(item);
    }
  };

  // ================= CONFIRM =================
  const confirmAddToCart = () => {
    addToCart(selectedItem, spiceLevel);

    setShowSpiceSelector(false);
    setSelectedItem(null);
    setSpiceLevel("Medium");
  };

  // ================= GROUP ITEMS =================
  const groupedItems = dishes.reduce((acc, item) => {
    let key = "Others";

    if (item.tags?.includes("veg")) key = "Veg 🟢";
    else if (item.tags?.includes("non-veg")) key = "Non-Veg 🔴";
    else if (item.tags?.includes("cold")) key = "Cold ❄️";
    else if (item.tags?.includes("hot")) key = "Hot 🔥";

    if (!acc[key]) acc[key] = [];

    acc[key].push(item);

    return acc;
  }, {});

  return (
    <>
      {/* ================= CATEGORY ================= */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => setSelectedCategory(cat)}
            className={`p-4 rounded-xl cursor-pointer transition ${
              selectedCategory?._id === cat._id
                ? "bg-[#333]"
                : "bg-[#1a1a1a]"
            }`}
          >
            <div className="flex justify-between">
              <h1 className="text-white font-semibold">
                {cat.name}
              </h1>

              {selectedCategory?._id === cat._id && (
                <GrRadialSelected className="text-white" />
              )}
            </div>
          </div>
        ))}
      </div>

      <hr className="border-[#2a2a2a]" />

      {/* ================= ITEMS ================= */}
      <div className="px-10 py-4">
        {!selectedCategory ? (
          <p className="text-gray-400">Select a category</p>
        ) : dishes.length === 0 ? (
          <p className="text-gray-400">No dishes found</p>
        ) : (
          Object.keys(groupedItems).map((group) => (
            <div key={group} className="mb-6">
              <h2 className="text-yellow-400 font-bold mb-3 text-lg">
                {group}
              </h2>

              <div className="grid grid-cols-4 gap-4">
                {groupedItems[group].map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    className="bg-[#1a1a1a] hover:bg-[#2a2a2a] p-4 rounded-xl cursor-pointer border border-[#2a2a2a] transition"
                  >
                    {/* NAME */}
                    <h1 className="text-white font-semibold">
                      {item.name}
                    </h1>

                    {/* TAGS */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 rounded capitalize ${
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

                    {/* PRICE */}
                    <p className="text-green-400 font-bold mt-3 text-lg">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= SPICE SELECTOR ================= */}
      {showSpiceSelector && (
        <div className="fixed bottom-24 left-[35%] bg-[#2a2a2a] px-6 py-4 rounded-xl shadow-lg border border-[#3a3a3a] z-50">
          <h2 className="text-white mb-3 font-semibold">
            Select Spice Level 🌶️
          </h2>

          <div className="flex gap-4 mb-3">
            {["Mild", "Medium", "Spicy"].map((level) => (
              <button
                key={level}
                onClick={() => setSpiceLevel(level)}
                className={`px-4 py-2 rounded transition ${
                  spiceLevel === level
                    ? "bg-yellow-500 text-black"
                    : "bg-[#1f1f1f] text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            onClick={confirmAddToCart}
            className="bg-yellow-500 w-full py-2 rounded font-bold hover:bg-yellow-400 transition"
          >
            Add Item
          </button>
        </div>
      )}
    </>
  );
};

export default MenuContainer;