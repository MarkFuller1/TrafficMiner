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
import Slider from "@material-ui/core/Slider";

const num_regex_float = RegExp("^[0-9]*(.)?[0-9]*$");
const minDate = new Date("August 13, 2019");

const one_day_in_millis = 86400000;

//console.log(minDate);
//console.log(new Date(minDate.getTime() + one_day_in_millis));

export default function Dashboard() {
  const [data, updateData] = React.useState([]);
  const [percentDown, updatePercentDown] = React.useState(0);
  const [loading, updateLoading] = React.useState(true);
  const [titles, updateTitles] = React.useState([]);

  const [comboSelection, updateComboSelection] = React.useState("total_volume");
  const [startDay, updateStartDay] = React.useState(minDate);
  const [endDay, updateEndDay] = React.useState(
    new Date(minDate.getTime() + one_day_in_millis)
  );
  const [threshold, updateThreshold] = React.useState(0.25);
  const [suggestedThresh, updateSuggestedThresh] = React.useState(1);
  // field to display
  const [index, updateIndex] = React.useState(0);

  const [anomalies, updateAnomalies] = React.useState([]);

  const [selectedDate, updateSelectedDate] = React.useState(minDate);

  const handleSliderChangeThreshold = (event) => {
    var value = Number(event.target.innerText);
    console.log(value);
    if (num_regex_float.test(value)) {
      //console.log(value);

      Requests.getAnomalies(index, value).then((response) => {
        //console.log(response.data.length);
        updateAnomalies(response.data);
        updateThreshold(value);
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
    //console.log("getting CSV");
    updateLoading(true);
    Requests.getCSV(updatePercentDown)
      .then((results) => {
        //console.log("got CSV");
        //console.log(results.data[0]);
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
      updateLoading(true);
      //console.log(response.data);
      if (response.data.length !== 0) {
        var suggestedThresh = String(
          Math.round(response.data[0].threshold / 0.05) * 0.05
        );
        updateSuggestedThresh(String(Number(suggestedThresh).toFixed(2)));
      }
      updateAnomalies(response.data);
      updateLoading(false);
    });
  }, [index, threshold]);

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
        endDay={endDay}
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
          <Grid container spacing={10}>
            {/* Chart */}
            <Grid item lg={12}>
              <Paper>
                {conditionalComponent}
                <div style={{ height: "2vh" }} />
                <Grid
                  container
                  spacing={2}
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
                        //  //console.log(
                        //   event.target.textContent,
                        //   Object.keys(titles).findIndex(
                        //     (obj) => obj === event.target.textContent
                        //   )
                        // );
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
                      selected={startDay}
                      onChange={handleChangeStartDay}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="h2">End day</Typography>
                    <DatePicker
                      minDate={new Date("August 13, 2019")}
                      maxDate={new Date("August 1, 2020")}
                      selected={endDay}
                      onChange={handleChangeEndDay}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography component="h2">
                      Anomaly Treshold: ({suggestedThresh})
                    </Typography>
                    <Slider
                      marks
                      valueLabelDisplay="auto"
                      defaultValue={0.25}
                      step={0.05}
                      min={0}
                      max={1.0}
                      onChangeCommitted={(event, value) => {
                        updateLoading(true);
                        handleSliderChangeThreshold(event, value);
                        updateLoading(false);
                      }}
                    ></Slider>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* Total Anomalies */}
            <Grid item>
              <Paper>
                {/* { console.log("there are :" + anomalies.length + " anomalies")} */}
                <TotalAnomalies
                  data={anomalies}
                  updateNews={updateSelectedDate}
                  field_num={index}
                  field={Object.keys(titles).splice(1)[index]}
                />
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));
