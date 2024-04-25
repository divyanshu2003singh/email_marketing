import express from "express";
import { createSmptServers, sendEmail, sendSMS} from "../controllers/noticeController.js";
export const noticeRouter=express.Router()


noticeRouter.get('/createSmptServers',createSmptServers)
noticeRouter.put('/sendemail/:id',sendEmail)
noticeRouter.get('/sendsms', sendSMS)