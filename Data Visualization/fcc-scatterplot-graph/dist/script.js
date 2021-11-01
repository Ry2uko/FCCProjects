// Project by @Ry2uko

/* same setup as last project except for the graph */

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((data) => drawGraph(data));

function drawGraph(dataset) {
  const margin = { top: 20, right: 30, bottom: 20, left: 60 };
  const width = 900 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  const formatTime = d3.timeFormat("%M:%S");
  const color = d3.scaleOrdinal()
  .domain([0,1,true,false])
  .range(d3.schemeCategory10);
  
  // x-axis
  let xScale = d3
    .scaleLinear()
    .domain([
      // push by 1 tick
      d3.min(dataset, (d) => d["Year"] - 1),
      d3.max(dataset, (d) => d["Year"] + 1)
    ])
    .range([0, width]);

  // 1,994 => 1994
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  // y-axis
  dataset.forEach((data) => {
    let parsedTime = data["Time"].split(":");
    data["Time"] = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });

  let yScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, (d) => d["Time"]))
    .range([0, height]);
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  // tooltip
  let tooltip = d3.select('body')
  .append("div")
  .attr("id", "tooltip")
  
  function handleMouseOver(e, d) {
    tooltip.transition()
    .style("opacity", "0.8");
    
    tooltip.style("left", `${e.pageX + 30}px`)
    .style("top", `${e.pageY + 15}px`)
    .attr("data-year", d["Year"])
    .html(`
    <p>${d["Name"]}: ${d["Nationality"]}</p>
    <p>Year: ${d["Year"]}</p>
    <p>Time: ${formatTime(d["Time"])}</p>
    <br/>
    <p>${d["Doping"]}</p>
    `)
    
    d3.select(this)
    .style("opacity", "0.7");
  }
  
  function handleMouseOut(e, d) {
    tooltip.transition()
    .style("opacity", "0");
    
    d3.select(this)
    .style("opacity", "0.9")
  }
  
  // svg
  let svg = d3.select("#barGraph")
    .append("svg")
    .attr("width", `${width + margin.left + margin.right}px`)
    .attr("height", `${height + margin.top + margin.bottom}px`)
    .attr("id", "scatterplotGraph")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // axes
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "axis")
    .call(xAxis);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("class", "axis")
    .call(yAxis);

  // circle
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d["Year"]))
    .attr("cy", d => yScale(d["Time"]))
    .attr("data-xvalue", d => d["Year"])
    .attr("data-yvalue", d => d["Time"].toISOString())
    .attr("r", 7)
    .attr("fill", d => color(d["Doping"] !== ""))
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
  
  // legend
  let legendCon = svg.append("g")
  .attr("id", "legend");
  
  let legend = legendCon.selectAll("#legend")
  .data(color.domain().slice(2))
  .enter()
  .append("g")
  .attr("transform", (d,i) => {
    return `translate(20,${height - 400 - i * 22})`;
  });
  
  legend.append("rect")
  .attr("x", width - 14)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", color);
  
  legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9)
  .attr("dy", "0.35em")
  .style("text-anchor", "end")
  .text(d => {
    if(d) {
      return "Riders with doping allegations";
    } else {
      return "No doping allegations"
    }
  })
}