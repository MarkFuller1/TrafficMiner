import React from "react";
import Button from "@material-ui/core/Button";
import { getGoogleHtml } from "./requests";
import GoogleTable from "./GoogleTable";
var moment = require("moment"); // require

export default function News(props) {
  var errors = undefined;

  //console.log("the date is" + props.date);
  var searchDate = moment(props.date, "gggg-MM-DD HH:mm:ss");
  //console.log("news date:" + searchDate);

  var string_date = searchDate.format("MMMM+DD+gggg");

  var nice_date = searchDate.format("MMMM DD gggg");

  //console.log("Search date:" + string_date);
  //console.log("nice date:" + nice_date);

  const [search_results, updateSearch] = React.useState([]);

  React.useEffect(() => {
    getGoogleHtml("Thousand+Oaks+" + string_date + "+News").then((response) => {
      if (response === "undefined" || response === undefined) {
        updateSearch([]);
      } else {
        updateSearch(response.data.items);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Button>News For {nice_date}</Button>
      <GoogleTable error={errors} data={search_results} />
    </React.Fragment>
  );
}
