const apisObj = {
  proxy: "https://intense-mesa-62220.herokuapp.com/",
  countryAPI: "https://restcountries.herokuapp.com/api/v1/",
  covidAPI: "https://corona-api.com/countries",
};

const mainObj = {
  countriesData: {}, // name; code:
  cononaData: {},
};

const getCoronaData = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(apisObj.proxy + apisObj.covidAPI);
    console.log(data);
    data.forEach((countryCovidInfo) => {
      mainObj.countriesData[countryCovidInfo.code] =
        countryCovidInfo.latest_data;
    });
    console.log(mainObj);
  } catch (error) {
    throw new Error(error);
  }
};

const getCountriesData = async () => {
  try {
    const { data } = await axios.get(apisObj.proxy + apisObj.countryAPI);
    console.log(data);
    data.forEach((countryInfo) => {
      mainObj.countriesData[countryInfo.cca2] = {
        name: countryInfo.name.common,
        region: countryInfo.region,
      };
    });
  } catch (error) {
    throw new Error(error);
  }
};

getCountriesData();
getCoronaData();

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
