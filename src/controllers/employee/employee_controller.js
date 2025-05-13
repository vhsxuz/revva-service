import SuccessMessages from "#src/enum/success_message";
import SuccessStatus from "#src/enum/success_status";
import prismaClient from "#src/db/prisma";

// Get all employees
export const getAllEmployee = async (req, res, next) => {
  try {
    const employees = await prismaClient.employee.findMany({
      include: {
        employeePosition: true,
        employeeStatus: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_CONNECT,
      message: SuccessMessages.SUCCESS_CONNECT,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await prismaClient.employee.findUnique({
      where: { id },
      include: {
        employeePosition: true,
        employeeStatus: true
      }
    });

    if (!employee) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Employee not found'
      });
    }

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_CONNECT,
      message: SuccessMessages.SUCCESS_CONNECT,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// Search employees
export const searchEmployee = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Search keyword is required'
      });
    }

    const employees = await prismaClient.employee.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { phone_number: { contains: keyword, mode: 'insensitive' } }
        ]
      },
      include: {
        employeePosition: true,
        employeeStatus: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_CONNECT,
      message: SuccessMessages.SUCCESS_CONNECT,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// Create new employee
export const createEmployee = async (req, res, next) => {
  try {
    const { name, phone_number, employee_position_id, employee_status_id } = req.body;

    // Validate required fields
    if (!name || !phone_number || !employee_position_id || !employee_status_id) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'All fields are required'
      });
    }

    const newEmployee = await prismaClient.employee.create({
      data: {
        name,
        phone_number,
        employeePosition: { connect: { id: employee_position_id } },
        employeeStatus: { connect: { id: employee_status_id } }
      },
      include: {
        employeePosition: true,
        employeeStatus: true
      }
    });

    return res.status(SuccessStatus.CREATED).json({
      code: SuccessStatus.CREATED,
      status: SuccessStatus.SUCCESS_CREATE,
      message: SuccessMessages.SUCCESS_CREATE,
      data: newEmployee
    });
  } catch (error) {
    next(error);
  }
};

// Update employee
export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedEmployee = await prismaClient.employee.update({
      where: { id },
      data: updateData,
      include: {
        employeePosition: true,
        employeeStatus: true
      }
    });

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_UPDATE,
      message: SuccessMessages.SUCCESS_UPDATE,
      data: updatedEmployee
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Employee not found'
      });
    }
    next(error);
  }
};

// Delete employee
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await prismaClient.employee.delete({
      where: { id },
      include: {
        employeePosition: true,
        employeeStatus: true
      }
    });

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_DELETE,
      message: SuccessMessages.SUCCESS_DELETE,
      data: deletedEmployee
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Employee not found'
      });
    }
    next(error);
  }
};