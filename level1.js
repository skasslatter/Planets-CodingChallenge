const fs = require("fs");

const fileName = "./level1-2.in";
const data = fs.readFileSync(fileName, { encoding: "utf8", flag: "r" });

console.log(data);

function parseInput(data) {
  const stars = {};
  const dataArr = data.split(" ");
  console.log(dataArr);
  const nrOfStars = dataArr[0];
  let position = 1;
  for (let currentStar = 0; currentStar < nrOfStars; currentStar++) {
    const starName = dataArr[position];
    const brightnessLength = parseInt(dataArr[position + 1]);
    position += 2;
    const brightness = dataArr
      .slice(position, position + brightnessLength)
      .map((value) => {
        return parseInt(value);
      });
    position = position + brightnessLength;

    stars[starName] = brightness;
  }
  return stars;
}

function groupConsecutiveBrightness(stars) {
  const output = {};
  for (
    let currentStar = 0;
    currentStar < Object.keys(stars).length;
    currentStar++
  ) {
    const starName = Object.keys(stars)[currentStar];
    output[starName] = groupBrightness(stars[starName]);
  }
  return output;
}

function groupBrightness(brightness) {
  const output = [brightness[0]];
  let count = 1;
  for (let i = 1; i < brightness.length; i++) {
    if (brightness[i] === brightness[i - 1]) {
      count++;
    } else {
      output.push(count);
      count = 1;
      output.push(brightness[i]);
    }
  }
  output.push(count);
  return output;
}

function toOutputStructure(groupedBrightness) {
  let arr = [];
  for (let key in groupedBrightness) {
    arr.push(key);
    arr = arr.concat(groupedBrightness[key]);
  }
  return arr.join(" ");
}

const starsBrightness = parseInput(data);
const result = groupConsecutiveBrightness(starsBrightness);
const output = toOutputStructure(result);
fs.writeFileSync(fileName + ".output", output);
