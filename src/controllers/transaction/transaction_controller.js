import SuccessMessages from "#src/enum/success_message";
import SuccessStatus from "#src/enum/success_status";
import prismaClient from "#src/db/prisma";

// Get all transactions
export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await prismaClient.transactionHeader.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true
          }
        },
        paymentType: true,
        details: {
          include: {
            menu: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: {
        transaction_date: 'desc'
      }
    });

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_CONNECT,
      message: SuccessMessages.SUCCESS_CONNECT,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await prismaClient.transactionHeader.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeePosition: true
          }
        },
        paymentType: true,
        details: {
          include: {
            menu: {
              select: {
                id: true,
                name: true,
                price: true,
                menuCategory: true
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Transaction not found'
      });
    }

    // Calculate total amount
    const totalAmount = transaction.details.reduce((sum, detail) => {
      return sum + (detail.menu.price * detail.quantity);
    }, 0);

    const response = {
      ...transaction,
      totalAmount
    };

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_CONNECT,
      message: SuccessMessages.SUCCESS_CONNECT,
      data: response
    });
  } catch (error) {
    next(error);
  }
};

// Create new transaction
export const createTransaction = async (req, res, next) => {
  try {
    const { employee_id, payment_type_id, transaction_date, items } = req.body;

    // Basic validation
    if (!employee_id || !payment_type_id || !items || items.length === 0) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Employee ID, payment type ID, and at least one menu item are required'
      });
    }

    // Verify employee exists
    const employeeExists = await prismaClient.employee.findUnique({
      where: { id: employee_id }
    });

    if (!employeeExists) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Employee not found'
      });
    }

    // Verify payment type exists
    const paymentTypeExists = await prismaClient.paymentType.findUnique({
      where: { id: payment_type_id }
    });

    if (!paymentTypeExists) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Payment type not found'
      });
    }

    // Verify all menu items exist
    const menuItems = await prismaClient.menu.findMany({
      where: {
        id: { in: items.map(item => item.menu_id) }
      }
    });

    if (menuItems.length !== items.length) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'One or more menu items not found'
      });
    }

    // Create transaction
    const transaction = await prismaClient.transactionHeader.create({
      data: {
        employee_id,
        payment_type_id,
        transaction_date: transaction_date ? new Date(transaction_date) : new Date(),
        details: {
          create: items.map(item => ({
            menu_id: item.menu_id,
            quantity: item.quantity
          }))
        }
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true
          }
        },
        paymentType: true,
        details: {
          include: {
            menu: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      }
    });

    // Calculate total amount
    const totalAmount = transaction.details.reduce((sum, detail) => {
      return sum + (detail.menu.price * detail.quantity);
    }, 0);

    const response = {
      ...transaction,
      totalAmount
    };

    return res.status(SuccessStatus.CREATED).json({
      code: SuccessStatus.CREATED,
      status: SuccessStatus.SUCCESS_CREATE,
      message: SuccessMessages.SUCCESS_CREATE,
      data: response
    });
  } catch (error) {
    next(error);
  }
};