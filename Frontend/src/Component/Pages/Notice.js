import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import {
  ButtonGroup,
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  TablePagination,
  Pagination,
  Stack,
} from "@mui/material";
import {
  Inventory2Outlined as Inventory2OutlinedIcon
} from '@mui/icons-material';
import Dialogfordata from "../Dashboard/Dialogfordata";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import "../style/style.css";
import { toast } from "react-toastify";
import AdminNavbar from "../Navbar/AdminNavbar";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const AnimatedGridItem = styled(Grid)`
  animation: slideIn 1s ease-in-out;

  @keyframes slideIn {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UploadFileIconCSS = {
  cursor: "pointer",
  transition: "transform 0.5s ease",
  "&:hover": { transform: "scale(1.2)" },
};
const UploadFileIconCSS1 = {
  cursor: "pointer",
  transition: "transform 0.5s ease",
  "&:hover": { transform: "rotate(360deg)" },
};
const tableCSS = {
  cursor: "pointer",
  transition: "transform 0.5s ease",
  "&:hover": { color: "#1a237e", transform: "scale(0.99)" },
};



const Notice = () => {
  const [open, setOpen] = useState(false);
  const intupvalue = {
    emailformail: "",
    username: `${JSON.parse(localStorage.getItem("username"))}`,
  };
  const [emailformaill, setEmailformail] = useState(intupvalue);
  const [selectedEmails, setSelectedEmails] = useState({});
  const [inputsearchvalue, setInputsearchvalue] = useState("");
  const [inputsearchmail, setinputsearchmail] = useState("");
  const [inputsearchtemp, setinputsearchtemp] = useState("");
  const [isloading, setisLoading] = useState(true);
  const [issendloading, setissendloading] = useState(false);
  
  const [loadingTemplates, setLoadingTemplates] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDataCount, setTotalDataCount] = useState(1);
  const [results, setResults] = useState([]);
  const [allNoticeType, setAllNoticeType] = useState([])


  let revData = Array.isArray(results) ? [...results] : [];

  const handleChange = (event, id) => {
    const { name, value } = event.target;
    setSelectedEmails((prevSelected) => ({
      ...prevSelected,
      [id]: { ...prevSelected[id], [name]: value },
    }));
    // setEmailformail({ ...emailformaill, [name]: value });
  };

  const showAllTemplates = async () => {
           
    try {
        const token = JSON.parse(localStorage.getItem("token"))
        const username = JSON.parse(localStorage.getItem("username"))
         
        const tempUrl = `http://localhost:4000/emailtemp/data?username=${username}`
        const options = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        const tempResponse = await fetch(tempUrl, options)
        const tempResult = await tempResponse.json()


        const data = tempResult.map((e)=> e.noticeType)

        setAllNoticeType(data)
       

    } catch (error) {
        console.log(error)
    }

}

  

  const fetchNoticeType  = () => {
    showAllTemplates()
  }
 
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);

  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const totalexceldata = (id) => {
    navigate(`/totalexceldata/${id}`);
  };

  // console.log(emailformaill)

  const company = JSON.parse(localStorage.getItem("company"));
  const username = JSON.parse(localStorage.getItem("username"));
  const API = `http://localhost:4000/excel/client_user?company=${encodeURIComponent(
    company
  )}&username=${encodeURIComponent(username)}`;
  // const callapi = async (url) => {
  //     const res = await fetch(url, {
  //         headers: {
  //             authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
  //         },
  //     })
  //     const result = await res.json()
  //     setResults(result.message)
  //     setisLoading(false)
  // }

  const callapi = async (url, page, rowsPerPage) => {
    setisLoading(true)
    try {
      const res = await fetch(`${url}&pageSize=${rowsPerPage}&page=${page}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      const result = await res.json();

      const resultArray = Array.isArray(result.message)
        ? result.message
        : [result.message];

      const adjustedResultArray = resultArray.map((item, index) => ({
        ...item,
        rowIndex: (page - 1) * rowsPerPage + index + 1, // Calculate the rowIndex based on the current page and index
      }));

      setResults(adjustedResultArray);
      setTotalDataCount(parseInt(result.totalPages));

      setisLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // console.log("this teponse forn bakend side ",revData)
  console.log("this teponse forn bakend side ", results);


  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    callapi(API, page, rowsPerPage);
    fetchNoticeType()

  }, [page, rowsPerPage]);

  const deleteFile = async (id, name) => {
    const deleteApi = `http://localhost:4000/excel/delete_client_user/${id}`;

    console.log({ id, name });

    setisLoading(true)
    try {
      const res = await fetch(deleteApi, {
        method: "DELETE",
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Assuming the delete operation was successful
        console.log(`${name} deleted successfully`);
      } else {
        // Handle error cases
        console.error(`Error deleting ${name}: ${res.statusText}`);
        // alert(`Error deleting ${name}`);
      }


    } catch (error) {
      console.error("Error fetching data:", error);
    }


    setisLoading(false)

    callapi(API, page, rowsPerPage);
  }

  const sendEmail = async (id, noticeType) => {
    console.log("checking",selectedEmails[id]?.emailformail)
    
    if (!selectedEmails[id]?.emailformail) {
      toast("select email!", {
        position: "top-center",
        autoClose: 1000,
        type: "error",
      });
      return;
    }
    try {
      setLoadingTemplates((prevLoading) => ({
        ...prevLoading,
        [id]: true,
      }));
      

      const res = await fetch(`http://localhost:4000/notice/sendemail/${id}`, {
        method: "put",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({emailformail:selectedEmails[id].emailformail, "noticeType":noticeType, username: `${JSON.parse(localStorage.getItem("username"))}`}),
      });
     
      const result = await res.json();
      setissendloading(false);
      if (result.message === "Saved") {
        toast("email sent successfull!", {
          position: "top-center",
          autoClose: 1000,
          type: "success",
        });
      }
      setLoadingTemplates((prevLoading) => ({
        ...prevLoading,
        [id]: false,
      }));

      callapi(API, page, rowsPerPage);
      // reloadPage();

    } catch (error) {
      console.log(error);
    }
  };

  const reloadPage = () => {
    window.location.reload(); // Reload the page
  };

  const onChange = (event) => {
    setInputsearchvalue(event.target.value);
  };
  const searchhandleChangeT = (event) => {
    setinputsearchtemp(event.target.value);
  };

  const searchhandleChangeM = (event) => {
    setinputsearchmail(event.target.value);
  };

  const resetsearchbar = () => {
    setInputsearchvalue("");
    setinputsearchtemp("");
    setinputsearchmail("");
  };

  const filteredData = revData?.filter((item) => {
    const inputsearch = inputsearchvalue?.toLowerCase();
    const inputsearchtempp = inputsearchtemp?.toLowerCase();
    const inputsearchmaill = inputsearchmail?.toLowerCase();
    const outputsearch = item?.filename?.toLowerCase();
    const outputsearchtemp = item?.template?.toLowerCase();
    const outputsearchmailll = item.emailformail
      ? item.emailformail.toLowerCase()
      : "";

    return (
      outputsearch?.startsWith(inputsearch) &&
      outputsearchtemp?.startsWith(inputsearchtempp) &&
      outputsearchmailll?.startsWith(inputsearchmaill)
    );
  });

  console.log({filteredData});

  const PageSizeSelector = ({ pageSize, onChange }) => (
    <FormControl variant="outlined" size="small" sx={{ marginLeft: 2 }}>
      <Select
        value={pageSize}
        onChange={onChange}
        label="Rows per page"
        inputProps={{
          name: "pageSize",
          id: "page-size-select",
        }}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <>
      <Box className="notice-page" sx={{ display: "flex" }}>
        <AdminNavbar />
        <Box className="right-bar" component="main" sx={{ p: 3 }}>
          <DrawerHeader />
          <Grid container spacing={2}>
            <AnimatedGridItem item xs={12} md={9}>
              <Item className="hello-user">
                <Typography variant="subtitle1" gutterBottom>
                  Hellow User!
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Welcome to {`${JSON.parse(localStorage.getItem("company"))}`}
                </Typography>
              </Item>
            </AnimatedGridItem>
            {/*================ Dialog ============== */}
            <AnimatedGridItem item xs={12} md={3}>
              <Item className="data-upload-area">
                <Typography
                  className="upload-btn"
                  variant="subtitle1"
                  gutterBottom
                >
                  <UploadFileIcon
                    color="secondary"
                    sx={UploadFileIconCSS1}
                    onClick={handleClickOpen}
                  />{" "}
                  Data Upload!{" "}
                </Typography>
                <Button
                  variant="contained"
                  sx={UploadFileIconCSS}
                  color="secondary"
                  onClick={handleClickOpen}
                >
                  Bulk Upload
                </Button>
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>{"Bulk Upload File!"}</DialogTitle>
                  <DialogContent>
                    <Dialogfordata allNoticeType ={allNoticeType}/>
                  </DialogContent>
                </Dialog>
              </Item>
            </AnimatedGridItem>

            {/*================ Searchbar ============== */}
            <AnimatedGridItem className="gray-bg" item xs={12}>
              <Item
                className="filter-bar"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  transition: "transform 0.5s ease",
                  "&:hover": { color: "#1a237e", transform: "scale(0.99)" },
                }}
              >
                <TextField
                  type="Search"
                  placeholder="Search File Name"
                  size="small"
                  onChange={onChange}
                />
                <FormControl size="small">
                  <InputLabel id="demo-simple-select-label">
                    Search Notice Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={inputsearchtemp}
                    label="Notice Type"
                    onChange={searchhandleChangeT}
                  >
                    <MenuItem value="">None</MenuItem>
                    {allNoticeType.map((noticeType, index) => (
      <MenuItem key={index} value={noticeType}>
        {noticeType}
      </MenuItem>
    ))}
                    {/* <MenuItem value={"areness attorneys"}>
                      Areness Attorneys{" "}
                    </MenuItem>
                    <MenuItem value={"Legal & Associates"}>
                      Legal & Associates
                    </MenuItem> */}
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <InputLabel id="demo-simple-select-label">
                    Email ID
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={inputsearchmail}
                    label="Email ID"
                    onChange={searchhandleChangeM}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value={"noreply@areness.com"}>
                      noreply@areness.com
                    </MenuItem>
                    <MenuItem value={"cc@arness.com"}>cc@arness.com</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={resetsearchbar}
                >
                  Reset Filter
                </Button>
              </Item>
            </AnimatedGridItem>
            {/*================ Table ============== */}
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 650, overflow: "auto" }}>
                  {isloading ? (
                    <div className="loading"></div>
                  ) : (
                    <>
                      <Table
                        className="notice-table"
                        stickyHeader
                        aria-label="sticky table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>S. No.</TableCell>
                            <TableCell>File Name</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Notice Type</TableCell>
                            <TableCell>Email ID</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData
                            .map((item, index) => (
                              <TableRow
                                sx={tableCSS}
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={item._id}
                              >
                                <TableCell>
                                  {(page - 1) * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell
                                  onClick={() => totalexceldata(item._id)}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {item.filename} <br />
                                  {/* Count - {item.xlData.length} */}
                                </TableCell>
                                <TableCell>
                                  {new Date(item.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </TableCell>
                                <TableCell>{item.template}</TableCell>
                                <TableCell>
                                  {item.emailformail ? ( item.emailformail ) : ( <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                                      <InputLabel id="demo-simple-select-label">
                                        Select Email
                                      </InputLabel>
                                      <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="emailformail"
                                        value={selectedEmails[item._id]?.emailformail ?? ""}
                                        label="Select email"
                                        onChange={(e)=>handleChange(e, item._id)}
                                      >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value={"pradeep@recqarz.com"}>
                                          pradeep@recqarz.com
                                        </MenuItem>
                                        <MenuItem value={"cc@arness.com"}>
                                          cc@arness.com
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <ButtonGroup>
                                    {item.emailformail ? (
                                      <Button variant="contained" sx={{ px: 5 }} disabled > Sent </Button>
                                    ) : loadingTemplates[item._id]  ? (
                                      <div className="mailpost"></div>
                                    ) : (
                                      <Button
                                        className="send-email" variant="contained" onClick={() => sendEmail(item._id, item.template)} >Send Email</Button>
                                    )}
                                    <Button className="send-sms" variant="contained" >Send SMS</Button>
                                    <Button title='View Details' onClick={() => totalexceldata(item._id)} >
                                      <VisibilityIcon />
                                    </Button>
                                    <Button sx={{ color: '#f50057' }} disabled={item.emailformail ? true : false} title='Delete' onClick={() => deleteFile(item._id, item.filename)} >
                                      <Inventory2OutlinedIcon />
                                    </Button>
                                    {/* <Button disabled={Boolean(item.emailformail)}>
                                                                                <AccessTimeIcon />
                                                                            </Button>
                                                                            <Button disabled={Boolean(item.emailformail)}>
                                                                                <FileDownloadIcon />
                                                                            </Button> */}
                                  </ButtonGroup>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                      {/* <TablePagination
                                                    rowsPerPageOptions={[10, 25, 100]}
                                                    component="div"
                                                    count={filteredData.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page - 1}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                /> */}

                      <Stack spacing={2}>
                        <div className="pagination-container">
                          <div className="pagination-row">
                            <Pagination
                              count={totalDataCount}
                              page={page}
                              onChange={(event, value) => setPage(value)}
                              showFirstButton
                              showLastButton
                              color="secondary"
                            />
                            <PageSizeSelector
                              pageSize={rowsPerPage}
                              onChange={(event) =>
                                setRowsPerPage(event.target.value)
                              }
                            />
                            Rows Per page
                          </div>
                        </div>
                      </Stack>
                    </>
                  )}
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Notice;
