// import Excel from "../models/excel.js";
// import XLData from "../models/sub_excel.js";
// import XLSX from "xlsx";
// import fs, { chownSync } from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import pdf from "html-pdf";
// import pMap from "p-map";
// import xlsx from 'xlsx';

// // Function to generate a PDF buffer from HTML content using 'pdf' library
// // Function to generate a PDF buffer from HTML content using 'pdf' library
// const generatePDFBuffer = async (html) => {
//   try {
//     console.time("PDFGenerationTime");

//     return new Promise((resolve, reject) => {
//       const startTime = Date.now();
//       console.log('start time');
//       pdf.create(html, { timeout: 120000 }).toBuffer((err, buffer) => {
//         console.log('pdf create fun');
//         if (err) {
//           reject(err); // Reject if an error occurs while creating the buffer
//         } else {
//           const endTime = Date.now();
//           console.log('PDF Generation Time:', endTime - startTime, 'milliseconds');
//           resolve(buffer); // Resolve with the generated buffer
//         }
//       });
//     });
//   } finally {
//     console.timeEnd("PDFGenerationTime");
//   }
// };


// // Endpoint to handle the POST request for Excel data processing
// export const postexceldata = async (req, res) => {
//   try {
//     console.time("postexceldata");

//     // Extract necessary data from the request body and user ID
//     const { company, username, role, filename, template } = req.body;
   
//     const userId = req.userId;
// // console.log("file path is :",req.file.path);
// // Read the uploaded Excel file

// const fileBuffer = fs.readFileSync(req.file.path);
// const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
// const sheetNamelist = workbook.SheetNames;

// // const workbook = await XlsxPopulate.fromFileAsync(req.file.path);
// //     const sheetNamelist = workbook.sheetNames();

// // console.log("sheetnamelist is :",sheetNamelist);
//     const search = { filename };

//     // Check if an Excel document with the same filename exists
//     const existingExcel = await Excel.findOne(search);
//     if (existingExcel) {
//       // If the Excel document already exists, delete the uploaded file and return a response
//       fs.unlinkSync(req.file.path);
//       return res.json({ status: 200, success: true, msg: 'Stop' });
//     }



//     // Process each sheet of the Excel document
//     const processSheetData = async (sheetName) => {
//       console.time(`Processing sheet: ${sheetName}`);
//       console.log(`Start processing sheet: ${sheetName}`);
//       const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

//       // const xlData = workbook.sheet(sheetName).usedRange().value();

//       const batchSize = 100; // Adjust the batch size as needed

//       const updatedXlData = [];
     
//       for (let i = 0; i < xlData.length; i += batchSize) {
//         const batch = xlData.slice(i, i + batchSize);
    
//         const batchResults = await pMap(
//           batch,
//           async (item) => {
//             const itemTimerLabel = "Processing item";

//             console.time(itemTimerLabel);

//           // Map Excel data to a new format with specified keys
//           // Mapping each key to its corresponding column in the Excel sheet
        
//           const mapObj = {
//             'Notice ID': item[0],
//             DATE: item[1],
//             ACCOUNT: item[2],
//             CARDNO: item[3],
//             FPR_NAME: item[4],
//             FPR_LD_LIN: item[5],
//             FPR_MOB: item[6],
//             EMBONAME: item[7],
//             ADDRESS1: item[8],
//             ADDRESS2: item[9],
//             CITY: item[10],
//             STATE: item[11],
//             PINCODE: item[12],
//             NEWRISKREGION: item[13],
//             'NEW_CURR BAL': item[14],
//             RISKCLASS: item[15],
//             BLOCK1: item[16],
//             BLOCK2: item[17],
//             ZONE: item[18],
//             SENDER: item[19],
//             BKT: item[20],
//             MOBILEPHONE_HOME: item[21],
//             TRIGGER: item[22],
//             ACTIVITY: item[23],
//             STAGE: item[24],
//             DPI_Amount: item[25],
//             'Cur Bal': item[26],
//             'Notice Amount(Cur bal+DPI)': item[27],
//             'E-mail': item[28],
//             'CASE No': item[29],
//             REF_NO: item[30],
//             NAME_OF_ARBITRATOR: item[31],
//             ADDRESS_OF_ARBITRATOR1: item[32],
//             ADDRESS_OF_ARBITRATOR2: item[33],
//             CITY_ARB: item[34],
//             PINCODE_ARB: item[35],
//             DATE_ARB: item[36],
//             TIME_ARB: item[37],
//             MEETING_LINK: item[38],
//             MEETING_PASSWORD: item[39],
//             MEETING_ID: item[40],
//             NOTICE_DATE: item[41],
//             NAME_OF_CONCILIATOR: item[42],
//             DATE_OF_CONCILIATION: item[43],
//             TIMING_OF_CONCILIATION: item[44],
//           };
          
         
         
