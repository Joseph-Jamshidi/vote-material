import React, {useContext, useState} from 'react';
import Grid2 from "@mui/material/Unstable_Grid2";
import {HeaderText, LoginButton, MainSection, Pic} from "../../StyledTags/ForgetPasswordTags";
import {Alert, Box, IconButton, InputAdornment, Snackbar, TextField} from "@mui/material";
import Ellipse653 from "../../images/Ellipse653.png";
import Ellipse654 from "../../images/Ellipse654.png";
import Vector from "../../images/Vector.png";
import Ellipse652 from "../../images/Ellipse652.png";
import CloseIcon from "@mui/icons-material/Close";
import {ForgetPasswordService} from "../../Services/UserServices";
import {useNavigate} from "react-router-dom";
import Stroke from "../../images/Stroke.png";
import {ProgressBarContext} from "../../Contexts/PublicContext";

const ForgetPassword = () => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState("info");

    const {setShowProgressBar} = useContext(ProgressBarContext);
    let navigate = useNavigate();

    const handleSubmit = (e) => {
        setShowProgressBar("block");
        e.preventDefault();
        const phone = {
            phoneNumber: phoneNumber
        };
        const response = async () => {
            const result = await ForgetPasswordService(phone);
            if (result.isSuccess===true){
                navigate("../SetNewPassword");
                setShowProgressBar("none");
            }else {
                setOpenAlert(true);
                setMessage(result.message);
                setAlertType("error");
                setShowProgressBar("none");
            }
        }
        response().catch(()=>{
            setShowProgressBar("none")
        });
    };

    const handleCloseAlert = (e, reason) => {
        if (reason === "clickaway") {
            return
        }
        setOpenAlert(false)
    };

    const closeIcon = (
        <IconButton sx={{p: 0}} onClick={() => setOpenAlert(false)}>
            <CloseIcon/>
        </IconButton>
    );

    return (
        <>
            <Grid2 container justifyContent='center' sx={{mt: '40px', pb: '365px', position: 'relative'}}>
                <Grid2 xs={11} sm={8} md={6} lg={4}>
                    <MainSection>
                        <Grid2 container>
                            <Grid2 sx={{width: '100%', my: '1%'}}>
                                <HeaderText>فراموشی کلمه عبور</HeaderText>
                            </Grid2>
                            <Box component="form" sx={{width: '100%'}} onSubmit={handleSubmit}>
                                <Grid2 container sx={{pt: '4%'}}>
                                    <Grid2 container sx={{width: '100%', my: '1%'}}>
                                        <TextField
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            label="شماره تلفن خود را وارد کنید"
                                            sx={{m: 1, width: '100%'}}
                                            type="number"
                                            InputProps={{
                                                startAdornment:
                                                    <InputAdornment position="start"><Pic
                                                        src={Stroke}/></InputAdornment>,
                                            }}
                                        />
                                    </Grid2>
                                    <Grid2 container sx={{width: '100%', mb: '0', mt: '1%'}}>
                                        <LoginButton variant="contained" type="submit">بازیابی</LoginButton>
                                    </Grid2>
                                </Grid2>
                            </Box>
                        </Grid2>
                        <Snackbar
                            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                            open={openAlert}
                            autoHideDuration={3000}
                            onClose={handleCloseAlert}
                        >
                            <Alert severity={alertType} action={closeIcon}>{message}</Alert>
                        </Snackbar>
                    </MainSection>
                </Grid2>
                <Box sx={{position: 'absolute', bottom: '0', left: 0, display: {md: 'block', xs: 'none'}}}>
                    <Pic src={Ellipse653} alt=""/>
                </Box>
                <Box sx={{position: 'absolute', bottom: '0', left: 0, display: {md: 'block', xs: 'none'}}}>
                    <Pic src={Ellipse654} alt=""/>
                </Box>
                <Box sx={{position: 'absolute', bottom: '0', left: 0, display: {md: 'block', xs: 'none'}}}>
                    <Pic src={Vector} alt=""/>
                </Box>
                <Box sx={{position: 'absolute', bottom: '0', right: 0, display: {md: 'block', xs: 'none'}}}>
                    <Pic src={Ellipse652} alt=""/>
                </Box>
                <Box sx={{position: 'absolute', bottom: '0', right: 0, display: {md: 'block', xs: 'none'}}}>
                    <Pic src={Ellipse653} alt=""/>
                </Box>
                <Box sx={{position: 'absolute', bottom: '0', right: 0, display: {md: 'block', xs: 'none'}}}>
                    <Pic src={Vector} alt=""/>
                </Box>
            </Grid2>
        </>
    );
};

export default ForgetPassword;