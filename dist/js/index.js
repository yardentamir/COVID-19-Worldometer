const proxy = "https://intense-mesa-62220.herokuapp.com/";
const countryAPI = "https://restcountries.herokuapp.com/api/v1/";
const covidAPI = "https://corona-api.com/countries";

const mainData = {
  World: [],
};

const DEFAULT_COVID_DATA = {
  confirmed: 0,
  critical: 0,
  deaths: 0,
  recovered: 0,
};

const countrySelectElement = document.querySelector("[data-select='country']");
const regionSelectElement = document.querySelector("[data-select='region']");
const situationSelectElement = document.querySelector(
  "[data-select='situation']"
);
const chartElement = document.querySelector("[data-char-or-info='chart']");
const infoElement = document.querySelector("[data-char-or-info='info']");

const situationSelected = "confirmed";

///-----------------------//

const getCovidData = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(proxy + covidAPI);
    const covidData = {};
    data.forEach((countryCovidInfo) => {
      covidData[countryCovidInfo.code] = {
        latestData: countryCovidInfo.latest_data,
        today: countryCovidInfo.today,
      };
    });
    console.log(covidData);
    return covidData;
  } catch (error) {
    throw new Error(error);
  }
};

const getCountriesData = async (coronaData) => {
  try {
    const { data } = await axios.get(proxy + countryAPI);
    data.forEach((countryInfo) => {
      const cData = {
        name: countryInfo.name.common,
        region: countryInfo.region,
        code: countryInfo.cca2,
        covidData: coronaData[countryInfo.cca2] || DEFAULT_COVID_DATA,
      };

      if (countryInfo.region) {
        if (!mainData[countryInfo.region]) {
          mainData[countryInfo.region] = [];
        }
        mainData[countryInfo.region].push(cData);
      }
      mainData.World.push(cData);
    });
    console.log(mainData);
  } catch (error) {
    throw new Error(error);
  }
};

const loadingIsDone = () => {
  const spinnerElement = document.querySelector(".spinner");
  const containerElement = document.querySelector(".main-container");
  spinnerElement.classList.add("display-none");
  containerElement.classList.remove("display-none");
};

///------------------//

const reAssignCountryOptions = (region) => {
  countrySelectElement.innerHTML = "";
  mainData[region].forEach((country) => {
    const optionCountryElement = `<option value="${country.code}">${country.name}</option>`;
    countrySelectElement.innerHTML += optionCountryElement;
  });
};

const onCountryClick = ({ target }) => {
  const countryCode = target.value;
  console.log(mainData);
  const countryObj = mainData.World.find(
    (country) => country.code === countryCode
  );
  console.log(countryObj);
  infoElement.classList.remove("visibility-hidden");
  chartElement.classList.add("visibility-hidden");
};

const onRegionClick = ({ target }) => {
  const reg = target.value;
  infoElement.classList.add("visibility-hidden");
  chartElement.classList.remove("visibility-hidden");
  reAssignCountryOptions(reg);

  // let ObjByRegionKey;
  // for (let [key, value] of Object.entries(mainData)) {
  //   if (key === reg) {
  //     ObjByRegionKey = value;
  //     break;
  //   }
  // }
  // console.log(ObjByRegionKey);
  const arrOfCountriesByRegionNames = [];
  mainData[reg].forEach((country) => {
    arrOfCountriesByRegionNames.push(country.name);
  });
  console.log(arrOfCountriesByRegionNames);

  const arrOfNumBySituation = [];
  mainData[reg].forEach((country) => {
    arrOfNumBySituation.push(country.covidData.latestData[situationSelected]);
  });
  console.log(arrOfNumBySituation);
  const myChart = new Chart(chartElement, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "# of Cases",
          data: arrOfNumBySituation,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  arrOfNumBySituation.forEach((data, index) => {
    addData(myChart, arrOfCountriesByRegionNames[index], data);
  });
};

const onSituationClick = ({ target }) => {
  situationSelected = target.value;
};

const createAllOptions = () => {
  mainData.World.forEach((country) => {
    const optionCountryElement = `<option value="${country.code}">${country.name}</option>`;
    countrySelectElement.innerHTML += optionCountryElement;
  });

  Object.keys(mainData).forEach((region) => {
    const optionCountryElement = `<option value="${region}">${region}</option>`;
    regionSelectElement.innerHTML += optionCountryElement;
  });
  Object.keys(mainData.World[0].covidData.latestData).forEach((covidData) => {
    if (covidData !== "calculated") {
      const optionCountryElement = `<option value="${covidData}">${covidData}</option>`;
      situationSelectElement.innerHTML += optionCountryElement;
    }
  });
};

//------chart functions------///

function addData(chart, label, data) {
  // chart doc , arrOfNum, data
  console.log(chart.data);
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

function updateConfigByMutating(chart) {
  chart.options.plugins.title.text = "new title";
  chart.update();
}

function updateConfigAsNewObject(chart) {
  chart.options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Chart.js",
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };
  chart.update();
}

const getAllData = async () => {
  try {
    const covidData = await getCovidData();
    await getCountriesData(covidData);
    loadingIsDone();
    createAllOptions();
    regionSelectElement.addEventListener("change", onRegionClick);
    countrySelectElement.addEventListener("change", onCountryClick);
    situationSelectElement.addEventListener("change", onSituationClick);
  } catch (error) {
    console.log(error);
  }
};

//---------------//

getAllData();

// const getCountries = async () => {
//   const country = await axios.get("https://corona-api.com/countries/AF", [
//     {
//       headers: "application/json",
//     },
//   ]);
//   console.log(country);
//   const heirarchy = country.data.data.latest_data;
//   const data = [
//     heirarchy.deaths,
//     heirarchy.confirmed,
//     heirarchy.recovered,
//     heirarchy.critical,
//   ];
//   const ctx = document.getElementById("myChart");
//   const myChart = new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels: ["Deaths", "Confirmed", "Recovered", "Critical"],
//       datasets: [
//         {
//           label: "# of Cases",
//           data: data,
//           backgroundColor: [
//             "rgba(255, 99, 132, 0.2)",
//             "rgba(54, 162, 235, 0.2)",
//             "rgba(255, 206, 86, 0.2)",
//             "rgba(75, 192, 192, 0.2)",
//             "rgba(153, 102, 255, 0.2)",
//           ],
//           borderColor: [
//             "rgba(255, 99, 132, 1)",
//             "rgba(54, 162, 235, 1)",
//             "rgba(255, 206, 86, 1)",
//             "rgba(75, 192, 192, 1)",
//             "rgba(153, 102, 255, 1)",
//           ],
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });
// };
// getCountries();
