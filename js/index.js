var state_list = [
    {"abbr":"AL", "info": {"name": "Alabama", "num":  "1"}},
    {"abbr":"AK", "info": {"name": "Alaska", "num":  "2"}},
    {"abbr":"AZ", "info": {"name": "Arizona", "num":  "4"}},
    {"abbr":"AR", "info": {"name": "Arkansas", "num":  "5"}},
    {"abbr":"CA", "info": {"name": "California", "num":  "6"}},
    {"abbr":"CO", "info": {"name": "Colorado", "num":  "8"}},
    {"abbr":"CT", "info": {"name": "Connecticut", "num":  "9"}},
    {"abbr":"DC", "info": {"name": "Washington DC", "num": "10"}},
    {"abbr":"DE", "info": {"name": "Delaware", "num": "11"}},
    {"abbr":"FL", "info": {"name": "Florida", "num": "12"}},
    {"abbr":"GA", "info": {"name": "Georgia", "num": "13"}},
    {"abbr":"HI", "info": {"name": "Hawaii", "num": "15"}},
    {"abbr":"ID", "info": {"name": "Idaho", "num": "16"}},
    {"abbr":"IL", "info": {"name": "Illinois", "num": "17"}},
    {"abbr":"IN", "info": {"name": "Indiana", "num": "18"}},
    {"abbr":"IA", "info": {"name": "Iowa", "num": "19"}},
    {"abbr":"KS", "info": {"name": "Kansas", "num": "20"}},
    {"abbr":"KY", "info": {"name": "Kentucky", "num": "21"}},
    {"abbr":"LA", "info": {"name": "Louisiana", "num": "22"}},
    {"abbr":"ME", "info": {"name": "Maine", "num": "23"}},
    {"abbr":"MD", "info": {"name": "Maryland", "num": "24"}},
    {"abbr":"MA", "info": {"name": "Massachusetts", "num": "25"}},
    {"abbr":"MI", "info": {"name": "Michigan", "num": "26"}},
    {"abbr":"MN", "info": {"name": "Minnesota", "num": "27"}},
    {"abbr":"MS", "info": {"name": "Mississippi", "num": "28"}},
    {"abbr":"MO", "info": {"name": "Missouri", "num": "29"}},
    {"abbr":"MT", "info": {"name": "Montana", "num": "30"}},
    {"abbr":"NE", "info": {"name": "Nebraska", "num": "31"}},
    {"abbr":"NV", "info": {"name": "Nevada", "num": "32"}},
    {"abbr":"NH", "info": {"name": "New Hampshire", "num": "33"}},
    {"abbr":"NJ", "info": {"name": "New Jersey", "num": "34"}},
    {"abbr":"NM", "info": {"name": "New Mexico", "num": "35"}},
    {"abbr":"NY", "info": {"name": "New York", "num": "36"}},
    {"abbr":"NC", "info": {"name": "North Carolina", "num": "37"}},
    {"abbr":"ND", "info": {"name": "North Dakota", "num": "38"}},
    {"abbr":"OH", "info": {"name": "Ohio", "num": "39"}},
    {"abbr":"OK", "info": {"name": "Oklahoma", "num": "40"}},
    {"abbr":"OR", "info": {"name": "Oregon", "num": "41"}},
    {"abbr":"PA", "info": {"name": "Pennsylvania", "num": "42"}},
    {"abbr":"RI", "info": {"name": "Rhode Island", "num": "44"}},
    {"abbr":"SC", "info": {"name": "South Carolina", "num": "45"}},
    {"abbr":"SD", "info": {"name": "South Dakota", "num": "46"}},
    {"abbr":"TN", "info": {"name": "Tennessee", "num": "47"}},
    {"abbr":"TX", "info": {"name": "Texas", "num": "48"}},
    {"abbr":"UT", "info": {"name": "Utah", "num": "49"}},
    {"abbr":"VT", "info": {"name": "Vermont", "num": "50"}},
    {"abbr":"VA", "info": {"name": "Virginia", "num": "51"}},
    {"abbr":"WA", "info": {"name": "Washington", "num": "53"}},
    {"abbr":"WV", "info": {"name": "West Virginia", "num": "54"}},
    {"abbr":"WI", "info": {"name": "Wisconsin", "num": "55"}},
    {"abbr":"WY", "info": {"name": "Wyoming", "num": "56"}}
];

// console.log(state_list);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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

    var projection = d3.geo.albersUsa()
            .scale(1000)
            .translate([width / 2, height / 2])

    var path = d3.geo.path()
        .projection(projection);

    d3.json('./data/us.json', function(error, us) {
        svg.selectAll('.states')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .on("mouseover", function(d){
                mouseOver(d);
            })
            .on("mouseout", function(d) {
                mouseOff(d);
            });
    });

    var combined = [];
    var lookup = [];
    var positions = [];

    d3.csv("./data/state_data.csv", function(error, data){

        data.forEach(function(d){
            combined.push({state_num: d.state, state_name: d.context, export_total: 0.0, import_total: 0.0, intrastate_total: 0.0});
            lookup.push(d.state);
            positions.push(projection([d.longitude, d.latitude]));
        });
    });

    console.log(combined);

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
            .style("pointer-events", "none")
            .attr("class", "bar bar_positive")
            .attr("cx", function(d, i) { return positions[i][0]; })
            .attr("cy", function(d, i) { return positions[i][1]; })
            .attr("r", function(d) { return Math.sqrt(d.export_total / 15); });

        svg.selectAll("circle_neg")
            .data(combined)
            .enter()
            .append("circle")
            .style("pointer-events", "none")
            .attr("class", "bar bar_negative")
            .attr("cx", function(d, i) { return positions[i][0]; })
            .attr("cy", function(d, i) { return positions[i][1]; })
            .attr("r", function(d) { return Math.sqrt(d.import_total / 15); });
    });

    function mouseOver(d){
        var abbr = d.properties.STATE_ABBR;
        // console.log(findObjectByKey(state_list, "abbr", abbr));
        var state = findObjectByKey(state_list, "abbr", abbr);
        // console.log(state_info);

        var st_dat = findObjectByKey(combined, "state_num", state.info.num.toString());
        console.log(st_dat);

        console.log(d3.event.pageX + " " + d3.event.pageY);

        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("<div style=\"font-weight:bold;\">"+state.info.name + "</div>"
                    + "Exports: "  + st_dat.export_total.toFixed(2) + " tons"
                    + "<br/>Imports: " + st_dat.import_total.toFixed(2) + " tons"
                    + "<br/>Intra: " + st_dat.intrastate_total.toFixed(2) + " tons"
            )
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("display", "inline-block");
        }

    function mouseOff(d){
        div.transition()
        .duration(500)
        .style("opacity", 0);
    }
}

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

d3.select(window)
  .on("resize", function() {
      dispCommData(d3.select("#comm_data_drop_menu").property("value"));
  });
