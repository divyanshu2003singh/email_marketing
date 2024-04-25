// // EmailTemplateForm.js
// import React from "react";
// import { styled } from "@mui/material/styles";
// import { Box } from "@mui/system";
// import {
//   Avatar,
//   Button,
//   ButtonGroup,
//   FormControl,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import AdminNavbar from "../../../Navbar/AdminNavbar";

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: "center",
//   color: theme.palette.text.secondary,
// }));

// const ListItemCSS = {
//   display: "block",
//   cursor: "pointer",
//   width: "100px",
//   height: "100px",
//   borderRadius: "100%",
//   boxShadow: "0 0 0 10px #eceff1",
//   background: "#eceff1",
// };

// const EmailTemplateForm = ({
//   avatarImage,
//   handleAvatarChange,
//   inpudata,
//   inputhandleonchange,
//   onClickforreset,
//   ContentInner,
//   setContentInner,
//   ContentFooter,
//   setContentFooter,
//   callApi,
// }) => {
//   return (
//     <Box sx={{ display: "flex" }}>
//       <AdminNavbar />
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <DrawerHeader />
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <label style={styles.label}>
//               {avatarImage ? (
//                 <Avatar sx={ListItemCSS} src={avatarImage} />
//               ) : (
//                 <>
//                   <input
//                     type="file"
//                     style={styles.fileInput}
//                     onChange={handleAvatarChange}
//                     accept="image/*"
//                   />
//                   <Typography
//                     variant="body2"
//                     component="span"
//                     style={styles.labelText}
//                   >
//                     LOGO
//                   </Typography>
//                 </>
//               )}
//             </label>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             {" "}
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Enter title here"
//               name="title"
//               value={inpudata.title}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Enter Sub title here"
//               name="subtitle"
//               value={inpudata.subtitle}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               label="Notice Id"
//               name="noticeid"
//               value={inpudata.noticeid}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               label="Notice Id 123456"
//               name="noticeidEg"
//               value={inpudata.noticeidEg}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               label="Notice Date"
//               name="noticedate"
//               value={inpudata.noticedate}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               label="Notice Date 03/05/2023"
//               name="noticedateEg"
//               value={inpudata.noticedateEg}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="<<to>>"
//               name="to"
//               value={inpudata.to}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="<<address>>"
//               name="address"
//               value={inpudata.address}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               label="Subject"
//               name="subject"
//               value={inpudata.subject}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Subject Title"
//               name="subjecttitle"
//               value={inpudata.subjecttitle}
//               onChange={inputhandleonchange}
//               variant="outlined"
//               size="small"
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel id="demo-simple-select-label">
//                 Select Notice
//               </InputLabel>
//               <Select
//                 labelId="demo-simple-select-label"
//                 id="demo-simple-select"
//                 value={inpudata.noticeType}
//                 label="Select Template"
//                 onChange={inputhandleonchange}
//               >
//                 <MenuItem value={"Assamese"}>Assamese</MenuItem>
//                 <MenuItem value={"Demand Notice - SBI Card Account No (QLD)"}>
//                   Demand Notice - SBI Card Account No (QLD)
//                 </MenuItem>
//                 <MenuItem value={"Demand Notice SBI Credit Card No"}>
//                   Demand Notice SBI Credit Card No
//                 </MenuItem>
//                 <MenuItem value={"Hindi"}>Hindi</MenuItem>
//                 <MenuItem
//                   value={"Invitation to Conciliation as per Provisions"}
//                 >
//                   Invitation to Conciliation as per Provisions
//                 </MenuItem>
//                 <MenuItem value={"Invitation to Conciliation"}>
//                   Invitation to Conciliation
//                 </MenuItem>
//                 <MenuItem value={"Kannada"}>Kannada</MenuItem>
//                 <MenuItem value={"Malayalam"}>Malayalam</MenuItem>
//                 <MenuItem value={"Marathi"}>Marathi</MenuItem>
//                 <MenuItem
//                   value={"New Demand Notice - SBI Card Account No (QLD)"}
//                 >
//                   New Demand Notice - SBI Card Account No (QLD)
//                 </MenuItem>
//                 <MenuItem value={"New Demand Notice SBI Credit Card No"}>
//                   New Demand Notice SBI Credit Card No
//                 </MenuItem>
//                 <MenuItem
//                   value={"Notice Prior to the Filing of Execution Petition"}
//                 >
//                   Notice Prior to the Filing of Execution Petition
//                 </MenuItem>
//                 <MenuItem value={"Odia"}>Odia</MenuItem>
//                 <MenuItem value={"Punjabi"}>Punjabi</MenuItem>
//                 <MenuItem value={"SBICPSL-LEGAL-VGPPC-100323-22364"}>
//                   SBICPSL-LEGAL-VGPPC-100323-22364
//                 </MenuItem>
//                 <MenuItem value={"Tamil"}>Tamil</MenuItem>
//                 <MenuItem value={"Telugu"}>Telugu</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           {/* ==============ck-editor text areas==============  */}
//           <Grid item xs={12}>
//             <Item sx={{ m: 1 }}>
//               <Typography>
//                 <strong>Inner Section</strong>
//               </Typography>
//               <CKEditor
//                 editor={ClassicEditor}
//                 data={ContentInner}
//                 onChange={(event, editor) => {
//                   const data = editor.getData();
//                   setContentInner(data);
//                 }}
//               />
//             </Item> 
//           </Grid>
//           <Grid item xs={12}>
//             <Item sx={{ m: 1 }}>
//               <Typography>
//                 <strong>Footer Section</strong>
//               </Typography>
//               <CKEditor
//                 editor={ClassicEditor}
//                 data={ContentFooter}
//                 onChange={(event, editor) => {
//                   const data = editor.getData();
//                   setContentFooter(data);
//                 }}
//               />
//             </Item>
//           </Grid>
//           {/* ==============ck-editor text areas==============  */}

//           {/* <Grid item xs={12} sm={6}>
//             <Item sx={{ m: 1 }}>
//               <Button
//                 fullWidth
//                 onClick={callApi}
//                 size="small"
//                 variant="contained"
//               >
//                 {"Save & exit"}
//               </Button>
//             </Item>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Item sx={{ m: 1 }}>
//               <Button
//                 fullWidth
//                 onClick={onClickforreset}
//                 size="small"
//                 variant="contained"
//               >
//                 {"Reset"}
//               </Button>
//             </Item>
//           </Grid> */}
          
//           <Grid
//               item
//               xs={12}
//               sx={{ display: "flex", justifyContent: "flex-end" }}
//             >
//               <ButtonGroup>
//                 <Button onClick={onClickforreset}>Reset</Button>
//                 <Button
//                  onClick={callApi}
//                 >Submit</Button>
//               </ButtonGroup>
//             </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// const styles = {
//   fileInput: {
//     display: "none",
//   },
//   labelText: {
//     cursor: "pointer",
//     color: "#1976D2",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     lineHeight: "1.75",
//     letterSpacing: "0.02857em",
//   },
//   label: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
// };

// export default EmailTemplateForm;
