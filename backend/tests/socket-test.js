import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const testSocketConnection = async () => {
  console.log("🧪 Starting Socket.IO connection test...\n");

  const token = process.argv[2];

  if (!token) {
    console.error("❌ Error: JWT token required");
    console.log("\nUsage: node tests/socket-test.js <YOUR_JWT_TOKEN>");
    console.log("\nTo get a token:");
    console.log("1. Login via POST http://localhost:5000/api/auth/login");
    console.log("2. Copy the 'token' from response");
    console.log("3. Run: node tests/socket-test.js <token>\n");
    process.exit(1);
  }

  const socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO server");
    console.log(`📡 Socket ID: ${socket.id}\n`);

    console.log("📤 Testing ping event...");
    socket.emit("ping", { message: "Hello from test client!" });
  });

  socket.on("pong", (data) => {
    console.log("📥 Received pong:", data);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Connection error:", error.message);
    process.exit(1);
  });

  socket.on("disconnect", (reason) => {
    console.log(`\n🔌 Disconnected: ${reason}`);
    process.exit(0);
  });

  setTimeout(() => {
    console.log("\n✅ Test completed. Disconnecting...");
    socket.disconnect();
  }, 3000);
};

testSocketConnection();
