import Ticket from "../models/ticketModel.js";

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res) => {
  try {
    const { title, description, project, assignee, status, priority, type } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    const newTicket = new Ticket({
      title,
      description,
      project,
      reporter: req.user._id, // Assumes authMiddleware sets req.user
      assignee: assignee || null,
      status: status || "To Do",
      priority: priority || "Medium",
      type: type || "Task",
    });

    const savedTicket = await newTicket.save();
    res.status(201).json({ message: "Ticket created successfully", data: savedTicket });
  } catch (error) {
    console.error("Error in createTicket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all tickets for a specific project
// @route   GET /api/tickets/project/:projectId
// @access  Private
export const getProjectTickets = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tickets = await Ticket.find({ project: projectId })
      .populate("assignee", "name email avatar")
      .populate("reporter", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    console.error("Error in getProjectTickets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id)
      .populate("assignee", "name email avatar")
      .populate("reporter", "name email avatar");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error("Error in getTicketById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a ticket
// @route   PATCH /api/tickets/:id
// @access  Private
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    // We use findByIdAndUpdate to apply partial updates (PATCH)
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("assignee", "name email avatar")
      .populate("reporter", "name email avatar");

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket updated successfully", data: updatedTicket });
  } catch (error) {
    console.error("Error in updateTicket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a ticket
// @route   DELETE /api/tickets/:id
// @access  Private
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket deleted successfully", data: {} });
  } catch (error) {
    console.error("Error in deleteTicket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
