const apisObj = {
  proxy: "https://intense-mesa-62220.herokuapp.com/",
  countryAPI: "https://restcountries.herokuapp.com/api/v1/",
  covidAPI: "https://corona-api.com/countries",
};

const mainObj = {
  countriesData: {}, // name: // code:
  // countriesDataArr: [],
  regionsSet: new Set(),
  dataCountrySortedByRegion: [],
};

const NO_COVID_DATA = { confirmed: 0, critical: 0, deaths: 0, recovered: 0 };

const getCoronaData = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(apisObj.proxy + apisObj.covidAPI);
    data.forEach((countryCovidInfo) => {
      mainObj.countriesData[countryCovidInfo.code].latest_covid_data =
        countryCovidInfo.latest_data;
    });
    // mainObj.countriesDataArr = Object.keys(mainObj.countriesData).map(
    //   (key) => mainObj.countriesData[key]
    // );
  } catch (error) {
    throw new Error(error);
  }
};

const getCountriesData = async () => {
  try {
    const { data } = await axios.get(apisObj.proxy + apisObj.countryAPI);
    data.forEach((countryInfo) => {
      mainObj.countriesData[countryInfo.cca2] = {
        // code: countryInfo.cca2,
        name: countryInfo.name.common,
        region: countryInfo.region,
      };
    });
  } catch (error) {
    throw new Error(error);
  }
};

const sortByRegion = () => {
  console.log(mainObj);
  for (const keyCode in mainObj.countriesData) {
    if (mainObj.countriesData[keyCode].region) {
      mainObj.regionsSet.add(mainObj.countriesData[keyCode].region);
    }
  }
  const first = [...mainObj.regionsSet][0];
  console.log(first);
  // mainObj.regionsSet.forEach((regionSetItem) => {
  //   mainObj.dataCountrySortedByRegion;
  // });
};

const regionClick = (reg = "Asia") => {
  console.log(mainObj.countriesData);

  const europeArr = Object.values(mainObj.countriesData).filter(
    (country) => country.region === reg
  );
  console.log(europeArr);
};

const countryClick = (countryKey = "IL") => {
  let ObjByCountryKey;
  for (let [key, value] of Object.entries(mainObj.countriesData)) {
    if (key == countryKey) {
      ObjByCountryKey = value;
    }
  }
  console.log(ObjByCountryKey);
};

const loadingIsDone = () => {
  const spinnerElement = document.querySelector(".spinner");
  const containerElement = document.querySelector(".container");
  spinnerElement.classList.add("display-none");
  containerElement.classList.remove("display-none");
};

const getAllData = async () => {
  await getCountriesData();
  await getCoronaData();
  sortByRegion();
  loadingIsDone();

  regionClick();
  countryClick();
};

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
