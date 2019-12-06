const axios = require("axios");
const Twitter = require('twitter');

module.exports = async function (context, req) {
  const call = axios.get("https://fatty.timbenniks.com/api/weight.json")
    .then(response => {
      const TwitterClient = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
      });

      const lost = response.data.startWeight - response.data.weight[ response.data.weight.length - 1 ].weight;
      const startDate = new Date(response.data.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
      const startWeight = response.data.startWeight;
      const goalWeight = response.data.goalWeight;

      const message = `Fattybot: Tim has lost ${lost.toFixed(1)}kg since ${startDate} when he weighed ${startWeight}kg. The goal is to weigh ${goalWeight}kg at the @Frontend_Love Conference on February 19, 2020. Will he get there? See: https://fatty.timbenniks.com #fatty #roadtoamsterdam #weightloss #frontendfeveloperlove #accountability`;

      const tweeeeet = TwitterClient
        .post('statuses/update', {status: message})
        .then(function (tweet) {
          context.res = {
            body: {
              message: "Posted to Twitter succesfully",
              tweet
            },
            headers: {
              "Content-Type": "application/json"
            }
          }
        })
        .catch(function (error) {
          context.res = {
            status: 500,
            body: {
              message: error
            },
            headers: {
              "Content-Type": "application/json"
            }
          }
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