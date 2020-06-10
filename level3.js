const fs = require("fs");

const fileName = "./level1-5.in";
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

function findTransitFeatures(groupedBrightness) {
  let result = {};
  for (let key in groupedBrightness) {
    const starBrightness = groupedBrightness[key];
    const standardBrightness = starBrightness[0];
    // [1000000, 10, 995000 6 1000000 84 995000 6 1000000 84 995000 6 1000000 84 995000 6 1000000 14]
    let transitFeatures = [];
    const minTransitBrightness = standardBrightness * 0.995;
    let time = starBrightness[1];
    for (let i = 2; i < starBrightness.length; i += 2) {
      if (
        starBrightness[i] <= minTransitBrightness &&
        starBrightness[i + 1] >= 5 &&
        starBrightness[i + 1] <= 15
      ) {
        //time, intensity, duration
        transitFeatures.push([time, starBrightness[i], starBrightness[i + 1]]);
      }
      time += starBrightness[i + 1];
    }
    result[key] = transitFeatures;
  }
  return result;
}

function findPeriodicTransits(transitFeatures) {
  let result = {};
  for (let key in transitFeatures) {
    const transits = transitFeatures[key];
    result[key] = "NO";
    if (transits.length < 3) {
      continue;
    }

    for (let i = 0; i < transits.length - 1; i++) {
      let transitCount = 1;
      const brightness = transits[i][1]
      const duration = transits[i][2]
      for (let j = i + 1; j < transits.length; j++) {
        const brightnessJ = transits[j][1]
        const durationJ = transits[j][2]
        if (brightness !== brightnessJ || duration !== durationJ) {
          continue
        }
        const timeBetweenTransits = transits[j][0] - transits[i][0]
        transitCount++
        for (let k = j + 1; k < transits.length; k++) { 
          const brightnessK = transits[k][1]
          const durationK = transits[k][2]
          const timeBetweenJandK = transits[k][0] - transits[j][0]
          if (brightness === brightnessK
            && duration === durationK
            && timeBetweenJandK ===  timeBetweenTransits) {
              transitCount++
              break
          }
        }

        if (transitCount >= 3) {
          break
        }
      }
      if (transitCount >= 3) {
        result[key] = "YES";
        break
      }
    }
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
const transitFeatures = findTransitFeatures(groupedBrightness);
const periodicTransits = findPeriodicTransits(transitFeatures);
const output = toOutputStructure(periodicTransits);
fs.writeFileSync(fileName + ".output", output);
