import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This feature is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const projectDir = process.cwd();

    // Check if there are changes to commit
    const { stdout: statusOutput } = await execAsync("git status --porcelain", {
      cwd: projectDir,
    });

    if (!statusOutput.trim()) {
      return NextResponse.json({
        success: true,
        message: "No changes to push. Everything is up to date!",
        alreadyUpToDate: true,
      });
    }

    // Get list of changed files
    const changedFiles = statusOutput
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    // Stage all changes
    await execAsync("git add -A", { cwd: projectDir });

    // Create commit with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const commitMessage = `Add new articles - ${timestamp}`;

    await execAsync(
      `git commit -m "${commitMessage}"`,
      { cwd: projectDir }
    );

    // Push to origin main
    const { stdout: pushOutput, stderr: pushStderr } = await execAsync(
      "git push origin main",
      { cwd: projectDir }
    );

    return NextResponse.json({
      success: true,
      message: "Successfully pushed to live! Vercel will auto-deploy.",
      changedFiles: changedFiles.length,
      commitMessage,
      output: pushOutput || pushStderr,
    });
  } catch (error) {
    console.error("Error pushing to live:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Check for common git errors
    if (errorMessage.includes("nothing to commit")) {
      return NextResponse.json({
        success: true,
        message: "No changes to push. Everything is up to date!",
        alreadyUpToDate: true,
      });
    }

    if (errorMessage.includes("Authentication failed")) {
      return NextResponse.json(
        {
          error:
            "Git authentication failed. Please check your credentials or use SSH.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `Failed to push: ${errorMessage}` },
      { status: 500 }
    );
  }
}
