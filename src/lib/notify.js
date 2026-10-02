import { pb } from "./pb";

// Sends one notification to one user. Never breaks the main action if it fails.
export async function notify(userId, title, message, type = "info") {
  if (!userId) return;
  try {
    await pb.collection("notifications").create({
      user: userId,
      title,
      message,
      type, // "info" | "success" | "warning"
      is_read: false,
    });
  } catch (err) {
    console.warn("Notification failed:", err);
  }
}
