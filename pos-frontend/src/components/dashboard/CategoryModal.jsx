import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, addCategory } from "../../https";
import { enqueueSnackbar } from "notistack";

const CategoryModal = ({ setModalType }) => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  // ================= FETCH =================
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // ✅ FIX ERROR HANDLING
  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Failed to load categories", { variant: "error" });
    }
  }, [isError]);

  // ================= ADD =================
  const mutation = useMutation({
    mutationFn: addCategory,

    onSuccess: () => {
      setName("");
      enqueueSnackbar("Category added!", { variant: "success" });

      queryClient.invalidateQueries(["categories"]);
    },

    onError: () => {
      enqueueSnackbar("Failed to add category", { variant: "error" });
    },
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={() => setModalType(null)}
    >
      <div
        className="bg-[#262626] p-6 rounded w-[500px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Categories</h2>
          <IoMdClose
            className="cursor-pointer text-white text-xl"
            onClick={() => setModalType(null)}
          />
        </div>

        {/* LIST */}
        <div className="mt-4 space-y-2 overflow-y-auto pr-2 custom-scroll flex-1">
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() =>
                  setModalType({
                    type: "dish",
                    category: cat,
                  })
                }
                className="bg-[#1f1f1f] p-3 rounded text-white cursor-pointer hover:bg-[#333] transition"
              >
                {cat.name}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No categories found</p>
          )}
        </div>

        {/* ADD CATEGORY */}
        <div className="mt-4">
          <input
            className="w-full p-2 bg-[#1f1f1f] text-white rounded"
            placeholder="New Category"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={() => {
              if (!name.trim()) {
                enqueueSnackbar("Enter category name", {
                  variant: "warning",
                });
                return;
              }

              mutation.mutate({ name });
            }}
            className="bg-yellow-400 w-full mt-2 p-2 font-bold rounded"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;