//           // Read the HTML template file
//           const templateFilePath = path.join(
//             path.dirname(fileURLToPath(import.meta.url)),
//             '..',
//             'htmltemplates',
//             `${username + '_' + template}.html`
//           );
//           let html = fs.readFileSync(templateFilePath, 'utf8');

//           // Replace placeholders in the HTML template with respective values from mapObj
//           Object.keys(mapObj).forEach((key) => {
//             const regex = new RegExp('\\[' + key + '\\]', 'gi');
//             html = html.replace(regex, mapObj[key]);
//           });


//           // Generate PDF buffer using the updated HTML template
//           // item.pdfBuffer = await generatePDFBuffer(html);
//           const pdfBuffer = await generatePDFBuffer(html);
//           item.pdfBuffer = pdfBuffer;
//           console.timeEnd(itemTimerLabel);

//           return item;
//         },
//         { concurrency: 10} // Adjust the concurrency value as needed
//     );

//     updatedXlData.push(...batchResults);
//   }

//   console.timeEnd(sheetTimerLabel);
//   return updatedXlData;
// };


//     const updatedXlDataArrays = await pMap(sheetNamelist, processSheetData, { concurrency: 5 });
//     const updatedXlData = [].concat(...updatedXlDataArrays);

//     console.timeEnd("postexceldata");

   
//     // Create a new Excel document in the database
//     const newExcelDocument = await Excel.create({
//       company,
//       username,
//       role,
//       filename,
//       template,
//       userId,
//     });

//     // Create an array of XLData subdocuments with reference to Excel document
//     const xlDataSubdocs = updatedXlData.map((item) => ({
//       ...item,
//       excelId: newExcelDocument._id,
//     }));

//     // Insert XLData subdocuments in bulk
//     await XLData.insertMany(xlDataSubdocs);

//     // Delete the existing file
//     fs.unlinkSync(req.file.path);

//     return res.json({ status: 200, success: true, msg: "running" });
//     console.timeEnd("PostExcelDataProcessingTime");

//   } catch (error) {
//     console.error("Error while updating and saving newExcelDocument:", error);
//     res.status(500).json({ status: 500, success: false, msg: error.message });
//   }
// };


// export const getdata_client_user = async (req, res) => {
//   try {
//     const { company, username } = req.query;

//     const page = req.query.page || 1;
//     let pageSize = req.query.pageSize || 20; // Get the page size from the query parameter, default to 20

//     // Ensure the page size is within a reasonable range
//     pageSize = Math.min(Math.max(pageSize, 1), 100);

//     // Calculate the skip value based on the page number and page size
//     const skip = (page - 1) * pageSize;

//     const existingData = await Excel.find({ company, username })
//       .sort({ updatedAt: -1 })
//       .skip(skip)
//       .limit(pageSize);

//     if (!existingData || existingData.length === 0) {
//       return res.status(404).json({ message: "Data not found" });
//     }

//     // Get the total data count
//     const totalDataCount = await Excel.countDocuments();

//     // Calculate the total number of pages based on the total data count and page size
//     const totalPages = Math.ceil(totalDataCount / pageSize);

