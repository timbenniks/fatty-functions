const fs = require("fs");
const path = require("path");

module.exports = async function(context) {
  let rawWeight = fs.readFileSync(
    path.join(__dirname, "../Shared/weight.json")
  );

  let weightList = JSON.parse(rawWeight) || [];

  const result = {
    startWeight: 106.1,
    currentWeight: weightList[weightList.length - 1].weight,
    latestLoggingDate: weightList[weightList.length - 1].date,
    goalWeight: 95,
    startDate: "December 1st 2019",
    list: weightList
  };

  context.res = {
    body: result,
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  };
};
