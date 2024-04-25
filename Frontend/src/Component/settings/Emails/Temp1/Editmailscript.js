import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Button, ButtonGroup, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import AdminNavbar from '../../../Navbar/AdminNavbar';
import '../../CKeditor.css';

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

const Editmailscript = () => {
    const [contentInner, setContentInner] = useState('');
    const [contentFooter, setContentFooter] = useState('');
    
const [noticeType, setNoticeType] = useState('')
    const { id } = useParams()
    console.log(id)

    const getInitialInputData = {
        Subject: '',
        SubjectContent: '',
        CustomerName: '',

    };
    const [inputData, setInputData] = useState(getInitialInputData);
    const navigate = useNavigate();

    const inputHandleOnChange = (event) => {
        const { name, value } = event.target;
        setInputData((prevInputData) => ({ ...prevInputData, [name]: value }));
    };

    const onClickForReset = () => {
        setInputData(getInitialInputData);
        setContentInner('');
        setContentFooter('');
        setNoticeType('');
    };


    const callapi = async () => {
        try {
            const API = `http://localhost:4000/emailscript/getscript/${id}`
            const option = {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            }
            const response = await fetch(API, option)
            const result = await response.json()
            setInputData({
                Subject: result.Subject,
                SubjectContent: result.SubjectContent,
                CustomerName: result.CustomerName,
            })
            setContentInner(result.ContentInner)
            setContentFooter(result.ContentFooter)
            setNoticeType(result.noticeType)
        } catch (error) {
            console.log(error)
        }
    }

    const CreateScript = async () => {
        try {
            const requestData = {
                Subject: inputData.Subject,
                SubjectContent: inputData.SubjectContent,
                CustomerName: inputData.CustomerName,
                ContentInner: contentInner,
                noticeType: noticeType,
                ContentFooter: contentFooter,
                username: JSON.parse(localStorage.getItem('username')),
                role: JSON.parse(localStorage.getItem('role')),
            };
            const response = await fetch(`http://localhost:4000/emailscript/script/${id}`, {
                method: 'PUT',
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            const result = await response.json();
            console.log(result);
            if (!result) {
                toast("error", {
                    position: "top-center",
                    autoClose: 1000,
                    type: "error"
                })
            } else {
                toast('Script Created Successfully', {
                    position: 'top-center',
                    autoClose: 1000,
                    type: 'success',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        }
        callapi()
    }, []);

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <AdminNavbar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Subject"
                                name="Subject"
                                value={inputData.Subject}
                                onChange={inputHandleOnChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Subject Content"
                                name="SubjectContent"
                                value={inputData.SubjectContent}
                                onChange={inputHandleOnChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Dear [Customer's Name]"
                                name="CustomerName"
                                value={inputData.CustomerName}
                                onChange={inputHandleOnChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Notice Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={noticeType}
                  label="Select Template"
                  onChange={(e)=> setNoticeType(e.target.value)}
                >
                   
                  <MenuItem value={"Assamese"}>Assamese</MenuItem>
                  <MenuItem value={"Demand Notice - SBI Card Account No (QLD)"}>
                    Demand Notice - SBI Card Account No (QLD)
                  </MenuItem>
                  <MenuItem value={"Demand Notice SBI Credit Card No"}>
                    Demand Notice SBI Credit Card No
                  </MenuItem>
                  <MenuItem value={"Hindi"}>Hindi</MenuItem>
                  <MenuItem
                    value={"Invitation to Conciliation as per Provisions"}
                  >
                    Invitation to Conciliation as per Provisions
                  </MenuItem>
                  <MenuItem value={"Invitation to Conciliation"}>
                    Invitation to Conciliation
                  </MenuItem>
                  <MenuItem value={"Kannada"}>Kannada</MenuItem>
                  <MenuItem value={"Malayalam"}>Malayalam</MenuItem>
                  <MenuItem value={"Marathi"}>Marathi</MenuItem>
                  <MenuItem
                    value={"New Demand Notice - SBI Card Account No (QLD)"}
                  >
                    New Demand Notice - SBI Card Account No (QLD)
                  </MenuItem>
                  <MenuItem value={"New Demand Notice SBI Credit Card No"}>
                    New Demand Notice SBI Credit Card No
                  </MenuItem>
                  <MenuItem
                    value={"Notice Prior to the Filing of Execution Petition"}
                  >
                    Notice Prior to the Filing of Execution Petition
                  </MenuItem>
                  <MenuItem value={"Odia"}>Odia</MenuItem>
                  <MenuItem value={"Punjabi"}>Punjabi</MenuItem>
                  <MenuItem value={"SBICPSL-LEGAL-VGPPC-100323-22364"}>
                    SBICPSL-LEGAL-VGPPC-100323-22364
                  </MenuItem>
                  <MenuItem value={"Tamil"}>Tamil</MenuItem>
                  <MenuItem value={"Telugu"}>Telugu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
                        {/* ==============ck-editor text areas============== */}
                        <Grid item xs={12}>
                            <Item sx={{ m: 1 }}>
                                <Typography>
                                    <strong>Inner Section</strong>
                                </Typography>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={contentInner}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setContentInner(data);
                                    }}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={12}>
                            <Item sx={{ m: 1 }}>
                                <Typography>
                                    <strong>Footer Section</strong>
                                </Typography>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={contentFooter}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setContentFooter(data);
                                    }}
                                />
                            </Item>
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <ButtonGroup>
                                <Button onClick={onClickForReset}>Reset</Button>
                                <Button onClick={CreateScript}>Submit</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
};


export default Editmailscript