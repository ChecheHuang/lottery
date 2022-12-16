import React, { useState } from 'react'
import Navbar from './components/Navbar'
import SetPrize from './components/SetPrize'
import SetPeople from './components/SetPeople'
import Lottery from './components/Lottery'
import WinnerList from './components/WinnerList'
import { Button, Grid } from '@material-ui/core'
import { PanToolTwoTone } from '@material-ui/icons'
import Swal from 'sweetalert2'

function App() {
  const [activity, setActivity] = useState('')
  const [prize, setPrize] = useState([])
  const [people, setPeople] = useState([])
  const [openLottery, setOpenLottery] = useState(false)
  const [peopleData, setPeopleData] = useState([])
  const [winnerList, setWinnerList] = useState([])

  
  function showLottery() {
    if(prize.length===0||people.length===0){
      Swal.fire({title:"請設定獎品及抽獎名單",confirmButtonColor: 'brown'})
    }else{
    var peopleData = []
    for (let person of people) {
      for (let i = 0; i < person.frequency; i++) {
        const personFrequency =person.prize? { uid: person.uid, name: person.name,prize:person.prize }:{ uid: person.uid, name: person.name }
        peopleData.push(personFrequency)
      }
    }
    setPeopleData(peopleData)
    setOpenLottery(true)
    }
  }
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',height:"100vh" }}
    >
      <Navbar />
      {openLottery ? (
        <Grid container>
          <Grid item sm={8}>
            <Lottery
              prize={prize}
              setPrize={setPrize}
              peopleData={peopleData}
              setPeopleData={setPeopleData}
              winnerList={winnerList}
              setWinnerList={setWinnerList}
              activity={activity}
            />
          </Grid>
          <Grid item sm={4}>
            <WinnerList winnerList={winnerList} />
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid container>
            <Grid item sm={6}>
              <SetPrize prize={prize} setPrize={setPrize} activity={activity} setActivity={setActivity} />
            </Grid>
            <Grid item sm={6}>
              <SetPeople people={people} setPeople={setPeople} />
            </Grid>
          </Grid>
          <Button
            onClick={showLottery}
            style={{ marginTop: '30px' }}
            startIcon={<PanToolTwoTone />}
            color="primary"
            variant="contained"
            size="large"
          >
            進入抽獎
          </Button>
        </>
      )}
    </div>
  )
}
export default App
