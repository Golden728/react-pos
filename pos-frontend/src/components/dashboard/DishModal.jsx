import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import {
  getDishesByCategory,
  addDish,
  updateDish,
  deleteDish,
} from "../../https";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const DishModal = ({ category, setModalType }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]); // ✅ NEW

  const queryClient = useQueryClient();

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ["dishes", category._id],
    queryFn: () => getDishesByCategory(category._id),
  });

  // ✅ TOGGLE TAG
  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  /* ================= ADD ================= */
  const addMutation = useMutation({
    mutationFn: addDish,
    onSuccess: () => {
      setName("");
      setPrice("");
      setTags([]); // reset

      queryClient.invalidateQueries({
        queryKey: ["dishes", category._id],
      });
    },
  });

  /* ================= UPDATE ================= */
  const updateMutation = useMutation({
    mutationFn: updateDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes", category._id],
      });
    },
  });

  /* ================= DELETE ================= */
  const deleteMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes", category._id],
      });
    },
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={() => setModalType(null)}
    >
      <div
        className="bg-[#262626] p-6 rounded w-[600px] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">
            {category.name} Dishes
          </h2>

          <IoMdClose
            className="cursor-pointer text-white text-xl"
            onClick={() => setModalType(null)}
          />
        </div>

        {/* LIST */}
        <div className="mt-4 space-y-3 overflow-y-auto flex-1 pr-2 custom-scroll">
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : dishes.length > 0 ? (
            dishes.map((dish) => (
              <div
                key={dish._id}
                className="bg-[#1f1f1f] p-3 rounded text-white"
              >
                <div className="flex justify-between items-center">
                  <span>{dish.name}</span>

                  <input
                    type="number"
                    defaultValue={dish.price}
                    onBlur={(e) => {
                      const newPrice = Number(e.target.value);

                      if (newPrice !== dish.price) {
                        updateMutation.mutate({
                          dishId: dish._id,
                          price: newPrice,
                        });
                      }
                    }}
                    className="w-20 bg-black text-white p-1 text-center rounded"
                  />
                </div>

                {/* ✅ TAGS DISPLAY */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {dish.tags?.length > 0 ? (
                    dish.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-700 rounded capitalize"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No tags</span>
                  )}
                </div>

                {/* DELETE */}
                <button
                  onClick={() => deleteMutation.mutate(dish._id)}
                  className="text-red-400 text-sm mt-2"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No dishes found</p>
          )}
        </div>

        {/* ADD DISH */}
        <div className="mt-4 border-t border-gray-700 pt-3">
          <input
            placeholder="Dish Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-2 bg-[#1f1f1f] text-white rounded"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 mb-2 bg-[#1f1f1f] text-white rounded"
          />

          {/* ✅ TAG SELECTOR */}
          <div className="flex flex-wrap gap-2 mb-2">
            {["veg", "non-veg", "hot", "cold"].map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded capitalize ${
                  tags.includes(tag)
                    ? tag === "veg"
                      ? "bg-green-500"
                      : tag === "non-veg"
                      ? "bg-red-500"
                      : tag === "hot"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                    : "bg-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (!name || !price) return;

              addMutation.mutate({
                name,
                price: Number(price),
                categoryId: category._id,
                tags, // ✅ SEND TAGS
              });
            }}
            className="bg-yellow-400 w-full p-2 font-bold rounded"
          >
            Add Dish
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishModal;