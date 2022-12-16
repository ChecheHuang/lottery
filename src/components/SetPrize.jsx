import React, { useState } from 'react'
import Swal from 'sweetalert2'
import {
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Input,
  InputLabel
} from '@material-ui/core'
import { Delete, EmojiEvents } from '@material-ui/icons'
const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textField: {
    width: '20%',
    backgroundColor: 'white',
  },
  label:{
   position:"relative",
   width:'20%',
   height:'50px',
   backgroundSize:"cover",
   borderRadius:"6px",
   cursor:"pointer",
   display:"flex",
   alignItems:"center",
   justifyContent:"center",
   color:"white",
   fontSize:"20px",
   fontWeight:400,
  },
  img:{
    position:"absolute",
    width:"100%",
    height:"100%",
    objectFit:"cover",
    borderRadius:"6px",
    zIndex:-1,
  },

  gridContainer: {
    margin: 'auto',
    width: '90%',
    minHeight: "45vh",
    border: '2px solid black',
    borderTop: 0,
    padding: '20px 10px 30px 10px',
    borderRadius: 10,
    position: 'relative',
  },
  gridItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 3,
    padding: '10px 0',
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.1)',
  },

  item: {
    display: 'flex',
    justifyContent: 'center',
  },
  itemDiv: {
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  fixBottom: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    bottom: 0,
  },
}))
function SetPrize({ prize, setPrize,activity,setActivity }) {
  const classes = useStyles()
  const [number, setNumber] = useState('')
  const [prizeName, setPrizeName] = useState('')
  const [id, setId] = useState(1)
  const [fileSrc, setFileSrc] = useState("https://images.pexels.com/photos/1303086/pexels-photo-1303086.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
  const handleUploadFile = (e) => {
    if (!e.target.files[0]) return;
    var reader = new FileReader();
    reader.onload = function () {
      setFileSrc(reader.result);
    };
    reader?.readAsDataURL(e?.target?.files[0]);
    e.target.value = "";
  };
  function addPrize() {
    
    var icon, title
    if ( number.length !== 0 && prizeName.length !== 0) {
      const newPrize = [
        { id: id, number: number, prizeName: prizeName,fileSrc:fileSrc },
        ...prize,
      ]
      setId(id + 1)
      setPrize(newPrize)
      setNumber("")
      setPrizeName("")
      setFileSrc("https://images.pexels.com/photos/1303086/pexels-photo-1303086.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      icon = 'success'
      title = '加入成功'
    } else {
      icon = 'error'
      title = '你忘記輸入某個欄位了'
    }
    Swal.fire({
      position: 'top-end',
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 1500,
      confirmButtonColor: '#DD6B55',
    })
  }
  const total = prize.reduce(
    (prev, current) => parseInt(prev) + parseInt(current?.number),
    0
  )
  return (
    <>
      <Container className={classes.container}>
        <Typography gutterBottom variant="h4" component="div">
          設定獎項
        </Typography>
        <TextField
          className={classes.textField}
          variant="standard"
          label="活動名稱"
          value={activity}
          onChange={(e) => {
            setActivity(e.target.value)
          }}
        />
      </Container>
      <Container className={classes.container}>
        <TextField
          className={classes.textField}
          variant="outlined"
          label="獎品"
          value={prizeName}
          onChange={(e) => {
            setPrizeName(e.target.value)
          }}
        />
         <TextField
          className={classes.textField}
          variant="outlined"
          type="number"
          label="個數"
          value={number}
          onChange={(e) => {
            setNumber(() => {
              if (e.target.value > 0) {
                return e.target.value
              } else {
                return ''
              }
            })
          }}
        />
       <InputLabel className={classes.label} htmlFor='upload'><img  className={classes.img} src={fileSrc} alt="" />上傳圖片</InputLabel>
        <Input onChange={handleUploadFile} style={{display:"none"}} id='upload' type='file'/>
      
        <Button
          onClick={addPrize}
          className={classes.button}
          startIcon={<EmojiEvents />}
          color="primary"
          variant="outlined"
        >
          加入獎項
        </Button>
      </Container>
      <Container className={classes.gridContainer}>
        {prize?.map((item) => {
          const { id, number, prizeName,fileSrc } = item
          return (
            <Grid key={id} container className={classes.gridItem}>
              <Grid className={classes.item} item sm={5}>
                <div className={classes.itemDiv}>{prizeName}</div>
              </Grid>
              <Grid className={classes.item} item sm={2}>
               <img style={{maxWidth:"100%",borderRadius:"6px"}} src={fileSrc} alt="" />
              </Grid>
              <Grid className={classes.item} item sm={2}>
                <div>{number}個</div>
              </Grid>
              <Grid className={classes.item} item sm={3}>
                <Button
                  onClick={() => {
                    setPrize(() => {
                      return prize.filter((i) => i.id !== id)
                    })
                  }}
                  variant="outlined"
                  color="primary"
                >
                  <Delete />
                </Button>
              </Grid>
            </Grid>
          )
        })}
        {total > 0 && (
          <Typography className={classes.fixBottom}>共{total}個獎項</Typography>
        )}
      </Container>
    </>
  )
}
export default SetPrize
