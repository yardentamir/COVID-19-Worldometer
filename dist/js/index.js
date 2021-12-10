const apisObj = {
  proxy: "https://intense-mesa-62220.herokuapp.com/",
  countryAPI: "https://restcountries.herokuapp.com/api/v1/",
  covidAPI: "https://corona-api.com/countries",
};

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

///-----------------------//

const getCovidData = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(apisObj.proxy + apisObj.covidAPI);
    const covidData = {};
    data.forEach((countryCovidInfo) => {
      covidData[countryCovidInfo.code] = countryCovidInfo.latest_data;
    });
    console.log(data);
    return covidData;
  } catch (error) {
    throw new Error(error);
  }
};

const getCountriesData = async (coronaData) => {
  try {
    const { data } = await axios.get(apisObj.proxy + apisObj.countryAPI);
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
  } catch (error) {
    throw new Error(error);
  }
};

const loadingIsDone = () => {
  const spinnerElement = document.querySelector(".spinner");
  const containerElement = document.querySelector(".container");
  spinnerElement.classList.add("display-none");
  containerElement.classList.remove("display-none");
};

//---------------------------//

const onRegionClick = ({ target }) => {
  const reg = target.value;
  let ObjByRegionKey;
  for (let [key, value] of Object.entries(mainData)) {
    if (key === reg) {
      ObjByRegionKey = value;
      break;
    }
  }
  reAssignCountryOptions(reg);
};

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
  console.log(target);
  const countryObj = mainData.World.find(
    (country) => country.code === countryCode
  );
  console.log(countryObj);
  // const europeArr = Object.values(mainData).filter(
  //   (country) => country.region === reg
  // );
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
  Object.keys(mainData.World[0].covidData).forEach((covidData) => {
    if (covidData !== "calculated") {
      const optionCountryElement = `<option value="${covidData}">${covidData}</option>`;
      situationSelectElement.innerHTML += optionCountryElement;
    }
  });
};

const getAllData = async () => {
  try {
    const covidData = await getCovidData();
    await getCountriesData(covidData);
    loadingIsDone();
    createAllOptions();
    regionSelectElement.addEventListener("change", onRegionClick);
    countrySelectElement.addEventListener("change", onCountryClick);
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
