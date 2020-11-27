import axios from 'axios'

//let google_url = "https://www.google.com/search?q="
let google_search_engine_id = "8c26035842cd4cac3";
let google_api_key = "AIzaSyCa0JDFWoGDYzEy0NtGVbIxQAuBaQHXhL8";
export const google_url =
  "https://www.googleapis.com/customsearch/v1?key=" +
  google_api_key +
  "&cx=" +
  google_search_engine_id +
  "&q=";

