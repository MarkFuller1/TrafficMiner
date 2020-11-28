import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";

export default function GoogleTable(props) {
  const section = {
    height: "100%",
    width: "100%",
    paddingTop: 5,
  };

  let news;

  if (props.data.length !== 0) {
    console.log("good news: ");
    console.log(props.data)
    news = props.data.map((entry, index) => (
      <Grid item xs style={section} key={index}>
        <Paper>
          <a href={entry.link}>{entry.title}</a>
          <br />
          {entry.snippet}
        </Paper>
      </Grid>
    ));
  } else {
    console.log("no news");
    news = (
      <div>
        <Typography component="h1"> There was an error!</Typography>
        <Typography component="h3">
          {"You have exhausted your google API Custom search engine: " + new Date(props.date)}
        </Typography>
        )
      </div>
    );
  }

  return (
    <React.Fragment>
      <Grid
        container
        spacing={1}
        justify="center"
        direction="column"
        alignItems="center"
      ></Grid>
      {news}
    </React.Fragment>
  );
}
