import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { LineChart, Line, XAxis, YAxis, Label, ReferenceArea } from "recharts";

var moment = require("moment"); // require

export default function Chart(props) {
  const theme = useTheme();

  const formatAxis = (tickItem) => {
    tickItem = new Date(tickItem)

    var date = "";
    if (tickItem instanceof Date) {
      date = 
        tickItem.getMonth() +
        "/" +
        tickItem.getDay() +
        "/" +
        tickItem.getFullYear() +
        " " +
        tickItem.getHours()+
        ":" +
        tickItem.getMinutes()
    }


    return date;
  };

  const parseData = () => {
    // in the props is the name of the field, figure out the index
    var field_names = Object.keys(props.fields);
    var selected_index = 0;

    for (let i = 0; i < field_names.length; i++) {
      if (field_names[i] === props.comboSelection) {
        selected_index = i;
        break;
      }
    }

    // convert props.startDay and props.endDay to indices
    var startIndex = 0;
    var endIndex = props.data.length - 1;
    var sliced_days = [];

     //console.log("Chart - start: " + props.startDay);
     //console.log("Chart - end: " + props.endDay);

    for (var i = 0; i < props.data.length; i++) {
      var current_day = new Date(props.data[i].timestamp);

      if (current_day === props.startDay) {
        startIndex = i;
      }

      if (current_day === props.endDay) {
        endIndex = i;
      }

      if (current_day >= props.startDay && current_day <= props.endDay) {
        sliced_days.push({
          date: moment(current_day, 'YYYY-MM-DD HH:mm:ss').format("MMMM/DD/YYYY HH:mm"),
          value: Number(Object.values(props.data[i])[selected_index]),
        });
      }

      sliced_days.sort((a, b) => {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        } else return 0;
      });
    }

     //console.log("Finished slicing the data:");
     //console.log(sliced_days);
    return sliced_days;
  };

  const indexedData = parseData();


  return (
    <React.Fragment>
      <LineChart
        data={indexedData}
        width={1230}
        height={400}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 100,
        }}
      >
        <XAxis
          dataKey="date"
          angle={-20}
          height={20}
          textAnchor="end"
          stroke={theme.palette.text.secondary}
        />
        <YAxis stroke={theme.palette.text.secondary}>
          <Label
            angle={270}
            position="left"
            style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
          ></Label>
        </YAxis>
        <Line dataKey="value" stroke={theme.palette.primary.main} dot={false} />
        {props.anomalies.map((anom, value) => (
          <ReferenceArea
            key={anom.date}
            x1={anom.date}
            x2={anom.date}
            stroke="red"
            strokeOpacity={0.0}
          />
        ))}
      </LineChart>
    </React.Fragment>
  );
}
