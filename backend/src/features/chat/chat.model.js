import mongoose from "mongoose";
import { generateCustomId } from "../../shared/utils/generate-custom-id.js";

const chatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      unique: true,
      index: true,
      immutable: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    isGroupChat: {
      type: Boolean,
      default: false,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    unreadCounts: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true } 
);

chatSchema.index({ participants: 1 });


chatSchema.pre("save", function (next) {
  if (!this.isGroupChat && this.participants.length !== 2) {
    return next(new Error("1-to-1 chat must have exactly 2 participants"));
  }
  next();
});

chatSchema.pre("save", async function (next) {
  if (!this.customId) {
    this.customId = await generateCustomId("CH");
  }
  next();
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
