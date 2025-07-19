import React, { useEffect, useState } from "react";
import "./CP.css";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function CP() {
  const [ratings, setRatings] = useState({
    codeforces: { current: null, max: null },
    codechef: 1602, // hardcoded
    atcoder: { current: null, max: null },
    loading: true,
  });

  const [cfChartData, setCfChartData] = useState(null);

  // Fetch ratings
  useEffect(() => {
    async function fetchRatings() {
      try {
        // Codeforces
        const cfResp = await fetch(
          "https://codeforces.com/api/user.info?handles=athtripathi"
        );
        const cfData = await cfResp.json();
        let cfRating = { current: "Unrated", max: "Unrated" };
        if (cfData.status === "OK" && cfData.result.length > 0) {
          cfRating.current = cfData.result[0].rating || "Unrated";
          cfRating.max = cfData.result[0].maxRating || "Unrated";
        }

        // AtCoder
        let acRating = { current: "Unrated", max: "Unrated" };
        try {
          const acResp = await fetch(
            "https://atcoder-api.herokuapp.com/user/athtripathi"
          );
          const acData = await acResp.json();
          acRating.current = acData.rating || "Unrated";
          acRating.max = acData.highest_rating || "Unrated";
        } catch {
          acRating = { current: "Unavailable", max: "Unavailable" };
        }

        setRatings({
          codeforces: cfRating,
          codechef: 1602,
          atcoder: acRating,
          loading: false,
        });
      } catch {
        setRatings((r) => ({ ...r, loading: false }));
      }
    }

    fetchRatings();
  }, []);

  // Fetch Codeforces rating history
  useEffect(() => {
    async function fetchCfGraph() {
      try {
        const res = await fetch(
          "https://codeforces.com/api/user.rating?handle=athtripathi"
        );
        const data = await res.json();

        if (data.status === "OK") {
          const labels = data.result.map((item) => item.contestName);
          const ratings = data.result.map((item) => item.newRating);

          setCfChartData({
            labels,
            datasets: [
              {
                label: "Codeforces Rating",
                data: ratings,
                borderColor: "#2ecc40",
                backgroundColor: "rgba(46, 204, 64, 0.1)",
                pointBackgroundColor: "#2ecc40",
                fill: true,
                tension: 0.25,
                pointRadius: 3,
              },
            ],
          });
        }
      } catch (err) {
        setCfChartData(null);
      }
    }

    fetchCfGraph();
  }, []);

  return (
    <section className="cp-page">
      <h2>Competitive Programming</h2>

      {/* Ratings Section */}
      <div className="cp-ratings-grid">
        <a
          href="https://codeforces.com/profile/athtripathi"
          target="_blank"
          rel="noopener noreferrer"
          className="cp-card"
        >
          <h4>Codeforces</h4>
          {ratings.loading ? (
            "Loading..."
          ) : (
            <>
              <span className="cp-rating">{ratings.codeforces.current}</span>
              <div className="cp-subtext">Max: {ratings.codeforces.max}</div>
            </>
          )}
        </a>

        <a
          href="https://www.codechef.com/users/secretmagician"
          target="_blank"
          rel="noopener noreferrer"
          className="cp-card"
        >
          <h4>CodeChef</h4>
          {ratings.loading ? (
            "Loading..."
          ) : (
            <>
              <span className="cp-rating">{ratings.codechef}</span>
              <div className="cp-subtext">Max: 1602</div>
            </>
          )}
        </a>

        <a
          href="https://atcoder.jp/users/athtripathi"
          target="_blank"
          rel="noopener noreferrer"
          className="cp-card"
        >
          <h4>AtCoder</h4>
          {ratings.loading ? (
            "Loading..."
          ) : (
            <>
              <span className="cp-rating">{ratings.atcoder.current}</span>
              <div className="cp-subtext">Max: {ratings.atcoder.max}</div>
            </>
          )}
        </a>
      </div>

      {/* Codeforces Chart */}
      <div className="cp-chart-container">
        <h3>Codeforces Rating Trend</h3>
        {cfChartData ? (
          <Line
            data={cfChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  ticks: { autoSkip: true, maxRotation: 45 },
                  title: { display: true, text: "Contest" },
                },
                y: {
                  beginAtZero: false,
                  title: { display: true, text: "Rating" },
                },
              },
            }}
          />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </section>
  );
}
