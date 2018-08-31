
const width = 1000
const height = 900
const padding = 50
let path = d3.geoPath()
let degree = d3.map()

const colorDomain = [ 5,10,20,30,40,50,60,70,80,90 ]
const colorRange = [
	'#e6ffe6',
	'#ccffcc',
	'#b3ffb3',
	'#80ff80',
	'#4dff4d',
	'#33ff33',
	'#00e600',
	'#00cc00',
	'#00b300',
	'#008000'
		 ]

let colorScale = d3.scaleThreshold()
	          				.domain(colorDomain)
	          				.range(colorRange)

let svg = d3.select('.chart')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.style('padding', padding)


function createMap(error, mapData, degreeData) {
	if (error) {
		throw error
	}

	let colorTest = colorScale.invertExtent('#ccffcc')

	svg.append('g')
		.attr('class', 'county')
		.selectAll('path')
		.data(topojson.feature(mapData, mapData.objects.counties).features)
		.enter()
		.append('path')
		.attr('d', path)
		.attr('fill', 'navy')

	svg.append('path')
		.datum(topojson.mesh(mapData, mapData.objects.states, (a, b) => {
			 return a != b }))
		.attr('class', 'states')
		.attr('d', path)
}

d3.queue()
	.defer(d3.json, 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json')
	.defer(d3.json, 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json')
	.await(createMap)
