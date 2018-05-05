d3.csv("./data/commodity_types.csv", function (error, data) {
    var select = d3.select("body")
        .append("div")
        .append("select")

    select
        .on("change", function (d) {
            var value = d3.select(this).property("value");
            dispCommData(value);
        });

    select.selectAll("option")
        .data(data)
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
}