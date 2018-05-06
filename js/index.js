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

    var margin = {top: 20, right: 30, bottom: 40, left: 30},
    width = 960 - margin.left - margin.right,
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

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../data/faf_commodity_data_dom_only.csv", function(error, data) {
  var export_totals = d3.nest()
      .key(function(d) { 
          // Validate that origin and destination are not the same and commodity code matches
          // Commodity is hardcoded for testing purposes
          if ( d.dms_orig != d.dms_dest && d.sctg2 == 1) {
              return d.dms_orig;
          }})
      // Sums up tons_2015 for a specific good in a specific origin state
      .rollup(function(v) { return d3.sum(v, function(d) { return d.tons_2015; }); })
      .entries(data);
  export_totals.pop();
  console.log(export_totals);

  x.domain(d3.extent(export_totals, function(d) { return Math.max(d.values); })).nice();
  y.domain(data.map(function(d) { return d.dms_orig; }));

  svg.selectAll(".bar")
      .data(export_totals)
      .enter()
      .append("rect")
      .attr("class", function(d) { return "bar bar--" + (d.values < 0 ? "negative" : "positive"); })
      .attr("x", function(d) { return x(Math.min(0, d.values)); })
      .attr("y", function(d) { return y(d.key); })
      .attr("width", function(d) { return Math.abs(x(d.values)); })
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
        
}