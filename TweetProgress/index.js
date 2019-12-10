const axios = require("axios");
const Twitter = require("twitter");
const Sugar = require("sugar");
const makeNumber = number => {
  return Number(number.toFixed(1));
};
module.exports = async function(context, req) {
  const call = axios
    .get("https://fatty.timbenniks.com/api/weight.json")
    .then(response => {
      const TwitterClient = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
      });

      const lostInTotal = makeNumber(
        response.data.startWeight -
          response.data.weight[response.data.weight.length - 1].weight
      );

      const lastMeasurement =
        response.data.weight[response.data.weight.length - 1];

      const oneBeforeLastMeasurement =
        response.data.weight[response.data.weight.length - 2];

      const relativeDateSinceLastMeasurement = Sugar.Date.relative(
        new Date(oneBeforeLastMeasurement.date)
      );

      const startDate = Sugar.Date.medium(new Date(response.data.startDate));
      const startWeight = response.data.startWeight;
      const goalWeight = response.data.goalWeight;

      const difference = makeNumber(
        lastMeasurement.weight - oneBeforeLastMeasurement.weight
      );

      let status = "lost";
      let units = "grams";

      if (difference > 0) {
        status = "gained";
      }

      if (difference > 1 || difference < -1) {
        units = "kilo's";
      }

      let readableDifference = 0;
      if (units === "grams") {
        readableDifference = difference * (status === "lost" ? -1000 : 1000);
      } else {
        readableDifference = status === "lost" ? -difference : difference;
      }

      const humanReadableStatus = `${status} ${readableDifference} ${units}`;
      let tweet = "Fattybot: ";

      tweet += status === "lost" ? "Yes!" : "Yikes!";
      tweet += ` Tim ${humanReadableStatus} since his last weigh-in ${relativeDateSinceLastMeasurement}.`;
      tweet += ` He has lost ${lostInTotal}kg since ${startDate}. Will he reach ${goalWeight}kg at @Frontend_Love next year?`;
      tweet +=
        " #fatty #roadtoamsterdam #weightloss #frontendfeveloperlove #accountability https://fatty.timbenniks.com";

      const tweeeeet = TwitterClient.post("statuses/update", { status: tweet })
        .then(function(response) {
          context.res = {
            body: {
              message: "Posted to Twitter succesfully",
              response
            },
            headers: {
              "Content-Type": "application/json"
            }
          };
        })
        .catch(function(error) {
          context.res = {
            status: 500,
            body: {
              message: error
            },
            headers: {
              "Content-Type": "application/json"
            }
          };
        });

      return tweeeeet;
    })
    .catch(error => {
      context.res = {
        status: 500,
        body: {
          message: error
        },
        headers: {
          "Content-Type": "application/json"
        }
      };
    });

  return call;
};
