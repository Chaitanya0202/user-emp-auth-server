const Employee = require('../models/Employee');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('f_Image');

exports.upload = upload;

exports.addEmployee = async (req, res) => {
  try {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } = req.body;

    
    const existingEmployee = await Employee.findOne({ f_Email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newEmployee = new Employee({
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course: Array.isArray(f_Course) ? f_Course : JSON.parse(f_Course || '[]'), // Ensure f_Course is an array
      f_Image: req.file ? req.file.buffer : null
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(400).json({ error: 'Error adding employee' });
  }
};

exports.editEmployee = async (req, res) => {
  try {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } = req.body;

    
    const existingEmployee = await Employee.findOne({ f_Email, _id: { $ne: req.params.id } });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const updateData = {
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course: Array.isArray(f_Course) ? f_Course : JSON.parse(f_Course || '[]') // Ensure f_Course is an array
    };

    if (req.file) {
      updateData.f_Image = req.file.buffer;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(400).json({ error: 'Error updating employee' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(400).json({ error: 'Error deleting employee' });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(400).json({ error: 'Error fetching employee' });
  }
};

// exports.getEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.status(200).json(employees);
//   } catch (error) {
//     console.error('Error fetching employees:', error);
//     res.status(400).json({ error: 'Error fetching employees' });
//   }
// };

exports.getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const searchQuery = search ? {
      $or: [
        { f_Name: { $regex: search, $options: 'i' } },
        { f_Email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const employees = await Employee.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalEmployees = await Employee.countDocuments(searchQuery);
    
    res.status(200).json({
      employees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(400).json({ error: 'Error fetching employees' });
  }
};

