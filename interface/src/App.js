import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chart from "./Chart";
import TotalAnomalies from "./TotalAnomalies";
import * as Requests from "./requests";
import News from "./News";
import LinearProgress from "@material-ui/core/LinearProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Slider from '@material-ui/core/Slider'

const num_regex_float = RegExp("^[0-9]*(.)?[0-9]*$");
const num_regex_int = RegExp("^[0-9]*$");
const minDate = new Date("August 13, 2019");
const maxDate = new Date("August 1, 2020");

const useStyles = makeStyles((theme) => ({}));

export default function Dashboard() {
  const [data, updateData] = React.useState([]);
  const [percentDown, updatePercentDown] = React.useState(0);
  const [loading, updateLoading] = React.useState(true);
  const [titles, updateTitles] = React.useState([]);

  const [comboSelection, updateComboSelection] = React.useState("total_volume");
  const [startDay, updateStartDay] = React.useState(minDate);
  const [endDay, updateEndDay] = React.useState(minDate.getDate() + 1);
  const [threshold, updateThreshold] = React.useState(0.25);
  // field to display
  const [index, updateIndex] = React.useState(0);

  const [anomalies, updateAnomalies] = React.useState([]);

  const [selectedDate, updateSelectedDate] = React.useState("January+1+2019");

  const handleSliderChangeThreshold = (event, value) => {
    //var value = event.target.value;
    if (num_regex_float.test(value)) {
      console.log(value);
      updateThreshold(value);

      Requests.getAnomalies(index, threshold).then((response) => {
        console.log(response.data.length);

        updateAnomalies(response.data);
      });
    }
  };

  const handleChangeStartDay = (date) => {
    updateStartDay(date);
  };

  const handleChangeEndDay = (date) => {
    updateEndDay(date);
  };

  React.useEffect(() => {
    console.log("getting CSV");
    Requests.getCSV(updatePercentDown)
      .then((results) => {
        console.log("got CSV");
        console.log(results.data[0]);
        updateTitles(results.data[0]);
        updateData(results.data.slice(1));
        updateLoading(false);
      })
      .catch((error) => {
        updateData([]);
        updateLoading(false);
      });
  }, []);

  React.useEffect(() => {
    Requests.getAnomalies(index, threshold).then((response) => {
      console.log(response.data);
      updateAnomalies(response.data);
    });
  }, []);

  const classes = useStyles();
  const open = false;

  let conditionalComponent;

  if (!loading) {
    conditionalComponent = (
      <Chart
        isLoading={loading}
        percentLoaded={percentDown}
        data={data}
        fields={titles}
        comboSelection={comboSelection}
        startDay={startDay}
        endDay={endtay}
        anomalies={anomalies}
      />
    );
  } else {
    conditionalComponent = <LinearProgress />;
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Traffic Data Analysis
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={5}>
            {/* Chart */}
            <Grid item lg={12}>
              <Paper>
                {conditionalComponent}
                <Grid
                  container
                  spacing={5}
                  direction="column"
                  alignItems="center"
                  justify="space-evenly"
                >
                  <Grid item xs={12}>
                    <Autocomplete
                      id="Select Field"
                      defaultValue={"total_volume"}
                      options={Object.keys(titles).splice(1)}
                      getOptionLabel={(option) => option}
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Field"
                          variant="outlined"
                        />
                      )}
                      onChange={(event) => {
                        updateComboSelection(event.target.textContent);
                        console.log(
                          event.target.textContent,
                          Object.keys(titles).findIndex(
                            (obj) => obj === event.target.textContent
                          )
                        );
                        updateIndex(
                          Object.keys(titles).findIndex(
                            (obj) => obj === event.target.textContent
                          ) - 1
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="h2">Start day</Typography>
                    {/* <Typography>Day of data to start on</Typography> */}
                    <DatePicker
                      minDate={new Date("August 13, 2019")}
                      maxDate={new Date("August 1, 2020")}
                      selected={new Date()}
                      onChange={handleChangeStartDay}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="h2">End day</Typography>
                    <DatePicker
                      minDate={new Date("August 13, 2019")}
                      maxDate={new Date("August 1, 2020")}
                      selected={new Date()}
                      onChange={handleChangeEndDay}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <Typography>Anomaly Treshold</Typography> */}
                    <Slider
                      defaultValue={0.25}
                      step={0.25}
                      min={0}
                      max={1.0}
                      onChangeCommitted={handleSliderChangeThreshold}
                    ></Slider>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* Total Anomalies */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper>
                {console.log("there are :" + anomalies.length + " anomalies")}
                <TotalAnomalies data={anomalies} />
              </Paper>
            </Grid>
          </Grid>
          {/* News From google */}
          <Grid item xs={12}>
            <Paper>
              <News date={selectedDate} />
            </Paper>
          </Grid>
          <Box pt={4}>{/* <Table data={data}/> */}</Box>
        </Container>
      </main>
    </div>
  );
}
