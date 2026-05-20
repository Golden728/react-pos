import React from "react";
import Bill from "../components/menu/Bill";

const Payment = () => {

  return (

    <section className="bg-[#1f1f1f] min-h-screen flex justify-center items-center">

      <div className="bg-[#262626] p-6 rounded-lg w-[400px]">

        <h1 className="text-white text-xl font-bold mb-4">
          Payment
        </h1>

        <Bill />

      </div>

    </section>

  );

};

export default Payment;
