function createHouse(houseNumber, params) {
  const svg = d3.select("body")
    .append("svg")
    .attr("viewBox", "0 0 100 100")
    .attr("data-params", JSON.stringify(params)
  );

  // Roof
  svg.append("polygon")
    .attr("points", `0,30 50,${params[0]} 100,30`)
    .attr("fill", "red")
    .on("click", () => {
      orderHouses(0);
  });

  // Body
  svg.append("rect")
    .attr("x", "10")
    .attr("y", "30")
    .attr("width", params[1])
    .attr("height", "50")
    .attr("fill", "orange")
    .on("click", () => {
      orderHouses(1);
  });

  // Door
  svg.append("rect")
    .attr("x", params[2])
    .attr("y", "45")
    .attr("width", "20")
    .attr("height", "35")
    .attr("fill", "brown")
    .on("click", () => {
      orderHouses(2);
  });

  // Window
  svg.append("rect")
    .attr("x", "20")
    .attr("y", "40")
    .attr("width", "20")
    .attr("height", params[3])
    .attr("fill", "rgb(155, 196, 255)")
    .on("click", () => {
      orderHouses(3);
  });

  // Number
  svg.append("text")
    .attr("x", "50")
    .attr("y", "25")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "black")
    .text(houseNumber)
    .on("click", () => {
      orderHouses(4);
  });

  return svg.node();
}


// Function to order the houses array based on the param (index value)
function orderHouses(index) {
  d3
    .select("#house-container")
    .selectAll("svg")
    .nodes()
    .sort((a, b) => {
      return JSON.parse(a.dataset.params)[index] - JSON.parse(b.dataset.params)[index];
    })
    .forEach((node, i) => {
      let xTranslate = housePositions[i].x - housePositions[parseInt(node.textContent) - 1].x;
      let yTranslate = housePositions[i].y - housePositions[parseInt(node.textContent) - 1].y;

      d3.select(node)
        .transition()
        .duration(700)
        .ease(d3.easeCubicInOut)
        .attr("transform", `translate(${xTranslate}, ${yTranslate})`);
  });
}

function scaleParams(ranges, params) {
    let scaledParams = [];
    for(let k = 0; k < 10; k++)
        scaledParams.push([]);

    for(let i = 0; i < 4; i++) {
        let domain = [
            d3.min(params, (elem) => {
                return elem[i];
            }),
            d3.max(params, (elem) => {
                return elem[i];
            })
        ];
        let scale = d3.scaleLinear();
        scale.domain(domain);
        scale.range(ranges[i]);
        for(let j = 0; j < 10; j++) {
            scaledParams[j].push(scale(params[j][i]));
        }
    }
    for(let k = 0; k < 10; k++)
        scaledParams[k].push(k);

    return scaledParams;
}

function loadParams() {
  return new Promise((resolve, reject) => {
    d3.json("params.json")
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log('Error while reading JSON file');
        reject(error);
      });
  });
}

const housePositions = [];
const houseContainer = document.getElementById("house-container");

const ranges = [[0, 20], [70, 90], [40, 60], [10, 30]];

loadParams()
  .then((data) => {
    let params = scaleParams(ranges, data);
    for (let i = 0; i < 10; i++) {
        houseContainer.appendChild(createHouse(i + 1, params[i]));
    }
    d3
      .select("#house-container")
      .selectAll("svg")
      .nodes()
      .forEach((node) => {
        let rect = node.getBoundingClientRect();
        housePositions.push({
          x: rect.left,
          y: rect.top
        });
      });
  })
  .catch((error) => {
    console.log(error);
  });
