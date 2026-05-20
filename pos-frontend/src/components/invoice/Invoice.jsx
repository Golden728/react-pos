import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { createOrderRazorpay, verifyPaymentRazorpay, updateOrderStatus } from "../../https";
import { enqueueSnackbar } from "notistack";

const Invoice = ({ orderInfo, setShowInvoice }) => {

  const invoiceRef = useRef(null);

  const [paymentMethod, setPaymentMethod] = useState("");



  // PRINT RECEIPT

  const handlePrint = () => {

    const printContent = invoiceRef.current.innerHTML;

    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
      <html>
        <head>
          <title>Order Receipt</title>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    WinPrint.document.close();

    WinPrint.focus();

    setTimeout(() => {

      WinPrint.print();

      WinPrint.close();

    }, 500);

  };



  // PAY NOW FUNCTION

  const handlePayNow = async () => {

    try {

      if (!paymentMethod) {

        enqueueSnackbar("Select payment method", { variant: "warning" });

        return;

      }



      // CASH PAYMENT

      if (paymentMethod === "Cash") {

        await updateOrderStatus({

          orderId: orderInfo._id,

          orderStatus: "Completed"

        });

        enqueueSnackbar("Cash Payment Successful", { variant: "success" });

        return;

      }



      // ONLINE PAYMENT

      const { data } = await createOrderRazorpay({

        amount: orderInfo.bills.totalWithTax,

        orderId: orderInfo._id

      });



      const options = {

        key: import.meta.env.VITE_RAZORPAY_KEY,

        amount: data.amount,

        currency: "INR",

        name: "Restro POS",

        order_id: data.id,



        handler: async function (response) {

          await verifyPaymentRazorpay({

            razorpay_order_id: response.razorpay_order_id,

            razorpay_payment_id: response.razorpay_payment_id,

            razorpay_signature: response.razorpay_signature,

            orderId: orderInfo._id

          });



          await updateOrderStatus({

            orderId: orderInfo._id,

            orderStatus: "Completed"

          });



          enqueueSnackbar("Payment Successful", {

            variant: "success"

          });

        }

      };



      const rzp = new window.Razorpay(options);

      rzp.open();



    } catch (error) {

      enqueueSnackbar("Payment Failed", {

        variant: "error"

      });

    }

  };



  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

      <div className="bg-white p-4 rounded-lg shadow-lg w-[400px]">




        {/* RECEIPT */}

        <div ref={invoiceRef} className="p-4">

          <div className="flex justify-center mb-4">

            <motion.div className="w-12 h-12 border-8 border-green-500 rounded-full flex items-center justify-center bg-green-500">

              <FaCheck className="text-white text-xl"/>

            </motion.div>

          </div>



          <h2 className="text-xl font-bold text-center mb-2">

            Order Receipt

          </h2>



          <p>Name: {orderInfo.customerDetails.name}</p>

          <p>Phone: {orderInfo.customerDetails.phone}</p>



          <hr className="my-2"/>



          {orderInfo.items.map((item,index)=>(

            <div key={index} className="flex justify-between">

              <p>{item.name} x {item.quantity}</p>

              <p>₹{item.price}</p>

            </div>

          ))}



          <hr className="my-2"/>



          <p>Total ₹{orderInfo.bills.totalWithTax}</p>



        </div>



        {/* PAYMENT BUTTONS */}



        <div className="flex gap-2 mt-3">

          <button

            onClick={()=>setPaymentMethod("Cash")}

            className={`w-full py-2 rounded 

            ${paymentMethod==="Cash" ? "bg-green-600 text-white":"bg-gray-200"}`}

          >

            Cash

          </button>



          <button
            onClick={()=>setPaymentMethod("Online")}
            className={`w-full py-2 rounded 
            ${paymentMethod==="Online" ? "bg-blue-600 text-white":"bg-gray-200"}`}
          >
            Online
          </button>
        </div>
        <button
          onClick={handlePayNow}
          className="bg-yellow-500 w-full py-3 mt-3 rounded font-bold"
        >
          Pay Now
        </button>
        {/* PRINT & CLOSE */}
        <div className="flex justify-between mt-3">
          <button
            onClick={handlePrint}
            className="text-blue-500"
          >
            Print
          </button>
          <button
            onClick={()=>setShowInvoice(false)}
            className="text-red-500">
            Close
          </button>
        </div>
      </div>
    </div>

  );

};

export default Invoice;
