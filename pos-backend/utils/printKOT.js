const { SerialPort } = require("serialport");

// ✅ SAME WIDTH (IMPORTANT)
const LINE_WIDTH = 42;

const printKOT = async (data) => {
  const port = new SerialPort({
    path: "COM7",
    baudRate: 9600,
    autoOpen: false,
  });

  const openPort = () =>
    new Promise((resolve, reject) => {
      port.open((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

  const write = (text) =>
    new Promise((resolve, reject) => {
      port.write(text, "ascii", (err) => {
        if (err) return reject(err);
        port.drain(resolve);
      });
    });

  try {
    await openPort();

    await new Promise((res) => setTimeout(res, 500));

    const line = "-".repeat(LINE_WIDTH) + "\n";

    await write("\x1B\x40"); // INIT

    // HEADER
    await write(line);
    await write(center("RESTRO POS") + "\n");
    await write(center("KITCHEN ORDER") + "\n");
    await write(line);

    // INFO
    await write(`Table: ${data.table || "-"}\n`);
    await write(`Cust : ${data.customer || "Guest"}\n`);
    await write(center(new Date().toLocaleString()) + "\n");

    await write(line);

    // ITEMS
    for (const item of data.items) {
      let text = `${item.quantity} x ${item.name}`;

      if (item.spiceLevel) {
        text += ` (${item.spiceLevel})`;
      }

      // Trim if too long
      if (text.length > LINE_WIDTH) {
        text = text.substring(0, LINE_WIDTH);
      }

      await write(text + "\n");
    }

    await write(line);

    // FOOTER
    await write(center("Send To Kitchen") + "\n");

    // FEED
    await write("\x1B\x64\x04");

    port.close();

  } catch (err) {
    console.log("❌ KOT Error:", err.message);
  }
};

// ================= HELPER =================

function center(text) {
  text = String(text);
  const left = Math.floor((LINE_WIDTH - text.length) / 2);
  return " ".repeat(Math.max(0, left)) + text;
}

module.exports = { printKOT };