import axios from "axios";

var constants = require("./constants");

export const request_headers = {
  "Access-Control-Allow-Origin": "*",'Content-Type': 'application/json'
};

export async function getGoogleHtml(search_str) {
  return await axios
    .get(constants.google_url + search_str) //, {headers: request_headers})
    .then((response) => {
      console.log("search string" + search_str)
      return response;
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function getCSV(callback) {
  return axios
    .get("https://localhost:5002/data/", {
      headers: request_headers,
      onDownloadProgress: (progressEvent) => {
        //progressEvent.srcElement.
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
         //console.log("progress event:", progressEvent);
        callback(percentCompleted);
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function getAnomalies(index, threshold) {
  return axios
    .get(
      "http://localhost:5000/anomalies/" +
        String(index + 1) +
        "/" +
        String(threshold),
      { headers: request_headers }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
       //console.log(error);
    });
}
