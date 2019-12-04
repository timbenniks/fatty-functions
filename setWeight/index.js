module.exports = async function(context, req) {
  if (req.query.weight) {
    let weightList = [];

    weightList.push({
      date: new Date(),
      weight: Number(req.query.weight)
    });

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