//     return res
//       .status(200)
//       .json({ message: existingData, totalPages: totalPages });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// export const delete_client_data = async (req,res) => {
//   try {

//     const {id} = req.params;
//     console.log(id);
    
//     const existingData = await Excel.findByIdAndDelete(id)
//     const data = await XLData.findByIdAndDelete(id)


//     if (!existingData || existingData.length === 0) {
//       return res.status(404).json({ message: "Data not found" });
//     }

     
//     return res
//       .status(200)
//       .json({ message: "Data Deleted"});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// // export const getAllexceldata = async (req, res) => {
// //   try {
// //     const data = await Excel.find();
// //     return res.status(200).json({ message: data });
// //   } catch (error) {
// //     res.status(500).json({ msg: error.message });
// //   }
// // };

// export const getAllexceldataWithPagination = async (req, res) => {
//   try {
//     const page = req.query.page || 1;
//     let pageSize = req.query.pageSize || 20; // Get the page size from the query parameter, default to 20

//     // Ensure the page size is within a reasonable range
//     pageSize = Math.min(Math.max(pageSize, 1), 100);

//     // Calculate the skip value based on the page number and page size
//     const skip = (page - 1) * pageSize;

//     const data = await Excel.find()
//       .sort({ updatedAt: -1 })
//       .skip(skip)
//       .limit(pageSize);

//     // Get the total data count
//     const totalDataCount = await Excel.countDocuments();

//     // Calculate the total number of pages based on the total data count and page size
//     const totalPages = Math.ceil(totalDataCount / pageSize);

//     // Execute the query and get the array of data
//     // const resultArray = await data.exec();

//     res.status(200).json({ message: data, totalPages: totalPages });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

 
// export const getbyuserdata = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const currentlogin = await Excel.find({
//       $and: [{ role: "User" }, { userId: userId }],
//     });
//     if (currentlogin) {
//       return res.status(200).json({ message: currentlogin });
//     }
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// // to get sub-excel data
// // export const getSingleexceldata = async (req, res) => {

// //   const id = req.params.id;
// //   try {
// //     // Find Excel document by its _id
// //     const excelData = await Excel.findById(id);

// //     if (!excelData) {
// //       return res.status(404).json({ message: "Excel data not found" });
// //     }

// //     // Find associated XLData documents with matching excelId
// //     const data = await XLData.find({ excelId: id });

// //     return res.status(200).json({ message1: excelData, message: data });
// //   } catch (error) {
// //     res.status(500).json({ msg: error.message });
// //   }
// // };

// // to get sub-excel data with pagination
// export const getSingleexceldataWithPagination = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const excelId = req.params.id; // Get the Excel document's _id from the URL parameter
//     const page = req.query.page || 1;
//     let pageSize = req.query.pageSize || 20; // Get the page size from the query parameter, default to 20

//     // Ensure the page size is within a reasonable range
//     pageSize = Math.min(Math.max(pageSize, 1), 100);

//     // Calculate the skip value based on the page number and page size
//     const skip = (page - 1) * pageSize;

//     // Find Excel document by its _id
//     const excelData = await Excel.findById(id);

//     if (!excelData) {
//       return res.status(404).json({ message: "Excel data not found" });
//     }

//     // Find associated XLData documents with matching excelId
//     const data = await XLData.find({ excelId: id }).skip(skip).limit(pageSize);

//     const totalDataCount = await XLData.countDocuments({ excelId: excelId });

//     // Calculate the total number of pages based on the total data count and page size
//     const totalPages = Math.ceil(totalDataCount / pageSize);

//     // Send the data array in the response

//     return res
//       .status(200)
//       .json({ message1: excelData, message: data, totalPages: totalPages });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// export const getPDF = async (req, res) => {
//   try {
//     const { excelId, xlDataId } = req.params;
//     const xlData = await XLData.findOne({ excelId: excelId, _id: xlDataId });

//     if (!xlData) {
//       return res.status(404).json({ msg: "xlData not found" });
//     }

