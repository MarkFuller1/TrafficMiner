import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

var moment = require("moment"); // require

export default function TotalAnomalies(props) {
  const formatAxis = (tickItem) => {
    // console.log("before:" + tickItem)
    tickItem = moment(tickItem, "YYYY-MM-DD HH:mm:ss").toDate();
    // console.log("after:" + tickItem)

    var date = "";
    if (tickItem instanceof Date) {
      date =
        tickItem.getMonth() +
        "/" +
        tickItem.getDay() +
        "/" +
        tickItem.getFullYear() +
        " " +
        tickItem.getHours() +
        ":" +
        tickItem.getMinutes();
    }

    console.log(date);

    return date;
  };

  const handleDateSelect = (event, date) => {
    console.log("Selected date: " + date)

    props.updateNews(date)
  }

  return (
    <React.Fragment>
      <Title>Number of Anomalies</Title>
      <Typography component="h1" variant="h4">
        {props.data.length}
      </Typography>
      <Grid container spaing={2}>
        {props.data.map((date, index) => (
          <Grid item xs={3}>
            <Button
              value={moment(
                props.data[index].date,
                "YYYY-MM-DD HH:mm:ss"
              ).toDate()}
              key={index}
              onClick={(event) => {
                console.log(props.data[index].date)
                handleDateSelect(event, moment(props.data[index].date, 'YYYY-MM-DD HH:mm:ss'));
              }}
            >
              {date.date}
            </Button>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
