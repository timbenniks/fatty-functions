const fs = require("fs");
const path = require("path");

module.exports = async function(context, req) {
  if (req.query.weight) {
    let rawWeight = fs.readFileSync(
      path.join(__dirname, "../Shared/weight.json")
    );

    let weightList = JSON.parse(rawWeight) || [];

    weightList.push({
      date: new Date(),
      weight: Number(req.query.weight)
    });

    fs.writeFileSync(
      path.join(__dirname, "../Shared/weight.json"),
      JSON.stringify(weightList)
    );

    context.res = {
      status: 200,
      body: {
        message: `Weight updated with: ${req.query.weight}kg`,
        list: weightList
      },
      headers: {
        "Content-Type": "application/json"
      }
    };
  } else {
    context.res = {
      status: 400,
      body: "Please give a bodyweight value in kg"
    };
  }
};
