const { printLotReceipt } = require("../utils/thermalPrinter");
const { printKOT } = require("../utils/printKOT");

const printHandler = async (req, res) => {
  try {
    const { type, order } = req.body;

    if (type === "bill") {
      await printLotReceipt({
        port: "COM7",
        orderId: order._id,
        customer: order.customerDetails?.name || "Guest",
        table: order.table?.tableNo || "-",
        items: order.items || [],
      });
    }

    if (type === "kot") {
      await printKOT({
        customer: order.customerDetails?.name || "Guest",
        table: order.tableNo || "-",
        items: order.items || [],
      });
    }

    res.json({ success: true });

  } catch (err) {
    console.log("❌ Print Error:", err);
    res.status(500).json({ message: "Print failed" });
  }
};

module.exports = { printHandler };