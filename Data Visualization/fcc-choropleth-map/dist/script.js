// Project by @Ry2uko

const width = 960,
      height = 600;

const path = d3.geoPath();

const legendWidth = 200;

const svg = d3.select("#map")
.append("svg")
  .attr("width", width)
  .attr("height", height)
.append("g")
  .attr("class", "counties");

const color = d3.scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range([
    '#fcfbfd',
    '#efedf5',
    '#dadaeb',
    '#bcbddc',
    '#9e9ac8',
    '#807dba',
    '#6a51a3',
    '#54278f',
    '#3f007d'
  ]);

Promise.all([
  "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json",
  "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
].map(i => d3.json(i)))
.then(data => drawMap(data[0], data[1]))
.catch(err => console.log(err));

function drawMap(us, edu) {
  svg.selectAll()
  .data(topojson.feature(us, us.objects.counties).features)
  .enter()
  .append("path")
    .attr("class", "county")
    .attr("data-fips", d => d.id)
    .attr("data-education", d => {
      const result = edu.filter(function(obj) {
        return obj.fips === d.id;
      });
      if(result[0]) {
        return result[0].bachelorsOrHigher;
      }
      console.log(`could find data for: ${d.id}`);
      return 0;
    })
    .attr("fill", d => {
      const result = edu.filter(function(obj){
        return obj.fips === d.id; // filter data that has fips id
      });
      if (result[0]) {
        return color(result[0].bachelorsOrHigher);
      }
      return color(0);
    })
    .attr("d", path)
  .on("mouseover", handleMouseOver)
  .on("mouseleave", handleMouseLeave);
  
  svg.append("path")
  .datum(topojson.mesh(us, us.objects.states, function(a,b) {
    return a !== b;
  }))
    .attr("class", "states")
    .attr("d", path);
  
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
  
  function handleMouseOver(e,d){
    tooltip.style("opacity", 1)
    tooltip.html(() => {
      const result = edu.filter(obj => {
        return obj.fips === d.id;
      });
      if(result[0]) {
        return `${result[0]['area_name']}, ${result[0]['state']}: ${result[0]['bachelorsOrHigher']}%`;
      }
      return 0;
    })
      .attr('data-education', () => {
          const result = edu.filter(obj => {
            return obj.fips === d.id;
          });
          if(result[0]) {
            return result[0].bachelorsOrHigher;
          }
          return 0;
        })
      .style("left", `${e.pageX+50}px`)
      .style("top", `${e.pageY-15}px`);
  }
  
  function handleMouseLeave(e,d){
    tooltip.style("opacity", 0);
  }

  const legend = d3.select("svg")
  .append("g")
    .attr("height", 30)
    .attr("class", "key")
    .attr("id", "legend")
    .attr("transform", "translate(0,30)");
  
  const x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);
  
  legend.selectAll()
  .data(
    color.range().map(function (d) {
      d = color.invertExtent(d);
      if (d[0] === null) {
        d[0] = x.domain()[0];
      }
      if (d[1] === null) {
        d[1] = x.domain()[1];
      }
      return d;
    }))
  .enter()
  .append("rect")
    .attr("height", 15)
    .attr("x", d => x(d[0]))
    .attr("width", d => {
    return d[0] && d[1] ? x(d[1]) - x(d[0]) : x(null);
    })
    .attr("fill", d => color(d[0]));
  
  legend.call(
    d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function (x) {
      return Math.round(x) + '%';
    })
    .tickValues(color.domain())
)
  .selectAll('line')
  .remove();
  
  legend.select(".domain")
  .remove();
  
  legend.selectAll("text")
    .attr("dy", "1.2em")
}