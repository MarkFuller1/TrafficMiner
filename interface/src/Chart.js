import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { LineChart, Line, XAxis, YAxis, Label, ReferenceArea } from "recharts";

export default function Chart(props) {
  const theme = useTheme();

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

    for (var i = 0; i < props.data.length; i++){
      if(new Date(props.data[i][0]) === props.startDay){
          startIndex = i;
      }

      if(new Date(props.data[i][0] === props.endDay)){
        endIndex = i;
      }
    }



    let range = props.data.slice(
      startIndex, endIndex
    );

    return range;
  };

  const indexedData = parseData();

  const formatAxis = (tickItem) => {
    return tickItem;
  };

  return (
    <React.Fragment>
      <LineChart
        data={indexedData}
        width={1230}
        height={600}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="date"
          angle={-90}
          height={120}
          textAnchor="end"
          tickFormatter={formatAxis}
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
