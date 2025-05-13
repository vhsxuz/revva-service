import SuccessMessages from "#src/enum/success_message";
import SuccessStatus from "#src/enum/success_status";
import prismaClient from "#src/db/prisma";

export const getAllMenu = async (req, res, next) => {
  try {
    // Fetch all menus from the database
    const menus = await prismaClient.menu.findMany({
      include: {
        menuCategory: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedMenus = menus.map(menu => ({
      ...menu,
      rating: Number(menu.rating.toFixed(1))
    }));


    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_CONNECT,
      message: SuccessMessages.SUCCESS_CONNECT,
      data: formattedMenus
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
}

export const getMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const menu = await prismaClient.menu.findUnique({
      where: {
        id
      },
      include: {
        menuCategory: true
      }
    });

    if (!menu) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Menu not found'
      });
    }

    // Format the response with rating to 1 decimal place
    const formattedMenu = {
      ...menu,
      rating: Number(menu.rating.toFixed(1))
    };

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_CONNECT,
      message: SuccessMessages.SUCCESS_CONNECT,
      data: formattedMenu
    });
  } catch (error) {
    next(error);
  }
}

export const createMenu = async (req, res, next) => {
  try {
    const { 
      name,
      menu_category_id,
      rating,
      description,
      production_cost,
      margin,
      prep_time_minutes,
      stock_serving
    } = req.body;

    // Calculate derived fields
    const price = production_cost + margin;
    const monthly_revenue = 0; // Initialize to 0 for new menu
    const monthly_profit = 0;  // Initialize to 0 for new menu

    const newMenu = await prismaClient.menu.create({
      data: {
        name,
        menu_category_id,
        rating: Number(rating.toFixed(1)), // Format to 1 decimal
        description,
        production_cost,
        margin,
        price,
        monthly_revenue,
        monthly_profit,
        prep_time_minutes,
        stock_serving,
        last_restocked: new Date()
      },
      include: {
        menuCategory: true
      }
    });

    return res.status(SuccessStatus.CREATED).json({
      code: SuccessStatus.CREATED,
      status: SuccessStatus.SUCCESS_CREATE,
      message: SuccessMessages.SUCCESS_CREATE,
      data: newMenu
    });
  } catch (error) {
    next(error);
  }
}

export const updateMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Format rating if it exists in update data
    if (updateData.rating) {
      updateData.rating = Number(updateData.rating.toFixed(1));
    }

    const updatedMenu = await prismaClient.menu.update({
      where: { id },
      data: updateData,
      include: {
        menuCategory: true
      }
    });

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_UPDATE,
      message: SuccessMessages.SUCCESS_UPDATE,
      data: updatedMenu
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Menu not found'
      });
    }
    next(error);
  }
}

export const deleteMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedMenu = await prismaClient.menu.delete({
      where: { id },
      include: {
        menuCategory: true
      }
    });

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_DELETE,
      message: SuccessMessages.SUCCESS_DELETE,
      data: deletedMenu
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Menu not found'
      });
    }
    next(error);
  }
};

export const searchMenus = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Search keyword is required'
      });
    }

    const menus = await prismaClient.menu.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        menuCategory: true // Make sure this matches your schema
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedMenus = menus.map(menu => ({
      ...menu,
      rating: Number(menu.rating.toFixed(1))
    }));

    return res.status(200).json({
      code: 200,
      status: 'success',
      message: 'Search results',
      data: formattedMenus
    });
  } catch (error) {
    next(error);
  }
};