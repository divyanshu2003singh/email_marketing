import React, {  useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system'
import { Avatar, Button, ButtonGroup, Grid, Paper, TextField, Typography } from '@mui/material';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../../Navbar/AdminNavbar';
import '../../CKeditor.css'


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

const Createnotice = () => {
    const [ContentInner, setContentInner] = useState('')
    const [ContentFooter, setContentFooter] = useState('')
    console.log(ContentInner)
    const navigate = useNavigate()
    const [avatarImage, setAvatarImage] = useState(null);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setAvatarImage(reader.result);
        };
    };
    console.log(avatarImage)
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, [])

    const ListItemCSS = {
        display: 'block', cursor: "pointer",
        width: "100px",
        height: "100px",
        borderRadius: "100%",
        boxShadow: "0 0 0 10px #eceff1",
        background: "#eceff1"
    }
    const styles = {
        fileInput: {
          display: 'none', // hide the default input element
        },
        label: {
          display: 'block',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          boxShadow: '0 0 0 10px #eceff1',
          cursor: 'pointer',
          overflow: 'hidden',
        },
        labelText: {
          display: 'block',
          textAlign: 'center',
          marginTop: '45px',
          fontSize: '14px',
          color: '#777',
        },
      };

    //preparing notice
    // const exportHtml = async () => {
    //     emailEditorRef.current.editor.exportHtml((data) => {
    //         const { html } = data;
    //         const Obj = {
    //             html: html
    //         }
    //         setGethtml(Obj)
    //     });

    //     try {
    //         const res = await fetch("http://localhost:4000/notice/savehtml", {
    //             method: "post",
    //             headers: {
    //                 'content-type': 'application/json'
    //             },
    //             body: JSON.stringify(gethtml)
    //         })
    //         const result = await res.json()
    //         if (result.message === "Saved") {
    //             toast("Saved!", {
    //                 position: "top-center",
    //                 autoClose: 1000,
    //                 type: "success"
    //             })
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // };


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <AdminNavbar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, }}>
                    <DrawerHeader />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <label style={styles.label}>
                                {avatarImage ? (
                                    <Avatar sx={ListItemCSS} src={avatarImage} />
                                ) : (
                                    <>
                                        <input
                                            type="file"
                                            style={styles.fileInput}
                                            onChange={handleAvatarChange}
                                            accept="image/*"
                                        />
                                        <Typography variant="body2" component="span" style={styles.labelText}>
                                            LOGO
                                        </Typography>
                                    </>
                                )}
                            </label>
                        </Grid>
                       
                        <Grid item xs={12} sm={6} md={3}> </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Enter title here" variant="outlined" size="small" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <TextField label="Enter Sub title here" variant="outlined" size="small" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField label="Notice Id" variant="outlined" size="small" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField label="Notice Id 123456" variant="outlined" size="small" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField label="Notice Date" variant="outlined" size="small" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}  md={3}>
                            <TextField label="Notice Date 03/05/2023" variant="outlined" size="small" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="<<to>>" variant="outlined" size="small" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <TextField label="<<address>>" variant="outlined" size="small" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField label="Subject" variant="outlined" size="small" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField label="Subject Title" variant="outlined" size="small" fullWidth />
                        </Grid>
                        {/* ==============ck-editor text areas==============  */}
                        <Grid item xs={12} >
                            <Paper elevation={3} sx={{ width: "100%", p: 3, maxWidth: "1200px", mx: "auto" }}>
                                <Item sx={{ m: 1 }}>
                                    <Item><strong>Inner Section</strong></Item>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={ContentInner}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setContentInner(data);

                                        }}
                                    />
                                </Item>
                                <Item sx={{ m: 1 }}>
                                    <Item><strong>Footer Section</strong></Item>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={ContentFooter}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setContentFooter(data);
                                        }}
                                    />
                                </Item>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}   sx={{display:"flex", justifyContent:"flex-end"}}>
                            <ButtonGroup>
                            <Button>Reset</Button>
                            <Button>Submit</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )

}


export default Createnotice