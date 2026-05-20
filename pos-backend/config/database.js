const mongoose = require("mongoose");
const config = require("./config");
const dns = require("node:dns");

// This line tells Node.js to use Google's DNS servers
// It fixes the "Name resolution failed" error you saw in PowerShell
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        // We add a timeout so it doesn't hang forever if the network is blocked
        const conn = await mongoose.connect(config.databaseURI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`❌ Connection Error: ${error.message}`);
        // 1 indicates the process exited with an error
        process.exit(1);
    }
}

module.exports = connectDB;