d3.csv("./data/commodity_types.csv", function (error1, com_data) {
    var select = d3.select("body")
        .append("div")
        .append("select")

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
        });


});

function dispCommData(d) {
    console.log(d);
    var commodity = d;

    d3.csv("./data/faf_commodity_data_dom_only.csv", function(faf_data) {
        var freight_totals = d3.nest()
            .key(function(d) { 
                if ( d.dms_orig != d.dms_dest ) {
                    return d.dms_orig; 
                }})
            .key(function(d) { return d.sctg2; })
            .rollup(function(v) { return d3.sum(v, function(d) { return d.tons_2015; }); })
            .entries(faf_data);
        console.log(JSON.stringify(freight_totals));
    });
        
}