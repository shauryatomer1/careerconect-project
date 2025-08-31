const SavedJob = require("../models/SavedJob");

// @desc    Save a job
exports.saveJob = async (req, res) => {
  try {
    const exists = await SavedJob.findOne({ job: req.params.jobId, jobseeker: req.user._id });
    if (exists) return res.status(400).json({ message: "Job already saved" });

    const saved = await SavedJob.create({ job: req.params.jobId, jobseeker: req.user._id });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to save job", error: err.message });
  }
};
// @desc    Unsave a job
exports.unsaveJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({ job: req.params.jobId, jobseeker: req.user._id });
    res.json({ message: "Job removed from saved list" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove saved job", error: err.message });
  }
};
// @desc    Get saved jobs for current user
exports.getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ jobseeker: req.user._id })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name companyName companyLogo",
        },
      });

    res.json(savedJobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved jobs", error: err.message });
  }
};
// // @desc    Get single saved job by ID
// exports.getSavedJobById = async (req, res) => {
//   try {
//     const savedJob = await SavedJob.findOne({
//       _id: req.params.id,
//       jobseeker: req.user._id, // ensure user can only view their own saved jobs
//     }).populate({
//       path: "job",
//       populate: {
//         path: "company",
//         select: "name companyName companyLogo",
//       },
//     });

//     if (!savedJob) {
//       return res.status(404).json({ message: "Saved job not found" });
//     }

//     res.json(savedJob);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch saved job", error: err.message });
//   }
// };
