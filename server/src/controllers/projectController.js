import Project from "../models/projectModel.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description, avatar, members, labels, workflow, settings } =
      req.body;
    const project = new Project({
      name,
      description,
      avatar,
      owner: req.user._id,
      members,
      labels,
      workflow,
      settings,
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: error.message });
  }
};
// get all project
export const getProjects = async (req, res) => {
  try {
    const filter = {};
    // specific to user
    // filter.owner = req.user._id
    const projects = await Project.find(filter).populate("owner", "name email");
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get project by id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found " });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update Project by id
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found " });
    }
    const fields = [
      "name",
      "description",
      "avatar",
      "members",
      "labels",
      "workflow",
      "settings",
      "status",
    ];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete project

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.status.isArchived = true;
    project.status.isActive = false;
    project.status.deletedAt = new Date();
    await project.save();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
