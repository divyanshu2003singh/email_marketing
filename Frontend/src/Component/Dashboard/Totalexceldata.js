import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system'
import {
    Button, ButtonGroup, Dialog, DialogContent, DialogTitle, FormControl, Grid, List, ListItem,
    ListItemText, MenuItem, Pagination, Paper, Select, Slide, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import Dialogresendemail from './Dialogresendemail';
import Dialogtimeline from './Dialogtimeline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AdminNavbar from '../Navbar/AdminNavbar';
import '../style/style.css'
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
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
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const IconsCSS = { cursor: "pointer", transition: "transform 0.5s ease", "&:hover": { color: "#1a237e", borderRadius: "50%", transform: "scale(1.2)" } }
const tableCSS = { cursor: "pointer", transition: "transform 0.5s ease", "&:hover": { color: "#1a237e", transform: "scale(0.99)" } }

const Totalexceldata = () => {
    const [open1, setopen1] = useState(false);
    const [open2, setopen2] = useState(false);
    const [results, setResults] = useState([])
    const [heders, setheaders] = useState([])
    const [totalDataCount, setTotalDataCount] = useState(1)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isloading, setisLoading] = useState(true)
    const navigate = useNavigate()
    const { id } = useParams()


    const handleClickopen1 = () => {
        setopen1(true);
    };

    const handleClickopen2 = () => {
        setopen2(true);
    };

    const handleClose1 = () => {
        setopen1(false);
    };

    const handleClose2 = () => {
        setopen2(false);
    };

    const API = `http://localhost:4000/excel/${id}`

    const callapi = async (page,pageSize) => {
        setisLoading(true)
        try {
            const res = await fetch(`${API}?pageSize=${pageSize}&page=${page}`, {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
                },
            })
            const result = await res.json()

            setheaders(result.message1)
            // setResults(result.message)
            // console.log("callApi", result.message)
            // setisLoading(false)

            console.log({results}) 
            const resultArray = Array.isArray(result.message) ? result.message : [result.message];
 
            const adjustedResultArray = resultArray.map((item, index) => ({
                ...item,
                rowIndex: (page - 1) * pageSize + index + 1, // Calculate the rowIndex based on the current page and index
            }));
 
            setResults(adjustedResultArray);
            setTotalDataCount(parseInt(result.totalPages));
 
            setisLoading(false);


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }







console.log("total excel data",results)

    const openPDF = (excelId, xlDataId) => {
        const PDF_URL = `http://localhost:4000/excel/pdf/${excelId}/${xlDataId}`;
        window.open(PDF_URL, '_blank');
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        }
        callapi(page,pageSize);
    }, [page,pageSize]);

    const PageSizeSelector = ({ pageSize, onChange }) => (
        <FormControl variant="outlined" size="small" sx={{ marginLeft: 2 }}>
            <Select
                value={pageSize}
                onChange={onChange}
                label="Rows per page"
                inputProps={{
                    name: 'pageSize',
                    id: 'page-size-select',
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
            <Box className="single-excel" sx={{ display: 'flex' }}>
                <AdminNavbar />
                <Box className='right-bar' component="main" sx={{p: 3, }}>
                    <DrawerHeader />
                    <Grid container spacing={2}>
                        <AnimatedGridItem item xs={12}>
                            <Item className='file-data' >
                                <List className='file-ul'>
                                    <ListItem>File Name <br /><strong>{heders.filename}</strong> </ListItem>
                                    <ListItem>Created Date <br /> <strong> {new Date(heders.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', })}</strong></ListItem>
                                    <ListItem>Created Time <br /> <strong> {new Date(heders.createdAt).getHours()}-{new Date(heders.createdAt).getMinutes()}-{new Date(heders.createdAt).getSeconds()}</strong></ListItem>
                                    <ListItem>Records Uploaded <br /><strong>{results.length}</strong></ListItem>
                                    <ListItem>Email ID <br /><strong> {heders.emailformail}</strong></ListItem>
                                    <ListItem>Status <br /><strong> {heders.emailformail ? "sent" : "pending"}</strong></ListItem>
                                    <ListItem>File Uploaded <br /><strong>----</strong></ListItem>
                                </List>
                            </Item>
                        </AnimatedGridItem>
                        <AnimatedGridItem item xs={12}>
                            <Item className='notice-table resend-row'>
                                <div className='f-name'>{heders.filename}</div>
                                <ButtonGroup>
                                    <Button variant='contained' className='send-email' onClick={handleClickopen1}>Re-Send Email</Button>
                                    <Dialog open={open1} TransitionComponent={Transition} keepMounted onClose={handleClose1} aria-describedby="alert-dialog-slide-description">
                                        <DialogTitle>{"Resend Email"}</DialogTitle>
                                        <DialogContent>
                                            <Dialogresendemail />
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant='contained' className='send-sms'>Re-Send SMS</Button>
                                </ButtonGroup>
                            </Item>
                        </AnimatedGridItem >
                        <AnimatedGridItem item xs={12}>
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 570 }}>
                                    {isloading ? (
                                        <div className="loading"></div>
                                    ) :(<>
                                    
                                    <Table className='notice-table' stickyHeader aria-label="sticky table">
                                            <TableHead >
                                                <TableRow  >
                                                    <TableCell><strong> S. No.</strong></TableCell>
                                                    <TableCell><strong> Applicant Name</strong> </TableCell>
                                                    <TableCell><strong>Email ID</strong></TableCell>
                                                    <TableCell><strong>Phone Number</strong></TableCell>
                                                    <TableCell><strong>Due Amount</strong></TableCell>
                                                    <TableCell><strong>PDF</strong></TableCell>
                                                    <TableCell><strong>Actions</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    results.map((item, index) => {
                                                        return (
                                                            <TableRow sx={tableCSS} hover role="checkbox" tabIndex={-1} key={item._id}>

                                                                <TableCell  >{(page - 1) * pageSize + index + 1} </TableCell>
                                                                <TableCell sx={{ cursor: 'pointer' }} >{item.FPR_NAME}</TableCell>
                                                                <TableCell >{item.E_mail} </TableCell>
                                                                <TableCell >{item.MOBILEPHONE_HOME}</TableCell>
                                                                <TableCell >{item.DPI_Amount} </TableCell>
                                                                <TableCell className='pdf-icon'>
                                                                    <PictureAsPdfIcon variant="contained" onClick={() => openPDF(id, item._id)} />
                                                                </TableCell>
                                                                <TableCell sx={{ display: "flex", justifyContent: "space-between" }}>
                                                                    <ButtonGroup>
                                                                        <Button className='send-email' variant="contained" size="small">Re-Send Email</Button>
                                                                        <Button className='send-sms' variant='contained' size="small">Re-Send SMS</Button>
                                                                        {/* <Button variant='non'><WhatsAppIcon sx={{
                                                                            color: "#24D555",
                                                                            transition: "transform 0.5s ease", "&:hover": { transform: "scale(1.2)" }
                                                                        }} /></Button>
                                                                        <Button variant='non' sx={IconsCSS}><EmailOutlinedIcon /></Button> */}
                                                                    </ButtonGroup>
                                                                    <Button variant='non' sx={IconsCSS} onClick={handleClickopen2}><UpdateOutlinedIcon /></Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                        <Stack spacing={2} >
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
                                                <PageSizeSelector pageSize={pageSize} onChange={(event) => setPageSize(event.target.value)} />
                                                Rows Per page
                                            </div>
                                        </div>
                                    </Stack>
                                    </>)
                                    }
                                </TableContainer>
                            </Paper>
                        </AnimatedGridItem>
                        <Dialog
                            open={open2}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose2}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogContent>
                                <Dialogtimeline />
                            </DialogContent>
                        </Dialog>
                    </Grid>
                </Box>
            </Box>
        </>

    )

}

export default Totalexceldata 