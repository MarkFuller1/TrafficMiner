import React from "react";
import Button from "@material-ui/core/Button";
import { getGoogleHtml } from "./requests";
import GoogleTable from "./GoogleTable";

export default function News(props) {
  const [selected, changeSelected] = React.useState(
    "March+14+2019"
  );
  const [search_results, updateSearch] = React.useState([]);

  React.useEffect(() => {
    getGoogleHtml("Thousand+Oaks+" + selected + "+News").then((response) => {
      updateSearch(response.data.items);
    });
  }, []);

  const handleSearch = async () => {
    var response = await getGoogleHtml(selected);
    if (response !== undefined && response !== "undefined") {
      console.log(response.data.items);

      updateSearch(response.data.items);
    } else {
      updateSearch("<div>There was an error</div>");
    }
  };

  return (
    <React.Fragment>
      <Button
        onClick={() => {
          handleSearch();
        }}
      >
        News For {selected}
      </Button>
      <GoogleTable data={search_results} />
    </React.Fragment>
  );
}
