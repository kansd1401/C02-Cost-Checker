const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

const EIA_API_KEY = process.env.API_KEY;
const EIA_URL = "http://api.eia.gov";

app.get("/states", (req, res) => {
  axios
    .get(`${EIA_URL}/category/?api_key=${EIA_API_KEY}&category_id=2251609`)
    .then((category_response) => {
      const states = category_response.data.category.childseries.map(
        (state) => {
          return {
            series_id: state.series_id,
            name: state.name.split(", ")[2],
          };
        }
      );
      res.json(states);
    });
});

app.get("/states/emissions", (req, res) => {
  const { series_ids, from, to } = req.query;
  console.log();
  axios
    .get(
      `${EIA_URL}/series/?api_key=${EIA_API_KEY}&series_id=${series_ids}&start=${from}&end=${to}`
    )
    .then((response) => {
      console.log("Status Code:", response.status);
      if (response.status === 500) throw error;
      const emissions = response.data.series.map((state) => {
        return {
          series_id: state.series_id,
          name: state.name.split(", ")[2],
          value: state.data.map((arr) => arr[1]).reduce((a, b) => a + b, 0),
          from,
          to,
        };
      });
      res.json(emissions);
    })
    .catch((err) => {
      res.status(500).send("Something broke!");
    });
});

app.listen(5000, () => [console.log("Server started on posst 5000")]);
