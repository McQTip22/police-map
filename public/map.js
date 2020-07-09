
// select and define svg and path
var svg = d3.select('svg');
	path = d3.geoPath();

//projection from docs
var projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);

//states geojson
d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  svg.append("g")
    	.attr("class", "states")
    	.selectAll("path")
		.data(topojson.feature(us, us.objects.states).features)
		.attr('fill', '#173977')
    	.enter().append("path")
    	.attr("d", path);

  svg.append("path")
    	.attr("class", "state-borders")
    	.attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
});


// load the police brutality data
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
		
        // loop through cities, tally and set size
		var cityCount = [];
        for (let city of mapData) {
            let last = cityCount[cityCount.length - 1];
        copy = last && last.city === city.city ? last.count++ & last.size++ : cityCount.push({ city: `${city.city}`, lat: city.lat, long: city.long, count: 1, size: 12 })
        }

         // Add a scale for bubble size
        var size = d3.scaleLinear()
            .domain([1,100])
            .range([ 4, 50])

		//draw the circles
		svg
			.selectAll('bubbles')
			.data(cityCount)
			.enter()
			.append('circle')
			.attr('cx', function(d) {
				return projection([ d.long, d.lat ])[0];
			})
			.attr('cy', function(d) {
				return projection([ d.long, d.lat ])[1];
			})
			.attr('r', function(d) {
                return size(d.size * 2)
            })
			.style('fill', 'DC143C')
			.attr('stroke', '#DC143C')
			.attr('stroke-width', 2)
			.attr('fill-opacity', 0.8);
	};
});
