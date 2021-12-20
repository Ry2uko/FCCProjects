// Project by @Ry2uko
// built this project similar to this: https://www.d3-graph-gallery.com/graph/heatmap_style.html
// color brewed at: https://colorbrewer2.org/#type=sequential&scheme=OrRd&n=3

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
.then(response => response.json())
.then(data => drawGraph(data));

function drawGraph(dataset) {
  const margin = {top: 20, right: 70, bottom: 140, left: 70};
  const width = 2040,
        height = 490;
  
  const svg = d3.select("#heatmap")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
  
  const months = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December",
  ];
  
  const minDate = dataset.monthlyVariance[0].year;
  const maxDate = dataset.monthlyVariance[dataset.monthlyVariance.length - 1].year;
  
  const x = d3.scaleLinear()
  .domain([minDate, maxDate])
  .range([0, width]);
  const y = d3.scaleBand()
  .domain([...Array(12).keys()].map(i => i+1))
  .range([0, height]);
  
  svg.append("g")
    .style("font", "12px Helvetica, sans-serif")
    .attr("transform", `translate(0, ${height})`)
    .attr("id", "x-axis")
  .call(d3.axisBottom(x)
        .tickSize(0)
       .tickFormat(d => {
    return d.toString();
  }));
  svg.append("g")
    .style("font", "12px Helvetica, sans-serif")
    .attr("id", "y-axis")
  .call(d3.axisLeft(y)
        .tickSize(0)
        .tickFormat(d => {
    return months[d-1];
  }));
  
  svg.select("#x-axis")
  .selectAll("text")
    .attr("dy", "1.3em")
  svg.select("#y-axis")
  .selectAll("text")
    .attr("dx", "-0.3em")
  
  const brewed = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061'].reverse();
  //base temp: 8.66°
  const baseTemp = dataset.baseTemperature;
  
  const getRound = (v) => Math.round((v+baseTemp)*10)/10;
  
  const colorMap = d3.scaleQuantize()
  .domain(d3.extent(dataset.monthlyVariance, d => d.variance).map(i => getRound(i)))
  .range(brewed);
  
  svg.selectAll()
  .data(dataset.monthlyVariance)
  .enter()
  .append("rect")
    .attr("x", d => x(d.year))
    .attr("y", d => y(d.month))
    .attr("width", 10)
    .attr("height", y.bandwidth()+1)
    .attr("fill", d => colorMap(getRound(d.variance)))
    .attr("class", "cell")
    .attr("data-month", d => d.month-1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => getRound(d.variance))
  .on("mouseover", handleMouseOver)
  .on("mouseleave", handleMouseLeave)
  .on("mousemove", handleMouseMove);
  
  
  // just some complex math
  const legendData = [];
  const step = (Math.round(((colorMap.domain()[1] - colorMap.domain()[0]) / brewed.length)*10)/10)+0.1;
  const base = colorMap.domain()[0];
  for(let i = 0; i < brewed.length; i++) {
    legendData.push(base + i * step);
  }

  const legendMargin = {bottom: 30},
        legendWidth = 400,
        legendHeight = 20;
  const legendScale = d3.scaleLinear()
  .domain(d3.extent(legendData))
  .range([0, legendWidth]);
  const rectWidth = (legendWidth / legendData.length);
  
  const legend = d3.select("svg")
  .append("g")
    .attr("width", legendWidth)
    .attr("height", legendHeight + legendMargin.bottom)
    .attr("id", "legend")
    .attr("transform", `translate(${margin.left+50}, ${height + margin.bottom + margin.top - 50})`);
  
  
  legend.selectAll()
  .data(legendData)
  .enter()
  .append("rect")
    .attr("x", d => legendScale(d))
    .attr("width", rectWidth)
    .attr("height", legendHeight+3)
    .attr("fill", d => colorMap(d));

  d3.select("#legend")
  .selectAll()
  .data(legendData.map(i => Math.round(i*10)/10))
  .enter()
  .append("text")
    .attr("x", d => {
    if(d.toString().length === 3) {
      return legendScale(d) + (rectWidth / 2)-10;
    } else {
      return legendScale(d) + (rectWidth / 2)-13;
    }
  })
    .attr("y", d => legendMargin.bottom+15)
    .style("font", "14px Helvetica, sans-serif")
    .text(d => {
    if(d === Math.round(d3.max(legendData)*10)/10) {
      return colorMap.domain()[1]; // display max
    } else {
      return d;
    }
  });
  
  const tooltip = d3.select("#heatmap")
  .append("div")
    .style("opacity", 0)
    .style("position", "absolute")
    .attr("id", "tooltip")
    .style("background", "black")
    .style("color", "white")
    .style("border-radius", "0.4rem")
    .style("padding", "11px") 
    
  function handleMouseOver(e,d) {
    tooltip.transition().style("opacity", 1);
  }
  function handleMouseMove(e,d) {
    const xpos = parseInt(d3.select(this).attr("x"));
    const ypos = parseInt(d3.select(this).attr("y"));
    tooltip
    .html(`<p>${months[d.month-1]} ${d.year}</p>
    <center><p>${getRound(d.variance)}°C</p></center>`)
    .style("left", `${xpos+40}px`)
    .style("top", `${ypos-95}px`)
    .attr("data-year", d.year);
  }
  function handleMouseLeave(e,d) {
    tooltip.transition().style("opacity", 0);
  }
}