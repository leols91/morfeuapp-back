import { Router } from 'express';
import * as supplierController from './supplier.controller.js';

const supplierRoutes: Router = Router();

// Rotas aninhadas sob Pousada
supplierRoutes.post('/pousadas/:pousadaId/suppliers', supplierController.createSupplierController);
supplierRoutes.get('/pousadas/:pousadaId/suppliers', supplierController.listSuppliersController);

// Rotas diretas para um Fornecedor
supplierRoutes.get('/suppliers/:supplierId', supplierController.getSupplierByIdController);
supplierRoutes.patch('/suppliers/:supplierId', supplierController.updateSupplierController);
supplierRoutes.delete('/suppliers/:supplierId', supplierController.deleteSupplierController);

export { supplierRoutes };
