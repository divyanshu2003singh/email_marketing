import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system'
import { Grid, Paper, Typography, ButtonGroup, Button, } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../../../Navbar/AdminNavbar';
import SendIcon from '@mui/icons-material/Send';
import {
    EditOutlined as EditOutlinedIcon,
    RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
    Inventory2Outlined as Inventory2OutlinedIcon,
    Add as AddIcon
} from '@mui/icons-material';
import '../../../style/style.css'
import { toast } from 'react-toastify';



const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
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
const hovereffect = {
    cursor: 'pointer', transition: 'transform 0.5s ease', display: 'flex', flexWrap: 'wrap',
    '&:hover': { transform: 'scale(0.99)', color: '#fff', },
}

const Openemaildetails = () => {
    
    const [hasScript, setHasScript] = useState(false);
    // const [hasTemp, setHasTemp] = useState(false);
    const [Scriptid, setScriptid] = useState();
    // const [Tempid, setTempid] = useState();
    const [allTempData, setAllTempData] = useState([])
    const [allScriptData, setAllScriptData] = useState([])
    const [loadingTemplates, setLoadingTemplates] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    })
    const handleAddEmail = () => {
        navigate("/createemails")
    }
    const handleAddScript = () => {
        navigate("/createscript")
    }

 
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
 
            setAllTempData(tempResult)
           

        } catch (error) {
            console.log(error)
        }

    }


    const showAllScripts = async () => {
           
        try {
            const token = JSON.parse(localStorage.getItem("token"))
            const username = JSON.parse(localStorage.getItem("username"))
            const scriptUrl = `http://localhost:4000/emailscript/getscript?username=${username}`
            
           
            const options = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }
       
            const scriptResponse = await fetch(scriptUrl, options)
            const scriptResult = await scriptResponse.json()
           
         
            setAllScriptData(scriptResult)

        } catch (error) {
            console.log(error)
        }

    }



    console.log(allTempData)
    console.log(allScriptData)
    // console.log(allTempData[0].noticesType)



    ///====== for pdf review of temp
    const onClickforViewPdf = async (id) => {
        console.log('view pdf', id);
        try { 
            setLoadingTemplates((prevLoading) => ({
                ...prevLoading,
                [id]: true,
              }));


            const url = `http://localhost:4000/emailtemp/viewpdf/${id}`
            const options = {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            }
            const response = await fetch(url, options)
            const result = await response.blob()
            const file = new Blob([result], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(file);
            window.open(pdfUrl);
            
            setLoadingTemplates((prevLoading) => ({
                ...prevLoading,
                [id]: false,
              }));

        } catch (error) {
            setLoadingTemplates((prevLoading) => ({
                ...prevLoading,
                [id]: false,
              }));

            console.log(error);
        }
    }

    // ======== for pdf review of script
    const onclickforViewscriptpdf = async (Scriptid) => {
        try {
            setLoadingTemplates((prevLoading) => ({
                ...prevLoading,
                [Scriptid]: true,
              }));

            const url = `http://localhost:4000/emailscript/pdfview/${Scriptid}`
            const token = JSON.parse(localStorage.getItem("token"))
            const options = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }
            const response = await fetch(url, options)
            const result = await response.blob()
            const file = new Blob([result], { type: 'application/pdf' })
            const pdfurl = URL.createObjectURL(file)
            window.open(pdfurl)

            setLoadingTemplates((prevLoading) => ({
                ...prevLoading,
                [Scriptid]: false,
              }));

        } catch (error) {
          
            setLoadingTemplates((prevLoading) => ({
                ...prevLoading,
                [Scriptid]: false,
              }));
            console.log(error)
        }
    }


    //==== fetching data for updates email scripte 
    const forUpdatingScript = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            const username = JSON.parse(localStorage.getItem("username"));

            const url = `http://localhost:4000/emailscript/getscript?username=${username}`;
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await fetch(url, options);
            const result = await response.json();

            setHasScript(!!result._id);
            setScriptid(result._id)
        } catch (error) {
            console.log(error);
        }
    };

    //for delet temp
    const onClickfordelettem = async (id) => {
        console.log("start");
        try {
            const url = `http://localhost:4000/emailtemp/deletpdf/${id}`
            const token = JSON.parse(localStorage.getItem("token"));
            const option = {
                method: "delete",
                headers: {
                    authorization: `bearer ${token}`
                }
            }
            const response = await fetch(url, option)
            const result = await response.json()
            
            if (result.message === "succcess") {
                toast('Temp Deleted Successfully', {
                    position: 'top-center',
                    autoClose: 1000,
                    type: 'success',
                });
               
                // forupdating() 
                showAllTemplates()
                 
            }
        } catch (error) {
            console.log(error)
        }
    }
    //for delet script
    const onClickfordelescript = async (Scriptid) => {
        try {
            const url = `http://localhost:4000/emailscript/deletescript/${Scriptid}`
            const token = JSON.parse(localStorage.getItem("token"));
            const option = {
                method: "delete",
                headers: {
                    authorization: `bearer ${token}`
                }
            }
            const response = await fetch(url, option)
            const result = await response.json()
            if (result.message === "succcess") {
                toast('Script Deleted Successfully', {
                    position: 'top-center',
                    autoClose: 1000,
                    type: 'success',
                });
                // forUpdatingScript()
                showAllScripts()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onClickfortempupdate = (id) => {
        console.log(id);
        navigate(`/editmailtemp/${id}`)
    }

    const onClickforScriptupdate = (id) => {
        navigate(`/editmailscript/${id}`)
       
    }

    useEffect(() => {
        showAllTemplates()
        showAllScripts()
        // forupdating()
        forUpdatingScript()
    }, [])


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <AdminNavbar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    <Grid container spacing={2} >
                        <AnimatedGridItem item xs={12} >
                            <div className='temp-page-title' style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant='h4'>All Template</Typography>
                                <SendIcon />
                                
                            </div> 
                        </AnimatedGridItem>

                        {/* =========email template============ */}
                        <AnimatedGridItem item xs={12} >
                         
                           <div style={{border:'2px solid black'}}>
                           <h3>ALL TEMPLATES</h3>

                           <Button sx={{bgcolor:'red' }} onClick={handleAddEmail}> Add Template</Button>
                         
                         {allTempData.map((e,ind)=>
                         <div className='temps-row' key={ind}>
                          {/* <h3>{e.noticeType}</h3> */}
                          <Paper sx={hovereffect} item xs={12} sm={6} className='temp-item' elevation={3} >
                              <Item className='temp-name'>
                                  <Typography variant='h5'>PDF Content in {e.noticeType} </Typography>
                                  <Typography>Last Updated on: 04 Apr 2023</Typography>
                              </Item >
                              <ButtonGroup>
                                  {e._id ? (
                                      <>
                                          <Button variant='non' title='Edit' onClick={() => onClickfortempupdate(e._id)}
                                              sx={{ color: '#3f51b5' }} > <EditOutlinedIcon /> </Button>
                                          <Button variant='non' title='View Notice'
                                              onClick={()=>onClickforViewPdf(e._id)} sx={{ color: '#009688' }} >
                                             {loadingTemplates[e._id] ? <div className="posting"></div> : <RemoveRedEyeOutlinedIcon />}
                                          </Button>
                                          <Button variant='non' sx={{ color: '#f50057' }} title='delete' onClick={()=>onClickfordelettem(e._id)} >
                                              <Inventory2OutlinedIcon />
                                          </Button>
                                      </>
                                  ) : (
                                      <>
                                          <Button variant='contained' onClick={handleAddEmail} ><AddIcon /> Add New </Button>
                                      </>
                                  )}
                              </ButtonGroup>
                          </Paper>
                        
                      </div> 
                          )}
                          
                          </div>
                           <div style={{border:'2px solid black'}}>
                           <h3>ALL Email Contents</h3>
                           <Button sx={{bgcolor:'red' }} onClick={handleAddScript}> Add Script</Button>
                         
                         {
                         allScriptData?.map((e,ind)=>
                         <div className='temps-row' key={ind}>
                          {/* <h3>{e.noticeType}</h3> */}
                          <Paper sx={hovereffect} item xs={12} sm={6} className='temp-item' elevation={3} >
                              <Item className='temp-name'>
                                  <Typography variant='h5'>Email Body Content in {e.noticeType}</Typography>
                                  <Typography>Last Updated on: 04 Apr 2023</Typography>
                              </Item>
                              <ButtonGroup>
                                  {e._id ? (
                                      <>
                                          <Button variant='non' title='Edit' sx={{ color: '#3f51b5' }}
                                              onClick={() => onClickforScriptupdate(e._id)} >
                                              <EditOutlinedIcon />
                                          </Button>
                                          <Button variant='non' title='View Notice' onClick={()=>onclickforViewscriptpdf(e._id)}  sx={{ color: '#009688' }} >
                                              {loadingTemplates[e._id] ? <div className="posting"></div> : <RemoveRedEyeOutlinedIcon />}
                                          </Button>
                                          <Button variant='non' sx={{ color: '#f50057' }} title='delete' onClick={()=> onClickfordelescript(e._id)} >
                                              <Inventory2OutlinedIcon />
                                          </Button>
                                      </>
                                  ) : (
                                      <Button variant='contained' onClick={handleAddScript} > <AddIcon /> Add New </Button>
                                  )}
                              </ButtonGroup>
                          </Paper>
                      </div> 
                          )
                          }
                          
                          </div>
                           
                        </AnimatedGridItem>
                    </Grid>
                </Box>
            </Box>
        </>
    )

}



export default Openemaildetails