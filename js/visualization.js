//functions for map and scatter plot visualization
const stateColors = {
  "ALABAMA": "#FF5733",
  "ALASKA": "#33FF57",
  "ARIZONA": "#5733FF",
  "ARKANSAS": "#FF33A1",
  "CALIFORNIA": "#FF8C00",
  "COLORADO": "#008000",
  "CONNECTICUT": "#800080",
  "DELAWARE": "#00CED1",
  "FLORIDA": "#FFD700",
  "GEORGIA": "#8B4513",
  "HAWAII": "#4B0082",
  "IDAHO": "#B22222",
  "ILLINOIS": "#8A2BE2",
  "INDIANA": "#2E8B57",
  "IOWA": "#800000",
  "KANSAS": "#FF1493",
  "KENTUCKY": "#1E90FF",
  "LOUISIANA": "#20B2AA",
  "MAINE": "#FF4500",
  "MARYLAND": "#7FFF00",
  "MASSACHUSETTS": "#9932CC",
  "MICHIGAN": "#FF6347",
  "MINNESOTA": "#00FA9A",
  "MISSISSIPPI": "#6A5ACD",
  "MISSOURI": "#FFA500",
  "MONTANA": "#00BFFF",
  "NEBRASKA": "#8B0000",
  "NEVADA": "#9400D3",
  "NEW_HAMPSHIRE": "#556B2F",
  "NEW_JERSEY": "#4B0082",
  "NEW_MEXICO": "#00FF7F",
  "NEW_YORK": "#8B4513",
  "NORTH_CAROLINA": "#2F4F4F",
  "NORTH_DAKOTA": "#800080",
  "OHIO": "#FF4500",
  "OKLAHOMA": "#00FF7F",
  "OREGON": "#008080",
  "PENNSYLVANIA": "#FF6347",
  "RHODE_ISLAND": "#4682B4",
  "SOUTH_CAROLINA": "#FF1493",
  "SOUTH_DAKOTA": "#FFD700",
  "TENNESSEE": "#32CD32",
  "TEXAS": "#FFA07A",
  "UTAH": "#9932CC",
  "VERMONT": "#00BFFF",
  "VIRGINIA": "#FFD700",
  "WASHINGTON": "#4682B4",
  "WEST_VIRGINIA": "#20B2AA",
  "WISCONSIN": "#8A2BE2",
  "WYOMING": "#FF8C00",
  "DISTRICT_OF_COLUMBIA": "#808080"
};

var svgStatesExpen = d3.select("#chart1").select("#states"),
    svgBoundaryExpen = d3.select("#chart1").select("#boundary"),
    svgStatesScore = d3.select("#chart2").select("#states"),
    svgBoundaryScore = d3.select("#chart2").select("#boundary")

var width = window.innerWidth, 
  height = window.innerHeight;
var projection = d3.geoAlbersUsa()
  .translate([width / 3, height / 3]);  
var path = d3.geoPath()
    .projection(projection);  

var educations = [],
    boundary = [],
    topologies = [];

var state = [];

var cpi_1913 = [144.5,148.2,152.4,156.9,160.5,163.0,166.6,172.2,177.1,179.9,184.0,188.9,195.3,201.6,207.3,215.3,214.5,218.1,224.9,229.6,233.0,236.7,237.0,240.0],
    cpi_2016 = [];

