///---------------global variables----------------//
const proxy = "https://intense-mesa-62220.herokuapp.com/";
const countryAPI = "https://restcountries.herokuapp.com/api/v1/";
const covidAPI = "https://corona-api.com/countries";

const mainData = {
  World: [],
};

const DEFAULT_COVID_DATA = {
  latestData: {
    confirmed: 0,
    critical: 0,
    deaths: 0,
    recovered: 0,
  },
  today: { deaths: 0, confirmed: 0 },
};

const countrySelectElement = document.querySelector("[data-select='country']");
const regionSelectElement = document.querySelector("[data-select='region']");
const situationSelectElement = document.querySelector(
  "[data-select='situation']"
);
const chartDivElement = document.querySelector("[data-char-or-info='chart']");
const infoElement = document.querySelector("[data-char-or-info='info']");
const charElement = document.querySelector("#myChart");
const countryTitleElement = document.querySelector("#countryTitle");

let situationSelected = "confirmed";
let regionSelected = "World";
let myChart = new Chart(charElement, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        // label: "",
        data: [],
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
    plugins: {
      title: {
        display: true,
        text: "",
        font: {
          size: 18,
          family: "BalsamiqSans",
        },
      },
      legend: {
        display: false,
      },
    },
  },
});

///------------get data from apis functions-----------//

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

///---------onclick functions---------//

const onCountryClick = ({ target: { value } }) => {
  infoElement.classList.remove("display-none");
  chartDivElement.classList.add("display-none");

  let regCheck = "World";
  if (regionSelected) regCheck = regionSelected;
  const countryObj = mainData[regCheck].find(
    (country) => country.code === value
  );
  console.log(countryObj.name);

  countryTitleElement.textContent = countryObj.name;

  const countryLatestData = countryObj.covidData.latestData;
  delete countryLatestData["calculated"];
  console.log(countryLatestData);

  const allLastElements = document.querySelectorAll("[data-last-condition]");
  allLastElements.forEach((pElement) => {
    pElement.textContent = countryLatestData[pElement.dataset.lastCondition];
  });

  const allTodayElements = document.querySelectorAll("[data-today-condition]");
  console.log(countryObj.covidData.today);
  allTodayElements.forEach((pElement) => {
    pElement.textContent =
      countryObj.covidData.today[pElement.dataset.todayCondition];
  });
};

const onRegionClick = ({ target: { value } }) => {
  regionSelected = value;
  showChart();
  reAssignCountryOptions(regionSelected);
  addDataByRegion(regionSelected);
};

const onSituationClick = ({ target: { value } }) => {
  situationSelected = value;
  showChart();
  addDataByRegion();
};

//---------------------//

const showChart = () => {
  infoElement.classList.add("display-none");
  chartDivElement.classList.remove("display-none");
};

const addDataByRegion = () => {
  const arrOfCountriesByRegionNames = [];
  mainData[regionSelected].forEach((country) => {
    arrOfCountriesByRegionNames.push(country.name);
  });

  const arrOfNumBySituation = [];
  mainData[regionSelected].forEach((country) => {
    arrOfNumBySituation.push(country.covidData.latestData[situationSelected]);
  });

  removeData(myChart);

  arrOfNumBySituation.forEach((dataNumbers, index) => {
    addData(
      myChart,
      arrOfCountriesByRegionNames[index],
      dataNumbers,
      `${regionSelected}: ${situationSelected}`
    );
  });
};

const loadingIsDone = () => {
  const spinnerElement = document.querySelector(".spinner");
  const containerElement = document.querySelector(".main-container");
  spinnerElement.classList.add("display-none");
  containerElement.classList.remove("display-none");
};

//-----------handel DropDowns Options------------//

const createAllOptions = () => {
  mainData.World.forEach((country) => {
    const optionCountryElement = `<option value="${country.code}">${country.name}</option>`;
    countrySelectElement.innerHTML += optionCountryElement;
  });

  Object.keys(mainData).forEach((region) => {
    let isDefault = "";
    if (region === "World") isDefault = "selected";
    const optionCountryElement = `<option value="${region}" ${isDefault}>${region}</option>`;
    regionSelectElement.innerHTML += optionCountryElement;
  });
  Object.keys(mainData.World[0].covidData.latestData).forEach((covidData) => {
    if (covidData !== "calculated") {
      let isDefault = "";
      if (covidData === "confirmed") isDefault = "selected";
      const optionCountryElement = `<option value="${covidData}" ${isDefault}>${covidData}</option>`;
      situationSelectElement.innerHTML += optionCountryElement;
    }
  });
};

const reAssignCountryOptions = (region) => {
  countrySelectElement.innerHTML = "";
  mainData[region].forEach((country) => {
    const optionCountryElement = `<option value="${country.code}">${country.name}</option>`;
    countrySelectElement.innerHTML += optionCountryElement;
  });
};

//------chart functions------///

const addData = (chart, labels, data, title) => {
  // chart doc , arrOfNum, data
  chart.data.labels.push(labels);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.options.plugins.legend.display = false;
  chart.options.plugins.title.text = title;
  chart.update();
};

const removeData = (chart) => {
  chart.data.labels = [];
  chart.data.datasets.forEach((dataset) => {
    dataset.data = [];
  });
  chart.data.datasets.label = "";
  chart.update();
};
//----------page start func--------------//

const getAllData = async () => {
  try {
    const covidData = await getCovidData();
    await getCountriesData(covidData);
    loadingIsDone();
    createAllOptions();
    showChart();
    addDataByRegion();
  } catch (error) {
    console.log(error);
  }
};

//-------start--------//

getAllData();
regionSelectElement.addEventListener("change", onRegionClick);
countrySelectElement.addEventListener("change", onCountryClick);
situationSelectElement.addEventListener("change", onSituationClick);
