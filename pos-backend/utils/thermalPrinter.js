const { SerialPort } = require("serialport");

// ✅ BEST WIDTH FOR 72–75mm
const LINE_WIDTH = 42;

// ✅ TAX %
const TAX_PERCENTAGE = 5;

const printLotReceipt = async (data) => {
  const port = new SerialPort({
    path: data.port,
    baudRate: 9600,
    autoOpen: false,
  });

  // ================= ERROR =================
  port.on("error", (err) => {
    console.log("❌ Serial Port Error:", err.message);
  });

  // ================= OPEN =================
  await new Promise((resolve, reject) => {
    port.open((err) => {
      if (err) return reject(err);

      resolve();
    });
  });

  // SMALL DELAY
  await new Promise((res) => setTimeout(res, 500));

  // ================= WRITE =================
  const write = (text) =>
    new Promise((resolve, reject) => {
      port.write(text, "ascii", (err) => {
        if (err) return reject(err);

        port.drain(resolve);
      });
    });

  try {
    // INIT
    await write("\x1B\x40");

    const line = "-".repeat(LINE_WIDTH) + "\n";

    // ================= HEADER =================
    await write(line);

    await write(center("RESTRO POS") + "\n");
    await write(center(new Date().toLocaleString()) + "\n");

    const orderIdShort = data.orderId
      ? data.orderId.slice(-6)
      : "------";

    await write(center(`Order: ${orderIdShort}`) + "\n");

    await write(line);

    // ================= CUSTOMER =================
    await write(`Cust : ${data.customer || "Guest"}\n`);
    await write(`Table: ${data.table || "-"}\n`);

    await write(line);

    // ================= ITEMS =================
    let subtotal = 0;

    for (const item of data.items) {
      const qty = Number(item.quantity) || 1;

      // ✅ item.price already total
      const amount = Number(item.price) || 0;

      subtotal += amount;

      const unitPrice = amount / qty;

      let name = `${item.name} x${qty}`;

      // spice
      if (
        item.spiceLevel &&
        item.spiceLevel !== "None"
      ) {
        name += ` (${item.spiceLevel})`;
      }

      // item name
      await write(name + "\n");

      // item price
      await write(
        align(
          `  ${qty} x ${unitPrice.toFixed(2)}`,
          amount
        ) + "\n"
      );
    }

    await write(line);

    // ================= TAX =================
    const tax =
      (subtotal * TAX_PERCENTAGE) / 100;

    const grandTotal = subtotal + tax;

    // ================= BILL =================
    await write(
      align("Subtotal", subtotal) + "\n"
    );

    await write(
      align(
        `Tax (${TAX_PERCENTAGE}%)`,
        tax
      ) + "\n"
    );

    await write(line);

    // ✅ BIG TOTAL
    await write(
      align("GRAND TOTAL", grandTotal) + "\n"
    );

    await write(line);

    // ================= FOOTER =================
    await write(center("Thank You!") + "\n");

    // FEED PAPER
    await write("\x1B\x64\x04");

  } catch (err) {
    console.log("❌ Print Failed:", err.message);
  } finally {
    port.close((err) => {
      if (err) {
        console.log("❌ Close Error:", err.message);
      }
    });
  }
};

// ================= HELPERS =================

function center(text) {
  text = String(text);

  const left = Math.floor(
    (LINE_WIDTH - text.length) / 2
  );

  return " ".repeat(Math.max(0, left)) + text;
}

function align(left, right) {
  left = String(left);

  right = Number(right).toFixed(2);

  if (left.length > LINE_WIDTH - right.length) {
    left = left.substring(
      0,
      LINE_WIDTH - right.length - 1
    );
  }

  return (
    left +
    " ".repeat(
      LINE_WIDTH - left.length - right.length
    ) +
    right
  );
}

module.exports = { printLotReceipt };