import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      unique: true,
      trim: true,
      maxlength: [25, "Project name can not exceed 25 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "developer", "viewer", "tester"],
          default: "viewer",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    labels: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          maxlength: 30,
        },
        description: {
          type: String,
          maxlength: 100,
        },
      },
    ],
    status: {
      isArchived: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      deletedAt: Date,
    },
    workflow: [
      {
        id: {
          type: String,
          required: true,
          lowercase: true,
          trim: true,
        },
        name: {
          type: String,
          required: true,
        },
        isInitial: {
          type: Boolean,
          default: false,
        },
        isFinal: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    settings: {
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      issueAutoAssign: {
        type: Boolean,
        default: false,
      },
      defaultAssignee: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      issuePrefix: {
        type: String,
        uppercase: true,
        trim: true,
        maxlength: 5,
        default: "PROJ",
      },
    },
    stats: {
      issueCount: {
        type: Number,
        default: 0,
      },
      memberCount: {
        type: Number,
        default: 1,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Middleware to create slug from name
projectSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

//Prevent duplicate members
projectSchema.path("members").validate(function (members) {
  const userIds = members.map(m => m.userId.toString());
  return new Set(userIds).size === userIds.length;
}, "Duplicate members are not allowed");

// indexes
projectSchema.index({ name: "text", description: "text" });
projectSchema.index({ owner: 1 });
projectSchema.index({ "members.userId": 1 });
projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ "status.isArchived": 1, "status.isActive": 1 });

const Project = mongoose.model("Project", projectSchema);
export default Project;
