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
        console.log(export_totals);
        var import_totals = d3.nest()
            .key(function(d) { 
                // Validate that origin and destination are not the same and commodity code matches
                if ( d.dms_orig != d.dms_dest && d.sctg2 == commodity) {
                    return d.dms_dest;
                }})
            // Sums up tons_2015 for a specific good in a specific destination state
            .rollup(function(v) { return d3.sum(v, function(d) { return d.tons_2015; }); })
            .entries(faf_data);
        console.log(import_totals);
    });
        
}