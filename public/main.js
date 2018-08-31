
const width = 1000
const height = 900
const padding = 100
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
	.style('padding', '60 20 140 200')

let tooltip = d3
	.select('.chart')
	.append('div')
	.attr('id', 'tooltip')




function createMap(err, mapData, degreeData) {
	if (err) {
		throw err
	}
	svg.append('g')
		.attr('class', 'county')
		.selectAll('path')
		.data(topojson.feature(mapData, mapData.objects.counties).features)
		.enter()
		.append('path')
		.attr('d', path)
		.attr('fill', (d) => {
			let educationObject = degreeData.filter((degreeObj) => {
				let singleDegreeObj = degreeObj.fips == d.id

				return singleDegreeObj
			})

			return  colorScale(educationObject[0].bachelorsOrHigher)
		})
		.attr('data-fips', (d) => {
			return d.id
		})
		.attr('data-education', (d) => {
			let educationObject = degreeData.filter((degreeObj) => {
				let singleDegreeObj = degreeObj.fips == d.id

				return singleDegreeObj
			})

			return educationObject[0].bachelorsOrHigher
		})
		.on('mouseover', (d) => {
			tooltip
				.transition()
				.style('opacity', 1)
				.style('visibility', 'visible')
			tooltip
				.html( () => {
					let educationObject = degreeData.filter((degreeObj) => {
						let singleDegreeObj = degreeObj.fips == d.id

						return singleDegreeObj
					})
					let toolTipText = educationObject[0].area_name +', '+ educationObject[0].state +'</br>'+  educationObject[0].bachelorsOrHigher +'% with Bachelor or greater.'

					return toolTipText
				})
				.style('left', (d3.event.pageX + 10) + 'px')
				.style('top', (d3.event.pageY + 10) + 'px')
		})

	svg.on('mouseout', () => {
		tooltip.transition().style('visibility', 'hidden')
	})

	svg.append('path')
		.datum(topojson.mesh(mapData, mapData.objects.states, (a, b) => {

			 return a != b }))
		.attr('class', 'states')
		.attr('d', path)

	svg.append('text')
		.attr('id', 'title')
		.attr('x', 20)
		.attr('y', -20)
		.text('U.S. Bacholor degree(or higher) attainment by county.')

}

let legend =	svg
	.selectAll('.legend')
	.data(colorRange)
	.enter()
	.append('g')
	    .attr('id', 'legend')
	    .attr('transform', (d , i) => {

	      return 'translate('+(-700 + i * 50)+',' + (0)+ ')'
	    })

legend
	.append('rect')
	.attr('x', width - 50)
	.attr('width', 50)
	.attr('height', 15)
	.style('fill',  color => {

		 return color
	})

legend
	.append('text')
	.attr('x', width - 50)
	.attr('y', 30)
	.text((d , i) => {
		let legendText =  colorDomain[i]

		return legendText + '%'
	})

d3.queue()
	.defer(d3.json, 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json')
	.defer(d3.json, 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json')
	.await(createMap)
