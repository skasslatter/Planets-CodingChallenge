const fs = require("fs");

const fileName = "./level1-1.in";
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

function findEvents(groupedBrightness) {
  let result = {};
  for (let key in groupedBrightness) {
    const starBrightness = groupedBrightness[key];
    const standardBrightness = starBrightness[0];
    // [1000000, 10, 995000 6 1000000 84 995000 6 1000000 84 995000 6 1000000 84 995000 6 1000000 14]
    let solarFlareCount = 0;
    let transitFeatureCount = 0;
    const minTransitBrightness = standardBrightness * 0.995;
    for (let i = 2; i < starBrightness.length; i += 2) {
      // if (solarFlareCount + transitFeatureCount >= 5) {
      //   break
      // }
      if (starBrightness[i] > standardBrightness) {
        solarFlareCount++;
      } else if (
        starBrightness[i] <= minTransitBrightness &&
        starBrightness[i + 1] >= 5 &&
        starBrightness[i + 1] <= 15
      ) {
        transitFeatureCount++;
      }
    }
    result[key] = [solarFlareCount, transitFeatureCount];
  }
  return result;
}

function toOutputStructure(data) {
  let arr = [];
  for (let key in data) {
    arr.push(key);
    arr = arr.concat(data[key]);
  }
  return arr.join(" ");
}

const starsBrightness = parseInput(data);
const groupedBrightness = groupConsecutiveBrightness(starsBrightness);
const events = findEvents(groupedBrightness);
const output = toOutputStructure(events);
fs.writeFileSync(fileName + ".output", output);
