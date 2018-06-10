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

    var combined = [];
    var lookup = [];

    d3.csv("./data/state_data.csv", function(error, data){

        data.forEach(function(d){
            combined.push({state_num: d.state, state_name: d.context, export_total: 0.0, import_total: 0.0, intrastate_total: 0.0});
            lookup.push(d.state);
        });
    });

    d3.csv("./data/faf_commodity_data_dom_only.csv", function(error, data) {
        data.forEach(function(d){
            if(d.sctg2 == commodity){
                if(d.dms_orig != d.dms_dest){
                    combined[lookup.indexOf(d.dms_orig)].export_total += Number(d.tons_2015);
                    combined[lookup.indexOf(d.dms_dest)].import_total += Number(d.tons_2015);
                } else {
                    combined[lookup.indexOf(d.dms_orig)].intrastate_total += Number(d.tons_2015);
                }
            }
        });

        svg.selectAll("circle_pos")
            .data(combined)
            .enter()
            .append("circle")
            .attr("class", "bar bar_positive")
            .attr("cy", function(d, i) { return grid[i][1]; })
            .attr("cx", function(d, i) { return grid[i][0]; })
            .attr("r", function(d) { return Math.sqrt(d.export_total / 10); });
        
        svg.selectAll("circle_neg")
            .data(combined)
            .enter()
            .append("circle")
            .attr("class", "bar bar_negative")
            .attr("cy", function(d, i) { return grid[i][1]; })
            .attr("cx", function(d, i) { return grid[i][0]; })
            .attr("r", function(d) { return Math.sqrt(d.import_total / 10); });

        // svg.append("text")
        //   .style("text-anchor", "middle")
        //   .text(function(d) { return d.state_name; });
    });
}

d3.select(window)
  .on("resize", function() {
      dispCommData(d3.select("#comm_data_drop_menu").property("value"));
  });
