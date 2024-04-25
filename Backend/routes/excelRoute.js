import express from 'express';
import { postExcelDataWithBusboy, getbyuserdata, getPDF, getdata_client_user, getAllexceldataWithPagination, getSingleexceldataWithPagination, delete_client_data } from '../controllers/excelController.js';
import auth from '../middleware/auth.js';
import Busboy from 'busboy';
import connectBusboy from 'connect-busboy';

export const excelRoute = express.Router();
excelRoute.use(connectBusboy());

// Routes
excelRoute.post('/', auth, postExcelDataWithBusboy);
excelRoute.get('/client_user', auth, getdata_client_user);
excelRoute.get('/all', auth, getAllexceldataWithPagination);
excelRoute.get('/', auth, getbyuserdata);
excelRoute.delete('/delete_client_user/:id', auth, delete_client_data);
excelRoute.get('/:id', auth, getSingleexceldataWithPagination);
excelRoute.get('/pdf/:excelId/:xlDataId', getPDF);

// Other routes...
