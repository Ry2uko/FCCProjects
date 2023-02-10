// Hacked by Ry2uko :p
const geoData = 'https://gist.githubusercontent.com/d3noob/f052595e2f92c0da677c67d5cf6f98a1/raw/7c6afcb0041e28196fd28d463fd832592b2bf009/world-110m2.json';
const meteorsData = 'https://data.nasa.gov/resource/y77d-th95.geojson';

// Setup
const width = window.innerWidth+400,
      height = window.innerHeight+400;

const svg = d3.select('#chart')
  .attr('width', width)
  .attr('height', height)
  .append('g');

const projection = d3.geoMercator()
  .scale((width - 3) / (2 * Math.PI))
  .translate([width / 2, height / 2]);

const path = d3.geoPath()
  .projection(projection);

const tooltip = d3.select('#tooltip').style('opacity', 0);

// Draw map
d3.json(geoData).then(topology => {
  svg.selectAll('path')
    .data(topojson.feature(topology, topology.objects.countries).features)
    .enter().append('path')
    .attr('d', path)
    .attr('fill', 'rgba(0, 128, 255, 0.9)')
    .style('stroke', '#111')
    .style('stroke-width', 0.3);
});

// Draw bubbles
d3.json(meteorsData).then(meteors => {
  
  meteors.features.sort((a,b) => {
    return new Date(a.properties.year) - new Date(b.properties.year);
  });
  
  // Sort so that the bigger bubbles won't overlap the smaller ones
  meteors.features.sort(function(a,b) {
    return b.properties.mass - a.properties.mass;
  });
  
  svg.append('g')
  .selectAll('path')
  .data(meteors.features)
  .enter().append('circle')
  .attr('cx', d => projection([d.properties.reclong, d.properties.reclat])[0])
  .attr('cy', d => projection([d.properties.reclong, d.properties.reclat])[1])
  .attr('r', d => {
    const range = 718750/2/2;

    if (d.properties.mass <= range) return 2;
    else if (d.properties.mass <= range*2) return 20;
    else if (d.properties.mass <= range*3) return 30;
    else if (d.properties.mass <= range*20) return 40;
    else if (d.properties.mass <= range*100) return 50;
    return 50;
  })
  .attr('fill-opacity', d => {
    const range = 718750/2/2;
    if (d.properties.mass <= range) return 0.9;
    return 0.5;
  })
  .attr('stroke-width', 1.2)
  .attr('stroke', '#f80')
  .attr('fill', '#f80')
  .on('mouseover', function(evnt, d) {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0.9);
    tooltip.html(`
      <div class="property-div"><span class="property"><b>fall</b>: ${d.properties.fall}</span></div>
      <div class="property-div"><span class="property"><b>mass</b>: ${d.properties.mass}</span></div>
      <div class="property-div"><span class="property"><b>name</b>: ${d.properties.name}</span></div>
      <div class="property-div"><span class="property"><b>nametype</b>: ${d.properties.nametype}</span></div>
      <div class="property-div"><span class="property"><b>recclass</b>: ${d.properties.recclass}</span></div>
      <div class="property-div"><span class="property"><b>reclat</b>: ${d.properties.reclat}</span></div>
      <div class="property-div"><span class="property"><b>year</b>: ${d.properties.year}</span></div>
    `)
      .style('left', `${evnt.pageX+45}px`)
      .style('top', `${evnt.pageY/1.5}px`);
  })
  .on('mouseout', (evnt, d) => {
    tooltip.transition()
      .duration(300)
      .style('opacity', 0);
  });
});



