import React from 'react'
import { Grid, Paper } from '@material-ui/core'

export default function GoogleTable(props) {

    const section = {
        height: "100%",
        width: "100%",
        paddingTop: 5,
      };

    return(
        <React.Fragment>
            <Grid container spacing={1} justify='center' direction='column' alignItems='center'>
               {props.data.map((entry, index) => (
                   <Grid item xs style={section} key={index}>
                       <Paper>
                          <a href={entry.link}>
                              {entry.title}
                              </a> 
                              <br/>
                              {entry.snippet}
                       </Paper>
                   </Grid>
               ))} 
            </Grid>
        </React.Fragment>
    )
}