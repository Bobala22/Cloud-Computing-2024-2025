import Maintenance from '../models/Maintenance.js';

/* ─────────── POST /maintenance – create a new report ─────────── */
export const createIssue = async (req, res) => {
  try {
    const data = {
      user: req.user._id,          // set from auth middleware
      carId:       req.body.carId,
      category:    req.body.category,
      description: req.body.description,
      dateObserved:req.body.dateObserved,
      urgency:     req.body.urgency,
    };

    // simple required-field check
    if (!data.carId || !data.category || !data.description) {
      return res.status(400).json({ message: 'carId, category and description are required.' });
    }

    const issue = await Maintenance.create(data);
    res.status(201).json(issue);
  } catch (err) {
    console.error('Error creating issue:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ─────────── GET /maintenance – list (all for admin, own for driver) ─────────── */
export const getIssues = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const issues = await Maintenance.find(filter).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ─────────── GET /maintenance/:id ─────────── */
export const getIssueById = async (req, res) => {
  try {
    const issue = await Maintenance.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (req.user.role !== 'admin' && !issue.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(issue);
  } catch (err) {
    console.error('Error fetching issue:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ─────────── PUT /maintenance/:id – update ─────────── */
export const updateIssue = async (req, res) => {
  try {
    const issue = await Maintenance.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const isOwner = issue.user.equals(req.user._id);
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    /* allowed fields */
    const baseFields   = ['category', 'description', 'urgency', 'dateObserved'];
    const adminFields  = ['status', 'carId'];  // only admins may change these
    const allowed      = req.user.role === 'admin' ? [...baseFields, ...adminFields] : baseFields;

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) issue[field] = req.body[field];
    });

    await issue.save();
    res.json(issue);
  } catch (err) {
    console.error('Error updating issue:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ─────────── DELETE /maintenance/:id ─────────── */
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Maintenance.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const isOwner = issue.user.equals(req.user._id);
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await issue.deleteOne();
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    console.error('Error deleting issue:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
