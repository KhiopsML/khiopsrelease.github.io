function init() {
  const urlKv =
    "https://api.github.com/repos/khiopsrelease/kv-release/releases";
  const urlKc =
    "https://api.github.com/repos/khiopsrelease/kc-release/releases";
  // const urlKv = "mock-kv.json";
  // const urlKc = "mock-kc.json";

  fetch(urlKv)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("🚀 ~ file: app.js ~ line 32 ~ data", data);
      var resDl = chart(
        data,
        document.getElementById("kv-dl"),
        "Downloads count",
        "download_count"
      );
      stats(resDl, "stats-kv-dl");
      var resLaunch = chart(
        data,
        document.getElementById("kv-launch"),
        "Launches count",
        "launch_count"
      );
      stats(resLaunch, "stats-kv-launch");
    })
    .catch(function (err) {
      console.warn(err);
    });
  fetch(urlKc)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("🚀 ~ file: app.js ~ line 32 ~ data", data);
      var resDl = chart(
        data,
        document.getElementById("kc-dl"),
        "Downloads count",
        "download_count"
      );
      stats(resDl, "stats-kc-dl");

      var resLaunch = chart(
        data,
        document.getElementById("kc-launch"),
        "Launches count",
        "launch_count"
      );
      stats(resLaunch, "stats-kc-launch");
    })
    .catch(function (err) {
      console.warn(err);
    });
}

function loadDatas(url, ctx, title, type) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      chart(data, ctx, title, type);
    })
    .catch(function (err) {
      console.warn(err);
    });
}

function chart(data, ctx, title, type) {
  chartLength =
    data.findIndex(function (e) {
      return e.name === "10.1.0";
    }) + 1;

  const chartDatas = {
    labels: [],
    datasets: [
      {
        label: "Windows",
        data: [],
        backgroundColor: "rgba(38,70,83, 09)",
      },
      {
        label: "Linux",
        data: [],
        //   backgroundColor: "rgba(42,157,143, 09)",
        backgroundColor: "rgba(231,111,81, 09)",
      },
      {
        label: "Mac",
        data: [],
        backgroundColor: "rgba(233,196,106, 09)",
      },
    ],
  };

  for (let i = 0; i < chartLength; i++) {
    const release = data[i];
    chartDatas.labels.push(release.name);
  }

  for (let i = 0; i < chartLength; i++) {
    const release = data[i];

    for (let j = 0; j < release.assets.length; j++) {
      const version = release.assets[j];
      if (type === "download_count") {
        if (
          version.name.includes(".exe") &&
          !version.name.includes(".exe.blockmap")
        ) {
          if (!chartDatas.datasets[0].data[i]) {
            chartDatas.datasets[0].data[i] = 0;
          }
          chartDatas.datasets[0].data[i] += version.download_count;
        }
        if (
          version.name.includes(".deb") ||
          version.name.includes(".rpm") ||
          version.name.includes(".amd64")
        ) {
          if (!chartDatas.datasets[1].data[i]) {
            chartDatas.datasets[1].data[i] = 0;
          }
          chartDatas.datasets[1].data[i] += version.download_count;
        }
        if (
          version.name.includes(".dmg") ||
          (version.name.includes(".dmg") &&
            !version.name.includes(".dmg.blockmap")) ||
          (version.name.includes(".mac.zip") &&
            !version.name.includes(".mac.zip.blockmap")) ||
          version.name.includes(".AppImage")
        ) {
          if (!chartDatas.datasets[2].data[i]) {
            chartDatas.datasets[2].data[i] = 0;
          }
          chartDatas.datasets[2].data[i] += version.download_count;
        }
      } else if (type === "launch_count") {
        if (version.name.includes("latest.yml")) {
          if (!chartDatas.datasets[0].data[i]) {
            chartDatas.datasets[0].data[i] = 0;
          }
          chartDatas.datasets[0].data[i] += version.download_count;
        }
        if (version.name.includes("latest-linux.yml")) {
          if (!chartDatas.datasets[1].data[i]) {
            chartDatas.datasets[1].data[i] = 0;
          }
          chartDatas.datasets[1].data[i] += version.download_count;
        }
        if (version.name.includes("latest-mac.yml")) {
          if (!chartDatas.datasets[2].data[i]) {
            chartDatas.datasets[2].data[i] = 0;
          }
          chartDatas.datasets[2].data[i] += version.download_count;
        }
      }
    }
  }

  console.log("🚀 ~ file: app.js ~ line 82 ~ chart ~ chartDatas", chartDatas);

  const config = {
    type: "bar",
    data: chartDatas,
    options: {
      animation: {
        duration: 0,
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  };
  const myChart = new Chart(ctx, config);

  return chartDatas;
}

function stats(data, div) {
  const p = document.getElementById(div);
  let win = data.datasets[0].data.reduce((a, b) => a + b, 0);
  let spanWin = document.createElement("span");
  spanWin.innerHTML = `win : ${win}`;
  p.appendChild(spanWin);

  let linux = data.datasets[1].data.reduce((a, b) => a + b, 0);
  let spanLinux = document.createElement("span");
  spanLinux.innerHTML = `Linux : ${linux}`;
  p.appendChild(spanLinux);

  let mac = data.datasets[2].data.reduce((a, b) => a + b, 0);
  let spanMac = document.createElement("span");
  spanMac.innerHTML = `Mac : ${mac}`;
  p.appendChild(spanMac);

  let tot = win + mac + linux;
  let spanTot = document.createElement("b");
  spanTot.innerHTML = `Total : ${tot}`;
  p.appendChild(spanTot);
}
