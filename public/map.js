// make a map

// load the data
document.addEventListener('DOMContentLoaded', function() {
	const req = new XMLHttpRequest();
	req.open('get', 'https://api.846policebrutality.com/api/incidents', true);

	req.send();

	req.onload = function() {
		let json = JSON.parse(req.responseText);
		let dataset = json.data;
		//make copy for map
		let mapData = dataset.map((d) => ({
			city: `${d.city}, ${d.state}`,
			lat: d.geocoding.lat,
			long: d.geocoding.long
		}));

		//draw the circles
		svg
			.selectAll('myCircles')
			.data(mapData)
			.enter()
			.append('circle')
			.attr('cx', function(d) {
				return projection([ d.long, d.lat ])[0];
			})
			.attr('cy', function(d) {
				return projection([ d.long, d.lat ])[1];
			})
			.attr('r', 14)
			.style('fill', '69b3a2')
			.attr('stroke', '#69b3a2')
			.attr('stroke-width', 3)
			.attr('fill-opacity', 0.4);

		//test
		console.log(mapData);
	};
});

// The select and define svg
var svg = d3.select('svg'),
	width = +svg.attr('width'),
	height = +svg.attr('height');

// Map and projection
var projection = d3.geoAlbersUsa().scale([ 1000 ]).translate([ width / 2, height / 2 ]);

// Load exernal data and boot
d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson', function(data) {
	// Draw the map
	svg
		.append('g')
		.selectAll('path')
		.data(data.features)
		.enter()
		.append('path')
		.attr('fill', '#173977')
		.attr('d', d3.geoPath().projection(projection))
		.style('stroke', 'white');
});
