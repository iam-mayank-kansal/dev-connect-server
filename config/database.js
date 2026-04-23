const dns = require("dns");
const mongoose = require("mongoose");

function configureMongoDns() {
  const rawServers = process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1";

  const servers = rawServers
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (servers.length > 0) {
    dns.setServers(servers);
  }
}

async function connectToDB() {
  configureMongoDns();

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    if (error.code === "ECONNREFUSED" && error.message?.includes("querySrv")) {
      error.message =
        `${error.message}. Node could not resolve the MongoDB SRV record ` +
        `using the current DNS resolver. Check your local DNS settings or ` +
        `override MONGO_DNS_SERVERS in .env.`;
    }

    throw error;
  }

  console.log("Database connected");
}

module.exports = connectToDB;
