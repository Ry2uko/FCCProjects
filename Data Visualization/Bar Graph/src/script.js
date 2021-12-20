// Project by @Ry2uko

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(response => response.json())
.then(data => drawChart(data['data']));

function drawChart(dataset) {
  const margin = {top: 20, right: 30, bottom: 20, left: 60},
  width = 800,
  height = 400;
  
  // x-axis
  let minDate = new Date(dataset[0][0].split("-")[0]);
  let maxDate = new Date(dataset[dataset.length - 1][0].split("-")[0]);
  let xScale = d3.time.scale()
  .domain([minDate, maxDate])
  .range([0,width]);
  let xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  
  // y-axis
  let yScale = d3.scale.linear()
  .domain([0, d3.max(dataset, d => d[1])])
  .range([height, 0]);
  let yAxis = d3.svg.axis().scale(yScale).orient("left");
  
  // Tooltip
  let tooltip = d3.select("body")
  .append("div")
  .attr({
    class: "tooltip",
    id: "tooltip",
  });
  
  function handleMouseOver(d) {
    tooltip.transition().style('opacity', '0.8');
    tooltip.style({
      'left': `${d3.event.pageX + 30}px`,
      'top': `${d3.event.pageY + 15}px`,
    })
    .attr({
      "data-date": d[0],
      "data-gdp": d[1],
    })
    .html(`
    <p>${d[0]}</p>
    <p>$${d[1]} Billion</p>
    `);
    d3.select(this)
    .style('opacity', '0.1');
  }
  
  function handleMouseMove(d) {
    tooltip.style({
      "left": `${d3.event.pageX + 30}px`,
      "top": `${d3.event.pageY + 15 }px`,
    });
    d3.select(this)
    .style('opacity', '0.8');
  }
  
  function handleMouseOut(d) {
    tooltip.transition().style('opacity', '0');
    d3.select(this)
    .style('opacity', '1');
  }
  
  // svg
  let svg = d3.select("#barGraph")
  .append("svg")
  .attr({
    "width": width + margin.left + margin.right,
    "height": height + margin.top + margin.bottom,
    "id": "barChart",
  })
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // rect
  svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr({
    x: (d,i) => i * (width / dataset.length), // make chart fit to width
    y: d => yScale(d[1]),
    width: (width / dataset.length),
    height: d => height - yScale(d[1]),
    class: "bar",
    "data-date": d => d[0],
    "data-gdp": d => d[1],
  })
  .on({
    "mouseover": handleMouseOver,
    "mousemove": handleMouseMove,
    "mouseout": handleMouseOut
  });
  
  // axes
  svg.append("g")
  .attr({
    id: "x-axis",
    transform: `translate(0, ${height})`,
    class: "axis",
  })
  .call(xAxis);
  svg.append("g")
  .attr({
    id: "y-axis",
    class: "axis",
  })
  .call(yAxis);
   
}