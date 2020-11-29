import React from "react";
import Button from "@material-ui/core/Button";
import { getGoogleHtml } from "./requests";
import GoogleTable from "./GoogleTable";
var moment = require("moment"); // require

export default function News(props) {
  console.log(props.date);

  var searchDate = moment(props.date, "YYYY-MM-DD HH:mm:ss");
  var string_date = searchDate.format("MMMM+DD+YYYY");
  var nice_date = searchDate.format("MMMM DD YYYY");

  const [search_results, updateSearch] = React.useState([]);

  // var search_results = []

  console.log("search date:" + string_date);

  React.useEffect(() => {
    getGoogleHtml("Thousand+Oaks+" + string_date + "+News").then((response) => {
      if (response === "undefined" || response === undefined) {
        updateSearch([])
      } else {
        updateSearch(response.data.items)
      }
    });
  },[string_date]);

  return (
    <React.Fragment>
      <Button>News For {nice_date}</Button>
      <GoogleTable data={search_results} date={props.date} />
    </React.Fragment>
  );
}
