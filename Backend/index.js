import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { database } from "./config/database.js";
import { userRouter } from "./routes/userRouts.js";
import { excelRoute } from "./routes/excelRoute.js";
import { noticeRouter } from "./routes/noticeRoute.js";
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import { emailtempRoute } from "./routes/emailtempRoute.js";
import { emailscriptRoute } from "./routes/emaiscriptRoute.js";
import { urlRouter } from "./routes/urlRoute.js";
import { snsRouteHandler } from "./routes/snsRouteHandler.js";
const app = express()
app.use(express.urlencoded({ extended: true, limit: "500MB" }));
app.use(express.json());

// app.use((req, res, next) => {
//     let data = '';
//     req.on('data', chunk => {
//       data += chunk;
//     });
//     req.on('end', () => {
//       console.log('Raw data:', data);
//       try {
//         req.body = JSON.parse(data);
//       } catch (e) {
//         console.error('Error parsing JSON:', e);
//       }
//       next();
//     });
// });
 

app.use(cors())

const snsMiddleware =((req, res, next) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      console.log('Raw data:', data);
      try {
        req.body = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
      next();
    });
});


config({
    path: "./config/config.env"
})

database()

app.use("/user", userRouter)
app.use("/excel", excelRoute)
app.use("/notice", noticeRouter)
app.use("/emailtemp", emailtempRoute)

// Use snsMiddleware only for the specific SNS route
app.use("/sns", snsMiddleware, snsRouteHandler);

app.use("/emailscript", emailscriptRoute)
app.use('/url',urlRouter)  

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.send("vighnharth shree ganesha deva")
})

const port = process.env.port
app.listen(port, () => {
    console.log(`server running at port ${port}`)
})

