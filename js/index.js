d3.csv("./data/commodity_types.csv", function (error, com_data) {
    var select = d3.select("#comm_data_drop_div")
        .append("select")
        .attr("id", "comm_data_drop_menu");

    select
        .on("change", function (d) {
            var value = d3.select(this).property("value");
            dispCommData(value);
        });

    select.selectAll("option")
        .data(com_data)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d.commodity;
        })
        .text(function (d) {
            return d.context;
        })
        .attr("class", "drop_item");

        dispCommData(d3.select("#comm_data_drop_menu").property("value"));
});

function dispCommData(d) {
    // console.log(d);
    var commodity = d;

    var pre_svg = d3.select("#data_div").select("#comm_data_bar")

    if(typeof pre_svg !== "undefined" || pre_svg !== null) {
      pre_svg.remove();
    }

    var margin = {top: 10, right: 20, bottom: 10, left: 20},
    width = (document.getElementById("data_div").offsetWidth) - margin.left - margin.right,
    height = (document.getElementById("data_div").offsetHeight) - margin.top - margin.bottom;

    var svg = d3.select("#data_div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "data bar_chart")
        .attr("id", "comm_data_bar")
        .attr("viewbox", "0 0 1000 1000")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

    var grid = [];
    var x_pos = 50;
    var y_pos = 50;
    var count = 0;
    
    while (count < 51){
        grid[count] = [x_pos, y_pos];
        if (x_pos + 100 > width){
            x_pos = 50;
            y_pos += 100;
        } else {
            x_pos += 100;
        }
        count += 1;
    }

    console.log(grid);
    console.log(grid[0]);
    
    d3.csv("../data/state_data.csv", function(error, data){
        var state_data = {};
        data.forEach(function(d){
            state_data[d.state] = [d.context];
        });
        // console.log(state_data);

	    d3.csv("../data/faf_commodity_data_dom_only.csv", function(error, data) {
	        var export_totals = d3.nest()
	            .key(function(d) {
	                // Validate that origin and destination are not the same and commodity code matches
	                // Commodity is hardcoded for testing purposes
	                // if ( d.dms_orig != d.dms_dest && d.sctg2 == commodity) {
	                if (d.sctg2 == commodity) {
	                    return d.dms_orig;
	                }
	            })
	            // Sums up tons_2015 for a specific good in a specific origin state
	            .rollup(function(v) { return d3.sum(v, function(d) { return d.tons_2015; }); })
	            .entries(data);
	        export_totals.pop();
	        // console.log(export_totals);
	        var import_totals
	        d3.csv("../data/faf_commodity_data_dom_only.csv", function(error, data) {
	            var import_totals = d3.nest()
	                .key(function(d) {
	                    // Validate that origin and destination are not the same and commodity code matches
	                    // Commodity is hardcoded for testing purposes
	                    // if ( d.dms_orig != d.dms_dest && d.sctg2 == commodity) {
	                    if (d.sctg2 == commodity) {
	                        return d.dms_dest;
	                    }
	                })
	                // Sums up tons_2015 for a specific good in a specific origin state
	                .rollup(function(v) { return d3.sum(v, function(d) { return d.tons_2015 * -1; }); })
	                .entries(data);
	            import_totals.pop();
	            // console.log(import_totals);

	            // console.log(d3.min(import_totals, function(d) { return d.values; }));
	            // console.log(d3.max(export_totals, function(d) { return d.values; }));

	            var combined = export_totals.concat(import_totals);

                svg.selectAll("circle")
                    .data(combined)
                    .enter()
                    .append("circle")
                    .attr("class", function(d) { return "bar bar_" + (d.values < 0 ? "negative" : "positive"); })
                    .attr("cy", function(d, i) { return grid[i % 51][1]; })
                    .attr("cx", function(d, i) { return grid[i % 51][0]; })
                    .attr("r", function(d) {return Math.sqrt(Math.abs(d.values)); });
	        });
	    });
	});
}

d3.select(window)
  .on("resize", function() {
      dispCommData(d3.select("#comm_data_drop_menu").property("value"));
  });
