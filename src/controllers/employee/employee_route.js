import { Router } from 'express';
import { createEmployee, deleteEmployee, getAllEmployee, getEmployeeById, searchEmployee, updateEmployee } from '#src/controllers/employee/employee_controller';

const employeeRouter = Router();

employeeRouter.get('/', getAllEmployee);
employeeRouter.get('/search', searchEmployee);
employeeRouter.get('/:id', getEmployeeById);
employeeRouter.post('/', createEmployee);
employeeRouter.patch('/:id', updateEmployee);
employeeRouter.delete('/:id', deleteEmployee);

export default employeeRouter;