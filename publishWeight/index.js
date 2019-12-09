const Github = require("octokat");

const isFloat = val => {
  var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
  if (!floatRegex.test(val)) {
    return false;
  }

  val = parseFloat(val);
  if (isNaN(val)) {
    return false;
  }
  return true;
};

const isInt = val => {
  var intRegex = /^-?\d+$/;
  if (!intRegex.test(val)) {
    return false;
  }

  var intVal = parseInt(val, 10);
  return parseFloat(val) == intVal && !isNaN(intVal);
};

module.exports = async function(context, req) {
  if (
    req.query.weight &&
    (isFloat(req.query.weight) || isInt(req.query.weight))
  ) {
    const github = new Github({
      username: "timbenniks",
      password: process.enc.GITGUB_PASSWORD
    });

    const repositoryUrl = "timbenniks/fatty";
    const [user, repoName] = repositoryUrl.split("/");
    const weightFilePath = "src/assets/content/weight.json";
    const repo = await github.repos(user, repoName).fetch();
    const main = await repo.git.refs("heads/automation").fetch();
    const file = await repo.contents("src/assets/content/weight.json").read();
    const treeItems = [];
    const weightData = JSON.parse(file);

    weightData.weight.push({
      date: new Date(),
      weight: Number(req.query.weight)
    });

    let weightFile = await repo.git.blobs.create({
      content: Buffer.from(JSON.stringify(weightData)).toString("base64"),
      encoding: "base64"
    });

    treeItems.push({
      path: weightFilePath,
      sha: weightFile.sha,
      mode: "100644",
      type: "blob"
    });

    let tree = await repo.git.trees.create({
      tree: treeItems,
      base_tree: main.object.sha
    });

    let commit = await repo.git.commits.create({
      message:
        "Created via Web - Added a new weight property to the weight.json file.",
      tree: tree.sha,
      parents: [main.object.sha]
    });

    main.update({ sha: commit.sha });

    context.res = {
      status: 200,
      body: {
        message:
          "Created via Web - Added a new weight property to the weight.json file.",
        data: weightData
      },
      headers: {
        "Content-Type": "application/json"
      }
    };
  } else {
    context.res = {
      status: 400,
      body:
        "Please pass a weight value on the query string. It could also be that you send something other than a number..."
    };
  }
};
