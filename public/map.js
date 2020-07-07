// make a map


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

// load the data
document.addEventListener('DOMContentLoaded', function() {
	const req = new XMLHttpRequest();
	req.open('get', 'https://api.846policebrutality.com/api/incidents', true);

	req.send();

	req.onload = function() {
		let json = JSON.parse(req.responseText);
		let dataset = json.data;
		//make copy for map and define what keys to use
		let mapData = dataset.map((d) => ({
			city: `${d.city}, ${d.state}`,
			lat: d.geocoding.lat,
			long: d.geocoding.long
        }));
        //sort by city
        mapData.sort((a, b) => {
            return a.city > b.city ? 1 : -1;
        });
        //make new array to fill
        var cityCount = [];
        // loop through cities, tally and set size
        for (let city of mapData) {
            let last = cityCount[cityCount.length - 1];
        copy = last && last.city === city.city ? last.count++ & last.size++ : cityCount.push({ city: `${city.city}`, lat: city.lat, long: city.long, count: 1, size: 12 })
        }

		//draw the circles
		svg
			.selectAll('myCircles')
			.data(cityCount)
			.enter()
			.append('circle')
			.attr('cx', function(d) {
				return projection([ d.long, d.lat ])[0];
			})
			.attr('cy', function(d) {
				return projection([ d.long, d.lat ])[1];
			})
			.attr('r', 14)
			.style('fill', 'DC143C')
			.attr('stroke', '#DC143C')
			.attr('stroke-width', 1)
			.attr('fill-opacity', 0.6);

		//test
		console.log(cityCount);
	};
});
