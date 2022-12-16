import { createTheme } from '@material-ui/core'
import { brown } from '@material-ui/core/colors'

export const theme = createTheme({
  palette: {
    primary: {
      main: brown[500],
      second: brown[400],
    },
    secondary: {
      main: brown[800],
    },
  },
})
