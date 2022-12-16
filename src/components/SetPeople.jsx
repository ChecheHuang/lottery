import React, { useState } from 'react'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import {
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import { AccessibilityNew, Delete } from '@material-ui/icons'
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

  gridContainer: {
    margin: 'auto',
    width: '90%',
    height: "45vh",
    border: '2px solid black',
    borderTop: 0,
    padding: '20px 10px 30px 10px',
    borderRadius: 10,
    position: 'relative',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '0',
    },
  },
  gridItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 3,
    padding: '10px 0',
    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
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
    position: 'sticky',
    width: '100%',
    textAlign: 'center',
    bottom: -30,
  },
}))
function SetPeople({ people, setPeople }) {
  const classes = useStyles()
  const [uid, setUid] = useState('')
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState('')
  function addPerson() {
    var icon, title

    if (people.some((i) => i.uid === uid)) {
      icon = 'error'
      title = '編號重複'
    } else if (
      uid.length === 0 ||
      name.length === 0 ||
      frequency.length === 0
    ) {
      icon = 'error'
      title = '你忘記輸入某個欄位了'
    } else {
      icon = 'success'
      title = '成功加入'
      const newPeople = [
        { uid: uid, name: name, frequency: frequency },
        ...people,
      ]
      setPeople(newPeople)
      setUid("")
      setName("")
      setFrequency("")
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
  const total = people.reduce(
    (prev, current) => parseInt(prev) + parseInt(current?.frequency),
    0
  )
  function readExcel(file) {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (e) => {
        const bufferArray = e.target.result

        const wb = XLSX.read(bufferArray, { type: 'buffer' })

        const wsName = wb.SheetNames[0]

        const ws = wb.Sheets[wsName]

        const data = XLSX.utils.sheet_to_json(ws)
        resolve(data)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
    Swal.fire({
      title: '確認您的檔案為有名字,編號,次數 三個欄位',
      confirmButtonColor: 'brown',
      showCancelButton: true,
      confirmButtonText: '確認',
    }).then((result) => {
      if (result.isConfirmed) {
        promise.then((d) => {
          if (
            d[0]['名字'] === undefined ||
            d[0]['編號'] === undefined ||
            d[0]['次數'] === undefined
          ) {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: '匯入失敗，確認欄位有編號,名字,次數 三個欄位',
              showConfirmButton: false,
              timer: 1500,
            })
          } else {
            const map={}
            let newPeople=[]
            for(let i of people){
              map[i['uid']]=i
            }
            for(let i of d){
              if(map[i['編號']]===undefined){
                map[i['編號']]=i
                const newItem={}
                newItem.uid=i['編號'].toString()
                newItem.name=i['名字']
                newItem.frequency=i['次數']
                newItem.prize=i['獎品']
                newPeople=[...newPeople,newItem]
              }else{
                Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: '編號已重複',
                  showConfirmButton: false,
                  timer: 1500,
                })
                return
              }
            }
            setPeople([...newPeople, ...people])
            Swal.fire({
              title: '成功匯入',
              icon: 'success',
              confirmButtonColor: '#DD6B55',
            })
          }
        })
      }
    })
  }

  return (
    <>
      <Container className={classes.container}>
        <Typography gutterBottom variant="h4">
          加入抽獎名單
        </Typography>
        <Button color="secondary" variant="contained" component="label">
          匯入excel
          <input
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files[0]

              readExcel(file)
            }}
          />
        </Button>
      </Container>
      <Container className={classes.container}>
        <TextField
          className={classes.textField}
          variant="outlined"
          label="編號"
          value={uid}
          onChange={(e) => {
            setUid(e.target.value)
          }}
        />
        <TextField
          className={classes.textField}
          variant="outlined"
          label="名字"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <TextField
          className={classes.textField}
          variant="outlined"
          label="次數"
          type="number"
          value={frequency}
          onChange={(e) => {
            setFrequency(() => {
              if (e.target.value > 0) {
                return e.target.value
              } else {
                return ''
              }
            })
          }}
        />
        <Button
          onClick={addPerson}
          className={classes.button}
          startIcon={<AccessibilityNew />}
          color="secondary"
          variant="outlined"
        >
          加入抽獎
        </Button>
      </Container>
      <Container className={classes.gridContainer}>
        {people?.map((item) => {
          const { uid, name, frequency } = item
          return (
            <Grid key={uid} container className={classes.gridItem}>
              <Grid className={classes.item} item sm={3}>
                <div className={classes.itemDiv}>{uid}</div>
              </Grid>
              <Grid className={classes.item} item sm={3}>
                <div>{name}</div>
              </Grid>
              <Grid className={classes.item} item sm={3}>
                <div className={classes.itemDiv}>{frequency}</div>
              </Grid>
              <Grid className={classes.item} item sm={3}>
                <Button
                  onClick={() => {
                    setPeople(() => {
                      return people.filter((i) => i.uid !== uid)
                    })
                  }}
                  variant="outlined"
                  color="secondary"
                >
                  <Delete />
                </Button>
              </Grid>
            </Grid>
          )
        })}
        {total > 0 && (
          <Typography
            style={{ background: 'white', width: '100%' }}
            className={classes.fixBottom}
          >
            共{people.length}人，抽獎基數為{total}
          </Typography>
        )}
      </Container>
    </>
  )
}
export default SetPeople
