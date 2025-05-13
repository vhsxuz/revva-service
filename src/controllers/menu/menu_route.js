import { Router } from 'express';
import {
  getAllMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  searchMenus
} from '#src/controllers/menu/menu_controller';

const menuRouter = Router();

menuRouter.get('/', getAllMenu);
menuRouter.get('/search', searchMenus);
menuRouter.get('/:id', getMenuById);
menuRouter.post('/', createMenu);
menuRouter.put('/:id', updateMenu);
menuRouter.patch('/:id', updateMenu);
menuRouter.delete('/:id', deleteMenu);

export default menuRouter;