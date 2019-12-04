module.exports = async function(context) {
  const result = {
    data: {
      startWeight: 106.1,
      currentWeight: 104.2,
      goalWeight: 95,
      startDate: "December 1st 2019"
    }
  };

  context.res = {
    body: result,
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  };
};
