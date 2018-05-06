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

    var margin = {top: 10, right: 0, bottom: 0, left: 0},
        width = 400 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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

    d3.select("#data_div").select("svg").remove();

    var svg = d3.select("#data_div").append("svg")
        .attr("id", "graph")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("./data/faf_commodity_data_dom_only.csv", function(faf_data) {
        // Pulls out sum weight of specific good from State given commodity code
        // Data returned in freight_totals in a list with indexes of {dms_orig, sum(tons_2015)}
        var export_totals = d3.nest()
            .key(function(d) { 
                // Validate that origin and destination are not the same and commodity code matches
                if ( d.dms_orig != d.dms_dest && d.sctg2 == commodity) {
                    return d.dms_orig;
                }})
            // Sums up tons_2015 for a specific good in a specific origin state
            .rollup(function(v) { return d3.sum(v, function(d) { return d.tons_2015; }); })
            .entries(faf_data);
        export_totals.pop();
        console.log(export_totals);
        var import_totals = d3.nest()
            .key(function(d) { 
                // Validate that origin and destination are not the same and commodity code matches
                if ( d.dms_orig != d.dms_dest && d.sctg2 == commodity) {
                    return d.dms_dest;
                }})
            // Sums up tons_2015 for a specific good in a specific destination state
            .rollup(function(v) { return d3.sum(v, function(d) { return d.tons_2015 * -1; }); })
            .entries(faf_data);
        import_totals.pop();
        console.log(import_totals);

        

        x.domain([
            d3.min(import_totals, function(d) {return d.values}),
            d3.max(export_totals, function(d) {return d.values})
        ]);
        if(Object.keys(export_totals).length > Object.keys(import_totals).length){
            y.domain(export_totals.map(function(d) { return export_totals.key; }));
        } else {
            y.domain(import_totals.map(function(d) { return export_totals.key; }));
        }

        svg.selectAll(".bar")
            .data(export_totals)
            .enter().append("rect")
            .attr("class", function(d) { return "bar bar_" + (export_totals.values < 0 ? "negative" : "positive"); })
            .attr("x", function(d) { return x(d.values); })
            .attr("y", function(d) { return y(d.key); })
            .attr("width", function(d) { return Math.abs(x(d.values) - x(0)); })
            .attr("height", y.rangeBand() / Object.keys(export_totals).length);

      svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

      svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + x(0) + ",0)")
            .call(yAxis);
    });
        
}