//     if (!xlData.pdfBuffer) {
//       return res.status(404).json({ msg: "PDF data not found" });
//     }

//     res.setHeader("Content-Type", "application/pdf");
//     res.send(xlData.pdfBuffer);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };











import Excel from "../models/excel.js";
import XLData from "../models/sub_excel.js";
import XLSX from "xlsx";
import fs, { chownSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdf from "html-pdf";
import pMap from "p-map";

// Function to generate a PDF buffer from HTML content using 'pdf' library
const generatePDFBuffer = async (html) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    console.log("start time");
    pdf.create(html, { timeout: 120000 }).toBuffer((err, buffer) => {
      console.log("pdf create fun");
      if (err) {
        reject(err); // Reject if an error occurs while creating the buffer
      } else {
        const endTime = Date.now();
        console.log(
          "PDF Generation Time:",
          endTime - startTime,
          "milliseconds"
        );

        resolve(buffer); // Resolve with the generated buffer
      }
    });
  });
};

// Endpoint to handle the POST request for Excel data processing
export const postexceldata = async (req, res) => {
  try {
    // Extract necessary data from the request body and user ID
    const { company, username, role, filename, template } = req.body;
   
    const userId = req.userId;
// console.log("file path is :",req.file.path);
// Read the uploaded Excel file
const workbook = XLSX.readFile(req.file.path);
const sheetNamelist = workbook.SheetNames;
// console.log("sheetnamelist is :",sheetNamelist);
    const search = { filename };

    // Check if an Excel document with the same filename exists
    const existingExcel = await Excel.findOne(search);
    if (existingExcel) {
      // If the Excel document already exists, delete the uploaded file and return a response
      fs.unlinkSync(req.file.path);
      return res.json({ status: 200, success: true, msg: "Stop" });
    }

    // Process each sheet of the Excel document
    const processSheetData = async (sheetName) => {
      console.log("1");
      // console.log({sheetName});
      const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      // console.log({xlData});
      const updatedXlData = await pMap(
        xlData,
        async (item) => {
          // Map Excel data to a new format with specified keys
          // Mapping each key to its corresponding column in the Excel sheet
        
          const mapObj = {
            "Notice ID": item["Notice ID"],
            DATE: item.DATE,
            ACCOUNT: item.ACCOUNT,
            CARDNO: item.CARDNO,
            FPR_NAME: item.FPR_NAME,
            FPR_LD_LIN: item.FPR_LD_LIN,
            FPR_MOB: item.FPR_MOB,
            EMBONAME: item.EMBONAME,
            ADDRESS1: item.ADDRESS1,
            ADDRESS2: item.ADDRESS2,
            CITY: item.CITY,
            STATE: item.STATE,
            PINCODE: item.PINCODE,
            NEWRISKREGION: item.NEWRISKREGION,
            "NEW_CURR BAL": item["NEW_CURR BAL"],
            RISKCLASS: item.RISKCLASS,
            BLOCK1: item.BLOCK1,
            BLOCK2: item.BLOCK2,
            ZONE: item.ZONE,
            SENDER: item.SENDER,
            BKT: item.BKT,
            MOBILEPHONE_HOME: item.MOBILEPHONE_HOME,
            TRIGGER: item.TRIGGER,
            ACTIVITY: item.ACTIVITY,
            STAGE: item.STAGE,
            DPI_Amount: item.DPI_Amount,
            "Cur Bal": item["Cur Bal"],
            "Notice Amount(Cur bal+DPI)": item["Notice Amount(Cur bal+DPI)"],
            "E-mail": item["E-mail"],
            "CASE No": item["CASE No"],
            REF_NO: item.REF_NO,
            NAME_OF_ARBITRATOR: item.NAME_OF_ARBITRATOR,
            ADDRESS_OF_ARBITRATOR1: item.ADDRESS_OF_ARBITRATOR1,
            ADDRESS_OF_ARBITRATOR2: item.ADDRESS_OF_ARBITRATOR2,
            CITY_ARB: item.CITY_ARB,
            PINCODE_ARB: item.PINCODE_ARB,
            DATE_ARB: item.DATE_ARB,
            TIME_ARB: item.TIME_ARB,
            MEETING_LINK: item.MEETING_LINK,
            MEETING_PASSWORD: item.MEETING_PASSWORD,
            MEETING_ID: item.MEETING_ID,
            NOTICE_DATE: item.NOTICE_DATE,
            NAME_OF_CONCILIATOR: item.NAME_OF_CONCILIATOR,
            DATE_OF_CONCILIATION: item.DATE_OF_CONCILIATION,
            TIMING_OF_CONCILIATION: item.TIMING_OF_CONCILIATION,
          };
         
         
          // Read the HTML template file
          const templateFilePath = path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            "..",
            "htmltemplates",
            `${username + "_" +template}.html`
          );
          let html = fs.readFileSync(templateFilePath, "utf8");

          // Replace placeholders in the HTML template with respective values from mapObj
          Object.keys(mapObj).forEach((key) => {
            const regex = new RegExp("\\[" + key + "\\]", "gi");
            html = html.replace(regex, mapObj[key]);

          });

          // Generate PDF buffer using the updated HTML template
          // item.pdfBuffer = await generatePDFBuffer(html);
          const pdfBuffer = await generatePDFBuffer(html);
          item.pdfBuffer = pdfBuffer;
          return item;
        },
        { concurrency: 10 }
      );
      console.log("2");
      return updatedXlData;
    };
    console.log("3");

    // // Process all sheets in parallel and combine the results into a single array
    // const updatedXlDataArrays = await Promise.all(sheetNamelist.map(processSheetData));
    // const updatedXlData = [].concat(...updatedXlDataArrays);

    const chunkSize = 10; // Adjust the chunk size as needed
    const chunks = [];
    for (let i = 0; i < sheetNamelist.length; i += chunkSize) {
      chunks.push(sheetNamelist.slice(i, i + chunkSize));
    }

    const updatedXlDataArrays = await pMap(
      chunks,
      async (chunk) => {
        const chunkData = await pMap(chunk, processSheetData, {
          concurrency: 5,
        });
        return [].concat(...chunkData);
      },
      { concurrency: 1 }
    );

    const updatedXlData = [].concat(...updatedXlDataArrays);
// console.log("updatedXlData is",updatedXlData);
    console.log("4");

    // // Process data in batches
    // for (let i = 0; i < updatedXlData.length; i += batchSize) {
    //   const batch = updatedXlData.slice(i, i + batchSize);

    //   // Create an array to store promises for signup
    //   const uploadPromises = batch.map(item => processSheetData(item));

    //   // Wait for signup promises to complete
    //   // const Results = await Promise.all(uploadPromises);
    // }

    // Create a new Excel document in the database
    const newExcelDocument = await Excel.create({
      company,
      username,
      role,
      filename,
      template,
      userId,
    });

    // Create an array of XLData subdocuments with reference to Excel document
    const xlDataSubdocs = updatedXlData.map((item) => ({
      ...item,
      excelId: newExcelDocument._id,
    }));

    // Insert XLData subdocuments in bulk
    await XLData.insertMany(xlDataSubdocs);

    // Delete the existing file
    fs.unlinkSync(req.file.path);

    return res.json({ status: 200, success: true, msg: "running" });
  } catch (error) {
    console.error("Error while updating and saving newExcelDocument:", error);
    res.status(500).json({ status: 500, success: false, msg: error.message });
  }
};

