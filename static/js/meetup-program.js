$(document).ready(function(){

	var margin = {top: 20, right: 20, bottom: 30, left: 50}
	    , width = 960 - margin.left - margin.right
	    , height = 500 - margin.top - margin.bottom
	    , data;

	var parseDate = d3.time.format("%d-%b-%y");

	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()		
	    .interpolate('cardinal')
	    .x(function(d) { return x(d[0]); })
	    .y(function(d) { return y(d[1]); })
	    
	var svg = d3.select("#timeseries").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	    

	d3.json('/api/meetups/program',function(res){
		data = formatData(res.data.events)
		yeses = prepData(data, 'yes_rsvps');

		update(yeses)
	});

	$('li').click(function(){
		var key = $(this).attr('id')
			, prepped = prepData(data, key)

		date(prepped)
	})

	function update(datas){

		x.domain(d3.extent(datas, function(d) { return d[0]; }));
		y.domain(d3.extent(datas, function(d) { return d[1]; }));

		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Value");

		svg.append("path")
		  .datum(datas)
		  .attr("class", "line")
		  .attr("d", line)		 

		svg.selectAll('.circ')
			.data(datas).enter()
			.append("circle")		
				.attr('cx', function(d){
					return x(d[0])
				})
				.attr('cy', function(d){
					return y(d[1])
				})
				.attr('r', 5)

	}

	function date(dat){
		x.domain(d3.extent(dat, function(d) { return d[0]; }));
		y.domain(d3.extent(dat, function(d) { return d[1]; }));		

		d3.selectAll('.y')
			.datum(dat)
			.transition()
			.call(yAxis)

		d3.selectAll('.line')
			.datum(dat)
			.transition()
				.duration(250)
				.attr('d', line)

		d3.selectAll('circle')
			.data(dat)
			.transition()
				.attr('cy', function(d){
					return y(d[1])
				})
	}

	function prepData(data, key){
		return _.zip(data.timestamps, data[key])
	}

	function formatData(meetups){
		var ratings = _.pluck(meetups, 'rating')
		return {
			'timestamps': _.pluck(meetups, 'time'),
			'yes_rsvps': _.pluck(meetups, 'yes_rsvp_count'),
			'maybe_rsvps': _.pluck(meetups, 'maybe_rsvp_count'),
			'waitlists': _.pluck(meetups, 'waitlist_count'),
			'headcounts': _.pluck(meetups, 'headcount'),
			'avg_ratings': _.pluck(ratings, 'average'),
			'ratings_count': _.pluck(ratings, 'count'),
		}
	}
});