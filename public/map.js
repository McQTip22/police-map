// make a map

// load the data
document.addEventListener('DOMContentLoaded', function() {
	const req = new XMLHttpRequest();
	req.open('get', 'https://api.846policebrutality.com/api/incidents', true);

	req.send();

	req.onload = function() {
		let json = JSON.parse(req.responseText);
		let dataset = json.data;

		console.log(dataset)
	};
});

// The select and define svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoAlbersUsa()
    .scale([1000])
    .translate([width / 2, height / 2]);

// Load exernal data and boott
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", "#173977")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")
})