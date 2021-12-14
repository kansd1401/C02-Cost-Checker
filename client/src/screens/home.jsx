import React, { useEffect, useState } from "react";
import { get_states, get_states_emissions } from "../apis/api";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import styled from "styled-components";
import DataTable from "../components/DataTable";
import { CircularProgress } from "@material-ui/core";

const StyledFormControl = styled(FormControl)`
  & {
    min-width: 10rem;
  }
`;

const StyledTableContainer = styled(Paper)`
  & {
    margin: 4rem 0;
  }
`;

const dataSchema = [
  { label: "State", id: "name", align: "left", sortable: true },
  { label: "From", id: "from", align: "right", sortable: false },
  { label: "To", id: "to", align: "right", sortable: false },
  { label: "Tax Amount Paid", id: "value", align: "right", sortable: true },
];

function Home() {
  const [states, setStates] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: new Date(2000, 0),
    to: new Date(2015, 0),
    series_id: "",
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await get_states();
        await setStates(res);
      } catch {}
    };
    fetchStates();
  }, []);

  useEffect(() => {
    fetchEmissionsData();
  }, [states]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchEmissionsData = async () => {
    try {
      let series_ids = "";
      if (filters.series_id) series_ids = filters.series_id;
      else states.forEach((state) => (series_ids += `${state.series_id};`));

      const res = await get_states_emissions({
        from: filters.from.getFullYear(),
        to: filters.to.getFullYear(),
        series_ids,
      });
      setData(res);
      setLoading(false);
    } catch {}
  };

  const changeFilters = (type, value) => {
    const tempFilters = { ...filters };
    tempFilters[type] = value;
    setFilters(tempFilters);
  };

  return (
    <Grid container spacing={2}>
      {!loading ? (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item>
                <DatePicker
                  views={["year"]}
                  label="From Year"
                  minDate={new Date("1980-01-01")}
                  maxDate={new Date("2019-01-01")}
                  value={filters.from}
                  onChange={(date) => changeFilters("from", date)}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  views={["year"]}
                  label="To Year"
                  minDate={new Date("1980-02-01")}
                  maxDate={new Date("2018-02-01")}
                  value={filters.to}
                  onChange={(date) => changeFilters("to", date)}
                />
              </Grid>
              <Grid item>
                <StyledFormControl>
                  <InputLabel id="simple-select-label">State</InputLabel>
                  <Select
                    labelId="simple-select-label"
                    id="simple-select"
                    value={filters.series_id}
                    onChange={(e) => changeFilters("series_id", e.target.value)}
                    placeholder="State"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {states.map((state) => (
                      <MenuItem value={state.series_id} id={state.series_id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
              <Grid item>
                <Button onClick={fetchEmissionsData}>Apply Fitlers</Button>
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item>
            <StyledTableContainer>
              <DataTable data={data} dataSchema={dataSchema} />
            </StyledTableContainer>
          </Grid>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
}

export default Home;
