// Hacked by Ry2uko :p

function fetchData(url) {
  return $.ajax({
    url,
    type: 'GET'
  });
}

$(document).ready(async function(){
  let nodes = [], 
      links = [], 
      linksCodeRef = {},  // for finding which countries share border easier
      linksObj;
  
  // fetch data
  try {
    let fetchedData = await fetchData('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json');
    nodes = JSON.parse(fetchedData).nodes;
    linksObj = JSON.parse(fetchedData).links;
  } catch(err) {
    console.error(err);
    return;
  }

  // replace index with country names and codes
  linksObj.forEach(obj => {
    let linkCountryObj = {};
    linkCountryObj.target = nodes[obj.target].country;
    linkCountryObj.source = nodes[obj.source].country;
    links.push(linkCountryObj);
    linksCodeRef[`${nodes[obj.target].code}-${nodes[obj.source].code}`] = 1; // ex: 'ph-my': 1
  });
  
  function drag(simulation) {
    function dragStarted(event) {
      if (!event.active) simulation.alphaTarget(0.1).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      if(!event.active) simulation.alphaTarget(0)
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragended);
  }
  
  let height = window.innerHeight-10;
  let width = window.innerWidth;
   
  const svg = d3.select('#chart')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', '#000');
  
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.country))
    .force('charge', d3.forceManyBody().strength(-0.75))
    .force('center', d3.forceCenter(width/2, height/2))
    .force('collide', d3.forceCollide(20));
  
  const link = svg.selectAll('.link')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
  const node = svg
    .select('.flags')
    .data(nodes)
    .enter()
    .append('span')
    .attr('class', d => `flag flag-${d.code}`)
    .style('transform', 'scale(0.8)')
    .call(drag(simulation));
  
  
  function checkBorder(a, b) {
    // get country code from a
    let targetCode = a.target.classList[1].split('-')[1];
    let sourceCode = b.code;
    return (
      linksCodeRef[`${targetCode}-${sourceCode}`] || linksCodeRef[`${sourceCode}-${targetCode}`] 
    );
  }

  const bordering = d3.select('.country-bordering-container');
  
  node
    .on('mouseover', function(d) {
      let borderingHtml = '';
      let dCountryCode, dCountryName;
      
      dCountryCode = d.target.classList[1].split('-')[1];
     
      nodes.forEach(countryObj => {
        if (countryObj.code === dCountryCode) {
          dCountryName = countryObj.country;
          return;
        }
      });
    
      borderingHtml += `
          <div class="country-bordering active">
            <span class="flag flag-${dCountryCode}"></span>
            <div class="label-container">
              <span class="country-label">${dCountryName}</span>
            </div>
          </div>
          `;
    
      node.style('transform', function(o) {
        if(checkBorder(d, o)) {
          borderingHtml += `
          <div class="country-bordering">
            <span class="flag flag-${o.code}"></span>
            <div class="label-container">
              <span class="country-label">${o.country}</span>
            </div>
          </div>
          `;
          return "scale(1.2)";
        } else {
          return "scale(0.55)";
        }
      });
      
      link.classed('link-active', function(o) {
        let targetCode = d.target.classList[1].split('-')[1];
        return o.source.code === targetCode || o.target.code === targetCode ? true : false;
      });
      
      d3.select(this).style('transform', 'scale(1.1)');
      bordering.html(borderingHtml).style("opacity", 1);
    })
    .on('mouseout', function(d) {
      bordering.style("opacity", 0);
      link.classed("link-active", false);
      node.style("transform", "scale(0.8)");
    });
    
  
  simulation.on('tick', () => {
    link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

    node
      .style("left", (d) => d.x - 16 + "px")
      .style("top", (d) => d.y - 16 + "px");
  });

});