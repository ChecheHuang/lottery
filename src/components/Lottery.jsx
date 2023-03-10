import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import Swal from 'sweetalert2'
import show from "../images/show.png"
import lottery1 from "../lottery1.json";
import {
    Badge,
    Button,
    Container,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
    container: {
        width: "90%",
        minHeight: "70vh",
        background: theme.palette.primary.second,
        padding: theme.spacing(2),
        position: "relative",
        borderRadius: 10,
    },
    typography: {
        marginTop: 20,
        width: "100%",
        textAlign: "center",
    },
    badgeGroup: {
        minHeight: 50,
    },
    badge: {
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    gridItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    itemTitle: {
        fontSize: 30,
        marginBottom: theme.spacing(2),
    },
    paper: {
        width: "100%",
        height: 200,
        background: "white",
        marginTop: theme.spacing(2),
        fontSize: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "default"
    },
    cheatPaper: {
        width: "100%",
        height: 200,
        background: "white",
        marginTop: theme.spacing(2),
        fontSize: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
    },
    image: {
        height: 180
    },
    imgContainer:{
        width:100,
        height:100,
    },
    img:{
        width:"100%",
        height:"100%",
        objectFit:"cover"
    },
    startButton: {
        position: "absolute",
        bottom: 0,
        right: "50%",
        transform: "translate(50%,50%)",
    },
}));
function Lottery({
    prize,
    setPrize,
    peopleData,
    setPeopleData,
    setWinnerList,
    activity,
}) {
    const [status, setStatus] = useState(false)
    //loading???true?????????
    const [loading, setLoading] = useState(false);
    //??????button??????????????????index?????????????????????button???showLottery
    const [open, setOpen] = useState(0);
    //??????????????????
    const [winner, setWinner] = useState({})
    //?????????????????????????????????????????????
    const [showLottery, setShowLottery] = useState({
        number: 0,
        prizeName: "",
    });
    //?????????????????????open??????????????????????????????????????????button???
    useEffect(() => {
        setShowLottery(prize[open]);
    }, [open, prize]);
    //????????????
    function lottieStart() {
        if (prize[open].number === 0) {
            Swal.fire({
                position: 'top-end',
                icon: "info",
                title: "????????????????????????",
                showConfirmButton: false,
                timer: 1500,
                confirmButtonColor: '#DD6B55',
            })
        } else if (peopleData.length === 0) {
            Swal.fire({
                position: 'top-end',
                icon: "info",
                title: "?????????????????????",
                showConfirmButton: false,
                timer: 1500,
                confirmButtonColor: '#DD6B55',
            })
        } else {
            setLoading(true)
        }
    }
    //??????min???max???????????????
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    function createWinner(length) {
        let winner = peopleData[getRandom(0, length - 1)]
        if (peopleData.some((item) => { return item.prize === undefined })) {
            if (winner.prize !== undefined) {
                winner = createWinner(length)
            }
        }
        return winner
    }
    function lottieStop() {
        if (prize[open].number > 0 && peopleData.length > 0) {
            let newPrize = [...prize];
            if (newPrize[open].number > 0) {
                newPrize[open].number--;
                setPrize(newPrize)
                const length = peopleData.length
                //?????????
                let winner = createWinner(length)

                //???????????????????????????????????????????????????winner
                if (status) {
                    const mustWinner = peopleData.find((item) => {
                        return item?.prize === newPrize[open].prizeName
                    })
                    if (mustWinner) {
                        winner = mustWinner
                    }
                }
                //???????????????????????????
                const newPeopleData = peopleData?.filter((item, index) => {
                    return item.uid !== winner.uid
                })
                setPeopleData(newPeopleData)
                //????????????????????????
                const winnerAdd = { ...winner, prizeName: newPrize[open].prizeName,fileSrc:newPrize[open].fileSrc }
                setWinner(winnerAdd)
                //?????????????????????
                setWinnerList((prev) => {
                    return [winnerAdd, ...prev]
                })
            }
            setLoading(false)
        }
    }
    const classes = useStyles();
    return (
        <>
            <Typography className={classes.typography} gutterBottom variant="h4">
                {activity} ?????????
            </Typography>
            <div></div>
            <Container className={classes.container}>
                <Container className={classes.badgeGroup}>
                    {prize?.map((item, index) => {
                        const { number, prizeName } = item;
                        return (
                            <Badge
                                className={classes.badge}
                                key={index}
                                overlap="rectangular"
                                badgeContent={number}
                                color="secondary"
                                onClick={() => {
                                    setOpen(index);
                                }}
                            >
                                <Button
                                    disabled={number > 0 ? false : true}
                                    variant="contained"
                                    color={open !== index ? "primary" : "secondary"}
                                    size="large"
                                >
                                    {prizeName}
                                </Button>
                            </Badge>
                        );
                    })}
                    <Grid container>
                        <Grid className={classes.gridItem} item sm={6}>
                            <div className={classes.itemTitle}>??????</div>
                            <div>{showLottery.prizeName}</div>
                        </Grid>
                        <Grid className={classes.gridItem} item sm={6}>
                            <div className={classes.itemTitle}>????????????</div>
                            <div>{showLottery.number}</div>
                        </Grid>
                    </Grid>
                    {loading ? (
                        <div
                            onClick={lottieStop}
                        >
                            <Lottie
                                style={{ marginTop: "0" }}
                                options={{
                                    loop: true,
                                    autoplay: true,
                                    animationData: lottery1,
                                    rendererSettings: {
                                        preserveAspectRatio: "xMidYMid slice",
                                    },
                                }}
                                height={230}
                                width={400}
                            />
                        </div>
                    ) : (
                        <>
                            <Paper onClick={() => { setStatus(!status) }} className={status ? classes.cheatPaper : classes.paper} elevation={1}>
                                {
                                    JSON.stringify(winner) !== '{}' ?
                                        <>
                                            <div>?????? ??????{winner.uid} {winner.name}</div>
                                            
                                            <div>??????{winner.prizeName}</div>
                                            <div className={classes.imgContainer}><img className={classes.img} src={winner.fileSrc} alt="" /></div>
                                        </>
                                        :
                                        <div>
                                            <img className={classes.image} src={show} alt="" />
                                        </div>
                                }
                            </Paper>
                        </>
                    )}
                </Container>
                <Button
                    className={classes.startButton}
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={lottieStart}
                >
                    ????????????
                </Button>
            </Container>
        </>
    );
}
export default Lottery;
