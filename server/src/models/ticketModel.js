import mongoose, { Schema } from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Ticket title is required"],
      trim: true,
      maxlength: [100, "Ticket title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    type: {
      type: String,
      enum: ["Task", "Bug", "Story"],
      default: "Task",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes to optimize querying by project and assignee
ticketSchema.index({ project: 1 });
ticketSchema.index({ assignee: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