// export const getdata_client_user = async (req, res) => {
//   try {
//     const { company, username } = req.query;
//     const existingData = await Excel.find({ company, username });

//     if (!existingData || existingData.length === 0) {
//       return res.status(404).json({ message: "Data not found" });
//     }

//     return res.status(200).json({ message: existingData });
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred on the server side" });
//   }
// };

export const getdata_client_user = async (req, res) => {
  try {
    const { company, username } = req.query;

    const page = req.query.page || 1;
    let pageSize = req.query.pageSize || 20; // Get the page size from the query parameter, default to 20

    // Ensure the page size is within a reasonable range
    pageSize = Math.min(Math.max(pageSize, 1), 100);

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;

    const existingData = await Excel.find({ company, username })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(pageSize);

    if (!existingData || existingData.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Get the total data count
    const totalDataCount = await Excel.countDocuments();

    // Calculate the total number of pages based on the total data count and page size
    const totalPages = Math.ceil(totalDataCount / pageSize);

    return res
      .status(200)
      .json({ message: existingData, totalPages: totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const delete_client_data = async (req,res) => {
  try {

    const {id} = req.params;
    console.log(id);
    
    const existingData = await Excel.findByIdAndDelete(id)
    const data = await XLData.findByIdAndDelete(id)


    if (!existingData || existingData.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

     
    return res
      .status(200)
      .json({ message: "Data Deleted"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// export const getAllexceldata = async (req, res) => {
//   try {
//     const data = await Excel.find();
//     return res.status(200).json({ message: data });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const getAllexceldataWithPagination = async (req, res) => {
  try {
    const page = req.query.page || 1;
    let pageSize = req.query.pageSize || 20; // Get the page size from the query parameter, default to 20

    // Ensure the page size is within a reasonable range
    pageSize = Math.min(Math.max(pageSize, 1), 100);

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;

    const data = await Excel.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Get the total data count
    const totalDataCount = await Excel.countDocuments();

    // Calculate the total number of pages based on the total data count and page size
    const totalPages = Math.ceil(totalDataCount / pageSize);

    // Execute the query and get the array of data
    // const resultArray = await data.exec();

    res.status(200).json({ message: data, totalPages: totalPages });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

 
export const getbyuserdata = async (req, res) => {
  try {
    const userId = req.userId;
    const currentlogin = await Excel.find({
      $and: [{ role: "User" }, { userId: userId }],
    });
    if (currentlogin) {
      return res.status(200).json({ message: currentlogin });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// to get sub-excel data
// export const getSingleexceldata = async (req, res) => {

//   const id = req.params.id;
//   try {
//     // Find Excel document by its _id
//     const excelData = await Excel.findById(id);

//     if (!excelData) {
//       return res.status(404).json({ message: "Excel data not found" });
//     }

//     // Find associated XLData documents with matching excelId
//     const data = await XLData.find({ excelId: id });

//     return res.status(200).json({ message1: excelData, message: data });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// to get sub-excel data with pagination
export const getSingleexceldataWithPagination = async (req, res) => {
  const id = req.params.id;
  try {
    const excelId = req.params.id; // Get the Excel document's _id from the URL parameter
    const page = req.query.page || 1;
    let pageSize = req.query.pageSize || 20; // Get the page size from the query parameter, default to 20

    // Ensure the page size is within a reasonable range
    pageSize = Math.min(Math.max(pageSize, 1), 100);

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;

    // Find Excel document by its _id
    const excelData = await Excel.findById(id);

    if (!excelData) {
      return res.status(404).json({ message: "Excel data not found" });
    }

    // Find associated XLData documents with matching excelId
    const data = await XLData.find({ excelId: id }).skip(skip).limit(pageSize);

    const totalDataCount = await XLData.countDocuments({ excelId: excelId });

    // Calculate the total number of pages based on the total data count and page size
    const totalPages = Math.ceil(totalDataCount / pageSize);

    // Send the data array in the response

    return res
      .status(200)
      .json({ message1: excelData, message: data, totalPages: totalPages });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPDF = async (req, res) => {
  try {
    const { excelId, xlDataId } = req.params;
    const xlData = await XLData.findOne({ excelId: excelId, _id: xlDataId });

    if (!xlData) {
      return res.status(404).json({ msg: "xlData not found" });
    }

    if (!xlData.pdfBuffer) {
      return res.status(404).json({ msg: "PDF data not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.send(xlData.pdfBuffer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};