import "./App.css";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
const regex = new RegExp("^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$");
function csvJSON(csv) {
  let lines = csv.split("\n");

  let result = [];

  let headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentline = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}

function App() {
  const [csv, setCsv] = useState(null);
  useEffect(() => {
    (async () => {
      let fetchCsv = await fetch(
        "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
      );
      fetchCsv = await fetchCsv.text();
      const sortedJson = csvJSON(fetchCsv).filter(
        (state) =>
          state["Country/Region"] === "US" ||
          state["Country/Region"] === "Israel"
      );
      let dataToChart = {};
      let Israel = Object.keys(sortedJson[0]);
      const country1 = sortedJson[0]["Country/Region"];
      const country2 = sortedJson[1]["Country/Region"];
      dataToChart.country1 = country1;
      dataToChart.country2 = country2;
      const dates = Israel.filter((item) => regex.test(item));
      let dataTo = [];
      for (let i = 0; i < dates.length; i++) {
        dataTo.push({
          date: dates[i],
          country1: +sortedJson[0][dates[i]],
          US: +sortedJson[1][dates[i]],
        });
      }
      dataToChart.data = dataTo;
      setCsv(dataToChart);
    })();
  }, []);

  return (
    <div className='App'>
      {csv && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100vw",
            }}
          >
            <h1 style={{ textAlign: "center", marginBottom: 100 }}>
              Number of infected
            </h1>
            <LineChart
              width={600}
              height={300}
              data={csv.data}
              margin={{ top: 5, right: 100, left: 100, bottom: 5 }}
            >
              <XAxis
                dataKey={"date"}
                label={{
                  value: "date",
                  position: "right",
                  dy: 15,
                  dx: -15,
                }}
              />
              <YAxis
                label={{
                  value: "number of infected",
                  position: "top",
                  dy: 75,
                  dx: -50,
                  angle: -90,
                }}
              />
              <CartesianGrid strokeDasharray='3 3' />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey={"country1"}
                name='Israel'
                stroke='#82ca9d'
              />
              <Line
                name='US'
                type='monotone'
                dataKey={"US"}
                stroke='#8884d8'
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
