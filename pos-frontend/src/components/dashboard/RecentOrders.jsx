import React, { useEffect } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrder } from "../../https/index";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const queryClient = useQueryClient();

  // ================= FETCH =================
  const { data: orders = [], isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });

  // ✅ FIX: proper error handling
  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }, [isError]);

  // ================= UPDATE =================
  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrder({ orderId, orderStatus }),

    onSuccess: () => {
      enqueueSnackbar("Order status updated!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
    },

    onError: () => {
      enqueueSnackbar("Update failed!", { variant: "error" });
    },
  });

  const handleStatusChange = ({ orderId, orderStatus }) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  if (isLoading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">

      <h2 className="text-white text-xl mb-4">Recent Orders</h2>

      <table className="w-full text-white">
        <thead className="bg-[#333]">
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Date</th>
            <th>Total</th>
            <th>Payment</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-400">
                No Orders Found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>

                <td>#{order._id.slice(-6)}</td>

                <td>{order.customerDetails?.name}</td>

                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange({
                        orderId: order._id,
                        orderStatus: e.target.value,
                      })
                    }
                  >
                    <option>In Progress</option>
                    <option>Ready</option>
                    <option>Completed</option>
                  </select>
                </td>

                <td>{formatDateAndTime(order.orderDate)}</td>

                <td>₹{order.bills?.totalWithTax}</td>

                <td>{order.paymentStatus}</td>

              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
};

export default RecentOrders;