import Counter from "../models/counter.model.js";

export async function generateCustomId(prefix) {
  const counter = await Counter.findByIdAndUpdate(
    prefix,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  
  const paddedNumber = String(counter.seq).padStart(4, "0");
  return `${prefix}${paddedNumber}`;
}
