import React, {useEffect, useState} from 'react';
import {
    ElectionButton,
    ElectionText,
    LinkButton,
    ManageButton,
    RowBox, RowNumber,
    Section,
    TitleText
} from "../../StyledTags/VotingTags";
import {
    Alert,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl, IconButton,
    MenuItem,
    Pagination, Paper,
    Select, Snackbar,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip
} from "@mui/material";
import {DeleteElectionService, GetElectionService} from "../../Services/ElectionServices";
import {useNavigate} from "react-router-dom";
import Grid2 from "@mui/material/Unstable_Grid2";
import {DateObject} from "react-multi-date-picker";
import persian_en from "react-date-object/locales/persian_en";
import persian from "react-date-object/calendars/persian";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from "@mui/icons-material/Close";

const ElectionList = ({afterGetVotingList}) => {

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [delId, setDelId] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const [elections, setElections] = useState([{
        name: '',
        startDate: '',
        endDate: '',
        candidateCount: '',
        userVoteCount: '',
        id: ''
    }]);

    let navigate = useNavigate();

    useEffect(() => {
        const response = async () => {
            const result = await GetElectionService(pageNumber, pageSize);
            setElections(prepareData(result.data));
            setPageCount(result.total);
            afterGetVotingList(result.count);
        }
        response().catch(console.error);
    }, [pageNumber, pageSize, isUpdating]);

    const prepareData = (elections) => {
        return elections.map(m => {
            m.persianStartDate = convertTime(m.startDate);
            m.persianEndDate = convertTime(m.endDate);
            return m;
        });
    };

    const convertTime = (date) => {
        const dateObj = new Date(date);
        const object = {dateObj, format: "YYYY-MM-DD"}
        const persianDate = new DateObject(object).convert(persian, persian_en).format();
        return (persianDate)
    };

    const handleCandidateManagement = (e, id) => {
        e.preventDefault();
        navigate(`../CandidateManagement/${id}`);
    };

    const handleVoterManagement = (e, id) => {
        e.preventDefault();
        navigate(`../VoterManagement/${id}`);
    };

    const handleCloseDialog = () => {
        setOpenDeleteDialog(false);
        setDelId('');
    };

    const handleSelectedVote = (e, id) => {
        e.preventDefault();
        setOpenDeleteDialog(true);
        setDelId(id);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        const response = async () => {
            await DeleteElectionService(delId);
            setDelId("");
            setIsUpdating(!isUpdating);
            setOpenDeleteDialog(false);
            setMessage("???????????????? ???????????? ?????? ?????? ??????????")
            setOpenAlert(true);
            setAlertType("success")
        };
        response().catch(console.error);
    };

    const handleEdit = (e, id) => {
        e.preventDefault();
        navigate(`../CreateElection/${id}`);
    };

    const handleCloseAlert = (e, reason) => {
        if (reason === "clickaway") {
            return
        }
        setOpenAlert(false)
    };

    const close = (
        <IconButton sx={{p: 0}} onClick={() => setOpenAlert(false)}>
            <CloseIcon/>
        </IconButton>
    );

    return (
        <>
            <TableContainer component={Paper} sx={{display: {xs: 'none', md: 'block'}}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>????????</TableCell>
                            <TableCell>?????????? ????????????????</TableCell>
                            <TableCell>?????????? ???????? ????????????????</TableCell>
                            <TableCell>?????????? ?????????? ????????????????</TableCell>
                            <TableCell align="center">?????????? ????????????????</TableCell>
                            <TableCell align="center">?????????? ?????? ???? ??????????</TableCell>
                            <TableCell colSpan={4} align="center">??????????????</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            elections.map((el, i) =>
                                <TableRow key={el.id}>
                                    <TableCell sx={{pl: 2}}>{(pageNumber - 1) * 10 + (i + 1)}</TableCell>
                                    <TableCell>{el.name}</TableCell>
                                    <TableCell sx={{pl: 3}}>{el.persianStartDate}</TableCell>
                                    <TableCell sx={{pl: 3}}>{el.persianEndDate}</TableCell>
                                    <TableCell align="center">{el.candidateCount}</TableCell>
                                    <TableCell align="center">{el.userVoteCount}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" justifyContent="center">
                                            <Stack direction="column" alignItems="center">
                                                <Tooltip title="???????????? ????????????????">
                                                    <ElectionButton
                                                        onClick={(e) => handleCandidateManagement(e, el.id)}>
                                                        <ManageAccountsIcon/>
                                                    </ElectionButton>
                                                </Tooltip>
                                                <Tooltip title="???????????? ?????? ?????????? ????">
                                                    <ElectionButton onClick={(e) => handleVoterManagement(e, el.id)}>
                                                        <GroupsIcon/>
                                                    </ElectionButton>
                                                </Tooltip>
                                            </Stack>
                                            <Stack direction="column" alignItems="center">
                                                <Tooltip title="??????">
                                                    <ElectionButton onClick={(e) => handleSelectedVote(e, el.id)}>
                                                        <DeleteIcon fontSize="medium"/>
                                                    </ElectionButton>
                                                </Tooltip>
                                                <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                                                    <DialogTitle id="alert-dialog-title">{"??????????!"}</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-description">
                                                            ?????? ???? ?????? ???????????????? ?????????? ????????
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button color="success" onClick={handleCloseDialog}>??????</Button>
                                                        <Button color="error" onClick={handleDelete}>??????</Button>
                                                    </DialogActions>
                                                </Dialog>
                                                <Tooltip title="????????????">
                                                    <ElectionButton onClick={(e) => handleEdit(e, el.id)}>
                                                        <EditIcon fontSize="medium"/>
                                                    </ElectionButton>
                                                </Tooltip>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid2 sx={{display: {xs: 'block', md: 'none'}}}>
                {
                    elections.map((el, i) =>
                        <Section key={el.id}>
                            <Stack direction="row">
                                <RowBox>
                                    <RowNumber>{(pageNumber - 1) * 10 + (i + 1)}</RowNumber>
                                </RowBox>
                                <Grid2 xs={12}>
                                    <Stack direction="row" justifyContent="space-between" sx={{mb: '4px'}}>
                                        <TitleText variant="h5">?????????? ????????????????:&nbsp;{el.name}</TitleText>
                                    </Stack>
                                    <Stack direction={{xs: 'column', sm: "row"}} justifyContent="space-start"
                                           sx={{mb: '4px'}}>
                                        <Grid2 xs={12} sm={6}>
                                            <ElectionText>?????????? ???????? ????????????????:&nbsp;{el.persianStartDate}</ElectionText>
                                        </Grid2>
                                        <Grid2 xs={12} sm={6}>
                                            <ElectionText>?????????? ?????????? ????????????????:&nbsp;{el.persianEndDate}</ElectionText>
                                        </Grid2>
                                    </Stack>
                                    <Stack direction={{xs: 'column', sm: "row"}} justifyContent="space-start"
                                           sx={{mb: '4px'}}>
                                        <Grid2 xs={12} sm={6}>
                                            <ElectionText>
                                                ?????????? ???????????? ?????? ????????????????:&nbsp;{el.candidateCount}
                                            </ElectionText>
                                        </Grid2>
                                        <Grid2 xs={12} sm={6}>
                                            <ElectionText>
                                                ?????????? ?????? ???????? ???? ??????????:&nbsp;{el.userVoteCount}
                                            </ElectionText>
                                        </Grid2>
                                    </Stack>
                                    <Stack direction={{sm: 'row'}} justifyContent="space-between" sx={{mb: '4px'}}>
                                        <Grid2 xs={12} sm={6}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Grid2 xs={6}>
                                                    <LinkButton>
                                                        <ManageButton variant="contained"
                                                                      onClick={(e) => handleCandidateManagement(e, el.id)}>
                                                            ???????????? ???????????? ????
                                                        </ManageButton>
                                                    </LinkButton>
                                                </Grid2>
                                                <Grid2 xs={6}>
                                                    <LinkButton>
                                                        <ManageButton variant="contained"
                                                                      onClick={(e) => handleVoterManagement(e, el.id)}>
                                                            ???????????? ?????? ??????????
                                                        </ManageButton>
                                                    </LinkButton>
                                                </Grid2>
                                            </Stack>
                                        </Grid2>
                                    </Stack>
                                </Grid2>
                                <Stack direction="column" justifyContent="space-around">
                                    <ElectionButton onClick={(e) => handleSelectedVote(e, el.id)}>
                                        <DeleteIcon fontSize="medium"/>
                                    </ElectionButton>
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
                                            <Button color="success" onClick={handleCloseDialog}>??????</Button>
                                            <Button color="error" onClick={handleDelete}>??????</Button>
                                        </DialogActions>
                                    </Dialog>
                                    <ElectionButton onClick={(e) => handleEdit(e, el.id)}>
                                        <EditIcon fontSize="medium"/>
                                    </ElectionButton>
                                </Stack>
                            </Stack>
                        </Section>
                    )
                }
            </Grid2>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={openAlert}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
            >
                <Alert severity={alertType} action={close}>{message}</Alert>
            </Snackbar>
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
        </>
    );
};

export default ElectionList;