const fs = require("fs");
const csvParser = require("csv-parser");
require("dotenv").config();

const filePath = process.env.PATHCSV;

const categories = {
  Alimentação: ["Grao de Ouro", "Finesse Salgados"],
  Contas: ["Pg *Ton Alessandra F", "Conta Vivo"],
};

const costCategories = ({ title }) => {
  for (const element in categories) {
    if (categories[element].some((keyword) => title.includes(keyword))) {
      return element;
    }
  }
  return "Others";
};

const processCSV = () => {
  const costs = {};

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      const category = costCategories(row);
      const value = parseFloat(row.amount) || 0;

      if (!costs[category]) {
        costs[category] = 0;
      }
      costs[category] += value;
    })
    .on("end", () => {
      fs.writeFileSync("src/costs.json", JSON.stringify(costs, null, 2));
      console.log("File costs.json generated");
    });
};

processCSV();
