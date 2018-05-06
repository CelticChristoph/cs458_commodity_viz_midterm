d3.csv("./data/commodity_types.csv", function (error1, com_data) {
    var select = d3.select("#comm_data_drop_div")
        .append("select")
        .attr("id", "comm_data_drop_menu")

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
});

function dispCommData(d) {
    console.log(d);
    var commodity = d;

    var pre_svg = d3.select("#data_div").select("#comm_data_bar")

    if(typeof pre_svg !== "undefined" || pre_svg !== null) {
      pre_svg.remove();
    }

    
    

    var margin = {top: 10, right: 10, bottom: 10, left: 20},
    width = (document.getElementById("data_div").offsetWidth) - margin.left - margin.right,
    height = (document.getElementById("data_div").offsetHeight) - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.1);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(0)
        .tickPadding(6);

    var svg = d3.select("#data_div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "data bar_chart")
        .attr("id", "comm_data_bar")
        .attr("viewbox", "0 0 1000 1000")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

    d3.csv("../data/faf_commodity_data_dom_only.csv", function(error, data) {
        var export_totals = d3.nest()
            .key(function(d) { 
                // Validate that origin and destination are not the same and commodity code matches
                // Commodity is hardcoded for testing purposes
                if ( d.dms_orig != d.dms_dest && d.sctg2 == commodity) {
                    return d.dms_orig;
                }
            })
            // Sums up tons_2015 for a specific good in a specific origin state
            .rollup(function(v) { return d3.sum(v, function(d) { return d.tons_2015; }); })
            .entries(data);
        export_totals.pop();
        console.log(export_totals);
        var import_totals
        d3.csv("../data/faf_commodity_data_dom_only.csv", function(error, data) {
            var import_totals = d3.nest()
                .key(function(d) { 
                    // Validate that origin and destination are not the same and commodity code matches
                    // Commodity is hardcoded for testing purposes
                    if ( d.dms_orig != d.dms_dest && d.sctg2 == commodity) {
                        return d.dms_dest;
                    }
                })
                // Sums up tons_2015 for a specific good in a specific origin state
                .rollup(function(v) { return d3.sum(v, function(d) { return d.tons_2015 * -1; }); })
                .entries(data);
            import_totals.pop();
            console.log(import_totals);

            x.domain([d3.min(import_totals, function(d) { return d.values; }), d3.max(export_totals, function(d) { return d.values; })]).nice();
            y.domain(data.map(function(d) { return d.dms_orig; }));
            console.log(d3.min(import_totals, function(d) { return d.values; }));
            console.log(d3.max(export_totals, function(d) { return d.values; }));

            var combined = export_totals.concat(import_totals);

            svg.selectAll(".bar")
                .data(combined)
                .enter()
                .append("rect")
                .attr("class", function(d) { return "bar bar_" + (d.values < 0 ? "negative" : "positive"); })
                .attr("x", function(d) { return x(Math.min(0, d.values)); })
                .attr("y", function(d) { return y(d.key); })
                .attr("width", function(d) { return Math.abs(x(d.values) - x(0)); })
                .attr("height", y.rangeBand());

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + x(0) + ",0)")
                .call(yAxis);
        });
    });
}