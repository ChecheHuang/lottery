import React from "react";
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import * as XLSX from 'xlsx'


const useStyles = makeStyles((theme) => ({
  container: {
    width: "90%",
    height: "70vh",
    background: theme.palette.primary.second,
    padding: theme.spacing(2),
    position: "relative",
    borderRadius: 10,
    color: "white",
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '0',
    },
  },
  top: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
  },
  typography: {
    width: "100%",
    textAlign: "center",
    justifyContent: "space-around"
  },
  paper: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "space-between"
  },
  imgContainer:{
    width:60,
    height:60,
    borderRadius:"6px",
    marginRight:20,
  },
  img:{
    width:"100%",
    height:"100%",
    objectFit:"cover"
  },


}));
function WinnerList({ winnerList }) {
  const classes = useStyles();
  function handleOnExport() {
    winnerList=winnerList.map((item)=>{
      const newItem={}
      newItem['編號']=item.uid
      newItem['名字']=item.name
      newItem['獎品']=item.prizeName
      return newItem
    })
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(winnerList)
    XLSX.utils.book_append_sheet(wb, ws, "中獎名單")
    XLSX.writeFile(wb, "中獎名單.xlsx")
  }
  return (
    <>
      <Container className={classes.top}>
        <Typography className={classes.typography} gutterBottom variant="h4">
          中獎區
        </Typography>
        <Button onClick={handleOnExport} color="primary" variant="contained" >匯出</Button>
      </Container>
      <Container className={classes.container}>
        <Paper className={classes.paper}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {winnerList.map((item) => {
              return <ListItem key={item.uid}>
                <ListItemAvatar>
                   <div className={classes.imgContainer}>
                   <img className={classes.img} src={item.fileSrc} alt="" />
                   </div>
                </ListItemAvatar>
                <ListItemText primary={item.prizeName} secondary={item.uid + "  " + item.name} />
              </ListItem>
            })}



          </List>
        </Paper>
      </Container>


    </>
  );
}
export default WinnerList;
