import dotEnv from "dotenv";
import app from "./src/app.js";
import { connectDb } from "./src/config/db.js";

dotEnv.config();

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};
startServer();
