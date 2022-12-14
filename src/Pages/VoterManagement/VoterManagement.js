import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, IconButton, MenuItem,
    Pagination, Paper, Select, Snackbar,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {useParams} from "react-router-dom";
import {DeleteVoterService, GetVoterService} from "../../Services/VoterServices"
import {
    RowBox,
    RowNumber,
    Section,
    TitleText,
    AddTextButton,
    VoterButton,
    VoterText,
    MainDashboard,
    Pic, TitleBox, MainTitleText, TitleText2, VoterIcon
} from "../../StyledTags/VoterManagementTags";
import Dashboard from "../../Layout/Dashboard";
import AddUser from "../../images/AddUser.png";
import AddVoter from "./AddVoter";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const VoterManagement = () => {

    const [delId, setDelId] = useState("");
    const [voter, setVoter] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [message, setMessage] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const params = useParams();

    useEffect(() => {
        const response = async () => {
            const result = await GetVoterService(params.id, pageNumber, pageSize);
            setVoter(result.data);
            setPageCount(result.total);
        }
        response().catch(console.error);
    }, [pageNumber, pageSize, isUpdating]);

    const deleteVoter = (e) => {
        e.preventDefault();
        const response = async () => {
            await DeleteVoterService(delId, params.id);
            setIsUpdating(!isUpdating);
            setOpenDeleteDialog(false);
            setDelId("");
            setMessage("?????? ?????????? ???????????? ?????? ?????? ??????????")
            setOpenAlert(true);
            setAlertType("success");
        }
        response().catch(console.error);
    };

    const handleEditVoter = (e) => {
        e.preventDefault();
        setMessage("?????????? ???????????? ?????? ???????????? ???????? ??????")
        setOpenAlert(true);
        setAlertType("error");
    };

    const handleSelectedVoter = (e, id) => {
        e.preventDefault();
        setOpenDeleteDialog(true);
        setDelId(id);
    };

    const handleCloseDialog = (e) => {
        e.preventDefault();
        setOpenDeleteDialog(false);
        setDelId("");
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
            <Grid2 container sx={{width: '98%', mx: 'auto', mt: '32px'}}>
                <Grid2 md={3} lg={2}>
                    <MainDashboard container sx={{display: {md: 'block', xs: 'none'}}}>
                        <Dashboard/>
                    </MainDashboard>
                </Grid2>
                <Grid2 md={9} lg={10} sx={{width: '100%', pl: {md: '10px'}, mb: '5%'}}>
                    <Grid2 sx={{background: '#EAF8FF', borderRadius: '4px', border: '1px solid #425C81'}}>
                        <Stack direction="row" justifyContent="space-between" sx={{mr: '12px'}}>
                            <TitleBox>
                                <MainTitleText>
                                    ???????????? ?????? ?????????? ????
                                </MainTitleText>
                            </TitleBox>
                            <VoterButton variant='contained' onClick={() => setOpenAddForm(true)}>
                                <Pic src={AddUser}/>
                                <AddTextButton>?????????? ????????</AddTextButton>
                            </VoterButton>
                            <AddVoter setIsUpdating={setIsUpdating} isUpdating={isUpdating}
                                      openAddForm={openAddForm} setOpenAddForm={setOpenAddForm}/>
                        </Stack>
                        {voter.length === 0 ?
                            <TitleText2>?????? ?????????? ???? ???????? ??????????</TitleText2> :
                            <TableContainer component={Paper} sx={{display: {xs: 'none', md: 'block'}}}>
                                <Table sx={{minWidth: 650}} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{pl: 2}}>????????</TableCell>
                                            <TableCell>?????? ?? ?????? ????????????????</TableCell>
                                            <TableCell>???? ??????</TableCell>
                                            <TableCell>?????????? ????????</TableCell>
                                            <TableCell>??????????</TableCell>
                                            <TableCell align="right" sx={{pr: 4}}>????????????</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            voter.map((v, i) =>
                                                <TableRow key={v.id}>
                                                    <TableCell sx={{pl: 2}}>
                                                        {(pageNumber - 1) * 10 + (i + 1)}
                                                    </TableCell>
                                                    <TableCell>{v.firstName} {v.lastName}</TableCell>
                                                    <TableCell>{v.nationalCode}</TableCell>
                                                    <TableCell>{v.phoneNumber}</TableCell>
                                                    <TableCell>{v.isActive === true ? "????????" : "?????? ????????"}</TableCell>
                                                    <TableCell sx={{pr: 1}}>
                                                        <Stack direction="row" justifyContent="flex-end">
                                                            <Tooltip title="??????">
                                                                <VoterIcon
                                                                    onClick={(e) => handleSelectedVoter(e, v.id)}
                                                                >
                                                                    <DeleteIcon fontSize="medium"/>
                                                                </VoterIcon>
                                                            </Tooltip>
                                                            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                                                                <DialogTitle id="alert-dialog-title">
                                                                    {"??????????!"}
                                                                </DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText id="alert-dialog-description">
                                                                        ?????? ???? ?????? ???????????????? ?????????? ????????
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button color="success" onClick={handleCloseDialog}>
                                                                        ??????
                                                                    </Button>
                                                                    <Button color="error"
                                                                            onClick={deleteVoter}>??????</Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                            <Tooltip title="????????????">
                                                                <VoterIcon onClick={(e) => handleEditVoter(e, v.id)}>
                                                                    <EditIcon fontSize="medium"/>
                                                                </VoterIcon>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                        <Grid2 sx={{display: {xs: 'block', md: 'none'}}}>
                            {
                                voter.map((v, i) =>
                                    <Section key={v.id}>
                                        <Stack direction="row">
                                            <RowBox>
                                                <RowNumber>{(pageNumber - 1) * 10 + (i + 1)}</RowNumber>
                                            </RowBox>
                                            <Grid2 xs={12}>
                                                <Stack direction="row" justifyContent="space-between" sx={{mb: '4px'}}>
                                                    <TitleText>?????? ?? ??????
                                                        ????????????????:&nbsp;{v.firstName} {v.lastName}</TitleText>
                                                </Stack>
                                                <Stack direction={{xs: 'column', sm: 'row'}} sx={{mb: '4px'}}>
                                                    <Grid2 xs={6}>
                                                        <VoterText>
                                                            ??????????:&nbsp;{v.nationalCode}
                                                        </VoterText>
                                                    </Grid2>
                                                    <Grid2 xs={6}>
                                                        <VoterText>
                                                            ?????????? ????????:&nbsp;{v.phoneNumber}
                                                        </VoterText>
                                                    </Grid2>
                                                </Stack>
                                                <Stack direction="row" sx={{mb: '4px'}}>
                                                    <VoterText>
                                                        ??????????: &nbsp;{v.isActive === true ? "????????" : "??????????????"}
                                                    </VoterText>
                                                </Stack>
                                            </Grid2>
                                            <Stack direction="column" justifyContent="space-around">
                                                <VoterButton variant="contained"
                                                             onClick={(e) => handleSelectedVoter(e, v.id)}>??????
                                                </VoterButton>
                                                <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                                                    <DialogTitle id="alert-dialog-title">
                                                        {"??????????!"}
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-description">
                                                            ?????? ???? ?????? ???????????????? ?????????? ????????
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button color="success" onClick={handleCloseDialog}>
                                                            ??????
                                                        </Button>
                                                        <Button color="error" onClick={deleteVoter}>??????</Button>
                                                    </DialogActions>
                                                </Dialog>
                                                <VoterButton variant="contained"
                                                             onClick={(e) => handleEditVoter(e, v.id)}>
                                                    ????????????
                                                </VoterButton>
                                            </Stack>
                                        </Stack>
                                    </Section>
                                )
                            }
                        </Grid2>
                        {
                            voter.length === 0 ? null :
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Pagination count={Math.ceil(pageCount / pageSize)} dir="ltr"
                                                onChange={(_, e) => setPageNumber(e)}/>

                                    <FormControl sx={{m: 1, p: 0}}>
                                        <Select
                                            value={pageSize}
                                            onChange={(e) => setPageSize(e.target.value)}
                                            inputProps={{'aria-label': 'Without label'}}
                                        >
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                        }
                    </Grid2>
                </Grid2>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={openAlert}
                    autoHideDuration={3000}
                    onClose={handleCloseAlert}
                >
                    <Alert severity={alertType} action={closeIcon}>{message}</Alert>
                </Snackbar>
            </Grid2>
        </>
    );
};

export default VoterManagement;