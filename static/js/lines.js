// set the dimensions and margins of the graph
let lineChartDiv = $('#lineChartDiv'),
    lineMargin = {top: 30, right: 70, bottom: 70, left: 60},
    lineWidth = lineChartDiv.width() - lineMargin.left - lineMargin.right,
    lineHeight = lineChartDiv.height() - lineMargin.top - lineMargin.bottom;


// append the svg object to the body of the page
let lineSvg = d3.select("#lineChartDiv")
    .append("svg")
    .attr("width", lineWidth + lineMargin.left + lineMargin.right)
    .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + lineMargin.left + "," + lineMargin.top + ")");

// append heading
let heading = lineSvg.append("text")
    .attr("class", "graphHeading")
    .attr("x", lineWidth/2)
    .attr("y", -10)
    .style("text-anchor", "middle")
    .text('Popularity of Selected Holdings over Time');

// Add labels
let yLabel = lineSvg.append("text")
    .attr("class", "lineLabels")
    .attr('transform', 'translate(13,0), rotate(-90)')
    .style("text-anchor", "end")
    .text("# of HLB articles / RRRs");

let xLabel = lineSvg.append("text")
    .attr("class", "lineLabels")
    .attr("transform",
    "translate(" + (lineWidth) + " ," +
    (lineHeight + 13) + ")")
    .style("text-anchor", "end")
    .text("time");


//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv").then( function(data) {

    // group the data: I want to draw one line per group
    let sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.name;})
        .entries(data);

    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, lineWidth ]);
    lineSvg.append("g")
        .attr("transform", "translate(0," + lineHeight + ")")
        .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.n; })])
        .range([ lineHeight, 0 ]);
    lineSvg.append("g")
        .call(d3.axisLeft(y));

    // color palette
    let res = sumstat.map(function(d){ return d.key }); // list of group names
    let color = d3.scaleOrdinal()
        .domain(res)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']);

    // Draw the line
    lineSvg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(+d.n); })
                .curve(d3.curveMonotoneX)
                (d.values)

        })
        .on("click", function(d){
            // check if already clicked
            if(d3.select(this).classed('selectedLine')=== false){
                d3.select(this).classed("selectedLine", true);

                // then add selection to array
                selectedHoldings.push(d.Country);
            }
            else {
                d3.select(this).classed("selectedLine", false);
                selectedHoldings.push(d.Country);
            }
        })

});