import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function buildForVercel() {
  console.log("🏗️  Building for Vercel deployment...");

  try {
    // Build client
    console.log("📦 Building client...");
    process.env.NODE_ENV = "production";
    await execAsync("npx vite build");

    // Build server
    console.log("🖥️  Building server...");
    process.env.VITE_SSR = "true";
    await execAsync("npx vite build");

    console.log("✅ Vercel build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error.message);
    process.exit(1);
  }
}

buildForVercel();