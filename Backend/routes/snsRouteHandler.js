import express from "express";
import { sesNotification } from "../controllers/snsController.js";

export const snsRouteHandler=express.Router()

snsRouteHandler.post('/recqarzSesNotification', sesNotification)
