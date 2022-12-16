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
    //loading為true為抽獎
    const [loading, setLoading] = useState(false);
    //按下button顯示該獎項的index，用來判斷哪個button跟showLottery
    const [open, setOpen] = useState(0);
    //中獎顯示資訊
    const [winner, setWinner] = useState({})
    //顯示在頁面上給使用者該獎項資訊
    const [showLottery, setShowLottery] = useState({
        number: 0,
        prizeName: "",
    });
    //按按鈕時會改變open，導致改變顯示出的資訊是這個button的
    useEffect(() => {
        setShowLottery(prize[open]);
    }, [open, prize]);
    //轉圈圈囉
    function lottieStart() {
        if (prize[open].number === 0) {
            Swal.fire({
                position: 'top-end',
                icon: "info",
                title: "該獎項已經抽完了",
                showConfirmButton: false,
                timer: 1500,
                confirmButtonColor: '#DD6B55',
            })
        } else if (peopleData.length === 0) {
            Swal.fire({
                position: 'top-end',
                icon: "info",
                title: "抽獎名單已清空",
                showConfirmButton: false,
                timer: 1500,
                confirmButtonColor: '#DD6B55',
            })
        } else {
            setLoading(true)
        }
    }
    //產生min到max之間的亂數
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //隨機抓一個人，如果還有內定的人，去判斷這隨機抓的人是否內定，如果是內定的則重抓，但如果陣列中沒有不是內定的人，就不重抓
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
                //取隨機
                let winner = createWinner(length)

                //如果有必中名單且模式為內定模式蓋掉winner
                if (status) {
                    const mustWinner = peopleData.find((item) => {
                        return item?.prize === newPrize[open].prizeName
                    })
                    if (mustWinner) {
                        winner = mustWinner
                    }
                }
                //抽獎陣列刪掉中獎人
                const newPeopleData = peopleData?.filter((item, index) => {
                    return item.uid !== winner.uid
                })
                setPeopleData(newPeopleData)
                //顯示當前中獎資訊
                const winnerAdd = { ...winner, prizeName: newPrize[open].prizeName,fileSrc:newPrize[open].fileSrc }
                setWinner(winnerAdd)
                //加到中獎列表中
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
                {activity} 抽獎區
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
                            <div className={classes.itemTitle}>獎品</div>
                            <div>{showLottery.prizeName}</div>
                        </Grid>
                        <Grid className={classes.gridItem} item sm={6}>
                            <div className={classes.itemTitle}>剩餘數量</div>
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
                                            <div>恭喜 編號{winner.uid} {winner.name}</div>
                                            
                                            <div>獲得{winner.prizeName}</div>
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
                    開始抽獎
                </Button>
            </Container>
        </>
    );
}
export default Lottery;
