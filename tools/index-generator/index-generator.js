// Run this node.js script from the index-generator folder to update the database index.json
// file with the latest card set version of each folder.

const
  path = require("path"),
  fs = require("fs"),
  sep = path.sep,
  root = ["..", "..", "database"].join(sep);
  index = {},
  out = { index:[] };

fs.readdirSync(root, { withFileTypes: true }).forEach(file => {
  if (file.isDirectory()) {
    const
      subpath = root + sep + file.name + sep;
    fs.readdirSync(subpath).forEach(file => {
      if (file.endsWith(".json")) {
        const
          data = fs.readFileSync(subpath+file, { encoding: "utf8", flag: "r" }),
          jsonData = JSON.parse(data);
        if (
            !index[jsonData.meta.id] ||
            (index[jsonData.meta.id].dateUpdated < jsonData.meta.dateUpdated)
          )
          index[jsonData.meta.id] = jsonData.meta;
      }
    });
  }
});

for (let k in index)
  out.index.push( { meta: index[k] });

fs.writeFileSync(root + sep + "index.json", JSON.stringify(out,null,2));

console.log("Database index updated.");
