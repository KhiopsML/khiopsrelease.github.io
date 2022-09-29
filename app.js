function init() {
  fetch("https://api.github.com/repos/khiopsrelease/kv-release/releases")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("🚀 ~ file: app.js ~ line 32 ~ data", data);
      chart(
        data,
        document.getElementById("kv-dl"),
        "Downloads count",
        "download_count"
      );
      chart(
        data,
        document.getElementById("kv-launch"),
        "Launch count",
        "launch_count"
      );
    })
    .catch(function (err) {
      console.warn(err);
    });
  fetch("https://api.github.com/repos/khiopsrelease/kc-release/releases")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("🚀 ~ file: app.js ~ line 32 ~ data", data);
      chart(
        data,
        document.getElementById("kc-dl"),
        "Downloads count",
        "download_count"
      );
      chart(
        data,
        document.getElementById("kc-launch"),
        "Launch count",
        "launch_count"
      );
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
        if (version.name.includes(".exe")) {
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
}
