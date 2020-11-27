import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function TotalAnomalies(props) {
  return (
    <React.Fragment>
      <Title>Number of Anomalies</Title>
      <Typography component="h1" variant="h4">
        {props.data.length}
      </Typography>
      {props.data.map((row)=> (
      <Typography key={row.date} component="p">
          {row.date}
      </Typography>
      ))}
    </React.Fragment>
  );
}
