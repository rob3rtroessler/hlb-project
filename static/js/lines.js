// set the dimensions and margins of the graph
let lineChartDiv = $('#lineChartDiv'),
    lineMargin = {top: 30, right: 10, bottom: 50, left: 50},
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


// Add labels
let yLabel = lineSvg.append("text")
    .attr("class", "lineLabels")
    .attr('transform', 'translate(-13,0), rotate(-90)')
    .style("text-anchor", "end")
    .text("time");

let xLabel = lineSvg.append("text")
    .attr("class", "lineLabels")
    .attr("transform",
    "translate(" + (lineWidth) + " ," +
    (lineHeight - 13) + ")")
    .style("text-anchor", "end")
    .text("# of HLB articles / RRRs");


// Read the data
d3.csv("data/publicationsOverTime.csv").then( function(data) {

    // group the data: I want to draw one line per group
    let sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d){return d.collection;})
        .entries(data);

    // convert year into number TODO: scaleTime
    data.forEach(function (d) {
        d.year = +d.year;
    });

    // Add y axis --> it is a date format
    let y = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return +d.year; }))
        .range([ 0, lineHeight ]);
    lineSvg.append("g")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0f")))
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "translate(-15,0), rotate(90)");


    // Add Y axis
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.n; })])
        .range([0, lineWidth]);
    lineSvg.append("g")
        .attr("transform", "translate(0," + lineHeight + ")")
        .call(d3.axisBottom(x).ticks(3));


    // Draw the line
    lineSvg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("class", function(d){return "line " + d.key + "_line"})
        .attr("fill", "none")
        .attr("stroke", colorForUnselected)
        .attr("stroke-width", 0.2)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return x(+d.n); })
                .y(function(d) { return y(d.year); })
                .curve(d3.curveBasis)
                (d.values)

        })
        .on("mouseover", function(d) {

            // show info
            $("#infoField").html(`Name: ${d.key}`);
            console.log(d);
            // assign colors
            ColorToClass(d.key);
        })
        .on("mouseout", function(d) {RemoveColorFromClass(d.key)})
        .on("click", function(d){ lockColor(d.collection) });

});