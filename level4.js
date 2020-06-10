const fs = require("fs");

const fileName = "./level4-3.in";
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

function findEvent(starsBrightness) {
  const result = {};
  for (let key in starsBrightness) {
    let event = "nothing";
    const brightness = starsBrightness[key];
    let inTransit = false;
    let inTransitStart = 0;
    for (let i = 1; i < brightness.length; i++) {
      if (!inTransit) {
        if (brightness[i] * 0.9995  - brightness[i - 1] *  1.0005 > 200) {
          event = "flare";
          break;
        } else if (
          brightness[i - 1] * 1.0005 - brightness[i] * 0.9995 - 200 >
          brightness[i - 1] * 0.005
        ) {
          inTransit = true;
          inTransitStart = i;
        } else if (brightness[i - 1] * 0.9995 - brightness[i] * 1.0005 > 200) {
          event = "something"
          break;
        }
      } else {
        if (
          brightness[i] * 1.0005 - brightness[i - 1] * 0.9995 - 200 >
          brightness[i] * 0.005
        ) {
          inTransit = false;
          let duration = i - inTransitStart;
          if (duration >= 5 && duration <= 15) {
            event = "transit";
          } else {
            event = "something";
          }
          break
        }
      }
    }
    if (inTransit) { 
      event = "something"
    }
    result[key] = [event];
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
const result = findEvent(starsBrightness);
const output = toOutputStructure(result);
fs.writeFileSync(fileName + ".output", output);