var minExpen = Infinity,
    maxExpen = -Infinity,
    minScore = Infinity,
    maxScore = -Infinity;

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width3 = 0.7*width - margin.left - margin.right,
    height3 = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgScatter = d3.select("#scatter-plot")
  .append("svg")
  .attr("width", width3 + margin.left + margin.right)
  .attr("height", height3 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var dots = svgScatter.append('g');

Promise.all([
  d3.csv("data/data.csv"),
  d3.json("data/usa.json"),
  d3.json("data/states.json")
]).then((data) => {

  cpi_2016 = cpi_1913.map(num => num/240.0);

  for (i=1; i<=24; i++) {
    educations.push(data[0].slice(51*i,51*i+51));
    for (j=0; j<51; j++) {
      minExpen = Math.min(minExpen, educations[i-1][j].TOTAL_EXPENDITURE/cpi_2016[i-1]/educations[i-1][j].ENROLL);
      maxExpen = Math.max(maxExpen, educations[i-1][j].TOTAL_EXPENDITURE/cpi_2016[i-1]/educations[i-1][j].ENROLL);
    }
  }

  for (i=2003-1993; i<=2015-1993; i+=2) {
    for (j=0; j<51; j++) {
      minScore = Math.min(minScore, getAverageScore(educations[i][j]));
      maxScore = Math.max(maxScore, getAverageScore(educations[i][j]));
    }
  }

 

  boundary = data[1];
  topologies = data[2];

  state = topojson.feature(topologies[12], topologies[12].objects.stdin);


  drawMapExpen(1993);
  drawMapScore(2003);
  drawScatterPlot(2003);

  d3.select("#year1").text(1993);
  d3.select("#year2").text(2003);
  d3.select("#year3").text(2003);


}).catch((err) => {

})


var slider1 = d3
  .sliderHorizontal()
  .min(1993)
  .max(2016)
  .step(1)
  .width(500)
  .displayValue(false)
  .on('onchange', (val) => {
    d3.select("#year1").text(val);
    svgStatesExpen.selectAll("path").remove();
    drawMapExpen(val);

  });

d3.select('#slider1')
  .append('svg')
  .attr('width', 1000)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(250,30)')
  .call(slider1);

var slider2 = d3
  .sliderHorizontal()
  .min(2003)
  .max(2015)
  .step(2)
  .width(500)
  .displayValue(false)
  .on('onchange', (val) => {
    d3.select("#year2").text(val);

    svgStatesScore.selectAll("path").remove();
    drawMapScore(val);

  });

d3.select('#slider2')
  .append('svg')
  .attr('width', 1000)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(250,30)')
  .call(slider2);

var slider3 = d3
  .sliderHorizontal()
  .min(2003)
  .max(2015)
  .step(2)
  .width(500)
  .displayValue(false)
  .on('onchange', (val) => {
    d3.select("#year3").text(val);
    dots.selectAll("circle").remove();
    drawScatterPlot(val);
  });

d3.select('#slider3')
  .append('svg')
  .attr('width', 1000)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(250,30)')
  .call(slider3);



drawMapExpen = (year) => {

  var curEdu = educations[year-1993]

  var eduDictionary = {};

  curEdu.forEach(row => {
    const key = row.STATE;
    eduDictionary[key] = row;
  });

  svgBoundaryExpen.selectAll("path")
    .data(boundary.features)
    .enter()
    .append("path")
    .attr("d", path)

  svgStatesExpen.selectAll("path")  
    .data(state.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", (d) => { 

      var myColor = d3.scaleLinear().domain([minExpen, maxExpen])
        .range(["white", "blue"])
      var name = d.properties.STATENAM.replace(" Territory", "").toUpperCase().replace(/ /g, "_"); 
      return myColor(getConvertedExpenditure(eduDictionary[name], year));

    })
    .append("svg:title")
    .text((d) => { 
      var name = d.properties.STATENAM.replace(" Territory", "").toUpperCase().replace(/ /g, "_"); 
      return "$"+1000*getConvertedExpenditure(eduDictionary[name], year);
    });

}

drawMapScore = (year) => {

  var curEdu = educations[year-1993]

  var eduDictionary = {};

  curEdu.forEach(row => {
    const key = row.STATE;
    eduDictionary[key] = row;
  });

  svgBoundaryScore.selectAll("path")
    .data(boundary.features)
    .enter()
    .append("path")
    .attr("d", path)
    
  
  svgStatesScore.selectAll("path")  
    .data(state.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", (d) => { 

      var myColor = d3.scaleLinear().domain([minScore, maxScore])
        .range(["white", "purple"])
      var name = d.properties.STATENAM.replace(" Territory", "").toUpperCase().replace(/ /g, "_"); 
      return myColor(getAverageScore(eduDictionary[name]));

    })
    .append("svg:title")
    .text((d) => { 
      var name = d.properties.STATENAM.replace(" Territory", "").toUpperCase().replace(/ /g, "_"); 
      return getAverageScore(eduDictionary[name]);
    });

}

getConvertedExpenditure = (data, year) => {
  return parseFloat(data.TOTAL_EXPENDITURE)/cpi_2016[year-1993]/parseFloat(data.ENROLL);
}

getAverageScore = (data) => {
  return (parseFloat(data.AVG_READING_4_SCORE)+parseFloat(data.AVG_READING_8_SCORE)+parseFloat(data.AVG_MATH_4_SCORE)+parseFloat(data.AVG_MATH_8_SCORE))/4;
}

drawScatterPlot = (year) => {
  var curEdu = educations[year-1993];

  //alert(JSON.stringify(curEdu));

  // Add X axis
  var x = d3.scaleLinear()
    .domain([6, 35])
    .range([ 0, width3 ]);

  svgScatter.append("g")
    .attr("transform", `translate(0, ${height3})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([210, 270])
    .range([ height3, 0]);
  
  svgScatter.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  dots.selectAll("dot")
    .data(curEdu)
    .join("circle")
      .attr("cx", d => x(getConvertedExpenditure(d, year)))
      .attr("cy", d => y(getAverageScore(d)))
      .attr("r", d => Math.pow(d.ENROLL, 1/2)/100)
      .style("fill", d => stateColors[d.STATE])
      .append("svg:title")
      .text((d) => { 
        return d.STATE;
      });

}


