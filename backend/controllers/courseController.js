import { CourseModel } from '../models/courseModel.js';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find();
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};


// export const createCourse = async (req, res) => {
//   try {
//     const { title, description, category, price } = req.body;

//     // Basic validation
//     if (!title || !description || !price) {
//       return res.status(400).json({ success: false, message: 'All fields are required' });
//     }

//     const imagePath = req.file?.path;
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }

//     const newCourse = await CourseModel.create({
//       title,
//       description,
//       category,
//       price,
//       image: imagePath,
//       createdBy: userId,
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Course created successfully',
//       course: newCourse,
//     });
//   } catch (error) {
//     console.error("Error creating course:", error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create course',
//       error: error.message,
//     });
//   }
// };


export const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    // Parse JSON string into object
    let chapters = [];
    if (req.body.chapters) {
      chapters = JSON.parse(req.body.chapters); 
    }

    const imagePath = req.file?.path;
    const userId = req.user?.id;

    const newCourse = await CourseModel.create({
      title,
      description,
      category,
      price,
      image: imagePath,
      chapters,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message,
    });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Parse chapters if sent as string
    if (req.body.chapters) {
      updates.chapters = JSON.parse(req.body.chapters); // Ensure it's an array of objects
    }

    // Handle image upload
    if (req.file) {
      updates.image = req.file.path;
    }

    const updated = await CourseModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course updated", course: updated });
  } catch (err) {
    console.error("Update course error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const deleteCourse = async (req, res) => {
  try {
    await CourseModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
