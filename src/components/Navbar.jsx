import React from 'react'
import logo from '../images/logo.png'
import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core'
const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 60,
    width: 60,
  },
}))
function Navbar() {
  const classes = useStyles()
  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <img className={classes.img} src={logo} alt="" />
        <Typography variant="h3" component="div">
          抽獎
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
export default Navbar
