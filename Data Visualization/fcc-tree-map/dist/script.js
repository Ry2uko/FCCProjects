// Project by @Ry2uko
// color brewed at: https://colorbrewer2.org/#type=qualitative&scheme=Set2&n=7
// https://dev.to/hajarnasr/treemaps-with-d3-js-55p7

fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json")
.then(response => response.json())
.then(data => drawMap(data));

function drawMap(dataset) {
  
  const width = 850,
        height = 550;
  
  const svg = d3.select("#map")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  
  const hierarchy = d3.hierarchy(dataset)
  .sum(d => d.value)
  .sort((a,b) => b.value - a.value);
  const treemap = d3.treemap()
  .size([width, height])
  .padding(1);
  const root = treemap(hierarchy);
  
  const category = dataset.children.map(d => d.name);
  const color = d3.scaleOrdinal()
  .domain(category)
  .range([
    '#66c2a5',
    '#fc8d62',
    '#8da0cb',
    '#e78ac3',
    '#a6d854',
    '#ffd92f',
    '#e5c494',
  ])
  
  svg.selectAll("rect")
  .data(root.leaves())
  .enter()
  .append("rect")
    .attr("class", "tile")
    .attr("x", d => d['x0'])
    .attr("y", d => d['y0'])
    .attr("width", d => d['x1'] - d['x0'])
    .attr("height", d => d['y1'] - d['y0'])
    .attr("fill", d => color(d['data']['category']))
    .attr("data-name", d => d['data']['name'])
    .attr("data-category", d => d['data']['category'])
    .attr("data-value", d => d['data']['value'])
    .style("opacity", 1)
  .on("mouseover", handleMouseOver)
  .on("mouseleave", handleMouseLeave);
  
  const tooltip = d3.select("body")
  .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("background", "black")
    .style("color", "white")
    .style("border-radius", "0.4rem")
    .style("padding", "6px");
  
  function handleMouseOver(e,d) {
    tooltip.transition().style("opacity", 1);
    const movieVal = d['data']['value'].split("")
    .reverse().map((d,i) => {
      if((i+1) % 3 === 0 && i !== 0) return "," + d;
      return d
    }).reverse()
    .join("").slice(1); // ex. 2523432 => 2,523,432
    tooltip.html(`
    <p>${d['data']['name']}</p>
    <p>${d['data']['category']}</p>
    <p>$${movieVal}</p>
    `)
    .attr("data-value", d['data']['value'])
    .style("left", `${e.pageX-75}px`)
    .style("top", `${e.pageY-135}px`);
    
    d3.select(this)
    .style("opacity", 0.6);
  }
  function handleMouseLeave(e,d) {
    tooltip.transition().style("opacity", 0);
    d3.select(this)
    .style("opacity", 1);
  }
  
  const legendWidth = 850,
        legendHeight = 140;
  let categories = root.leaves().map(function (nodes) {
      return nodes.data.category;
    });
    categories = categories.filter(function (category, index, self) {
      return self.indexOf(category) === index;
    });
  const legend = d3.select("#map")
  .append("svg")
    .attr("id", "legend")
    .attr("width", legendWidth)
    .attr("height", legendHeight);
    
  legend.selectAll("rect")
  .data(categories)
  .enter()
  .append("rect")
    .attr("x", (d,i) => i*110)
    .attr("y", 40)
    .attr("width", 17)
    .attr("height", 17)
    .attr("fill", d => color(d))
    .attr("class", "legend-item")
  
  legend.selectAll("text")
  .data(categories)
  .enter()
  .append("text")
    .attr("x", (d,i) => (i*110)+25)
    .attr("y", 55)
    .text(d => d)
}