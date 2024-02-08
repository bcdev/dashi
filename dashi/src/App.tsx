import { useEffect, useState } from "react";
import "./App.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/*
const regions = Array.from("ABCDEFG").map((x) => ({
  name: `Page ${x}`,
  uv: Math.floor(10000 * Math.random()),
  pv: Math.floor(10000 * Math.random()),
  amt: Math.floor(10000 * Math.random()),
}));
 */

function App() {
  const [region, setRegion] = useState(0);
  const [data, setData] = useState([] as unknown[]);

  useEffect(() => {
    fetchRegionData(region).then((data) => {
      if (data) {
        setData(data);
      }
    });
  }, [region, setRegion]);

  return (
    <>
      <h1>Dashi Demo</h1>
      <AreaChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffdd00" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ffdd00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="pv"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
        <Area
          type="monotone"
          dataKey="amt"
          stroke="#ffdd00"
          fillOpacity={1}
          fill="url(#colorAmt)"
        />
      </AreaChart>

      <div className="card">
        {[0, 1, 2].map((r) => (
          <button
            key={r}
            disabled={r === region}
            onClick={() => setRegion(r)}
          >{`Data ${r + 1}`}</button>
        ))}
      </div>
    </>
  );
}

export default App;

async function fetchRegionData(region: number): Promise<unknown[] | undefined> {
  try {
    const response = await fetch(`http://localhost:8888/region/${region}`);
    if (response.ok) {
      try {
        const result = await response.json();
        return result.result;
      } catch (e) {
        console.error(`Want JSON, error: ${e}`);
      }
    } else {
      console.error(`Want data, not ok: ${response.statusText}`);
    }
  } catch (e) {
    console.error(`Want data, error: ${e}`);
  }
}
