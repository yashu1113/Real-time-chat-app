import mongoose from "mongoose";
import { generateCustomId } from "../../shared/utils/generate-custom-id.js";

const messageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      unique: true,
      index: true,
      immutable: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ chat: 1, createdAt: 1 });

messageSchema.pre("save", async function (next) {
  if (!this.customId) {
    this.customId = await generateCustomId("MS");
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
