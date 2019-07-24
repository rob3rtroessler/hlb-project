
/* * * * * * * * * * * * * * * * * *
*           FANCY LINES            *
*        HELPER FUNCTION           *
* * * * * * * * * * * * * * * * *  */


function drawFancyLine(angle, data, collection, id) {

    // create new group 'fancyLines' that we can transform accordingly
    let fancyLine = svgFancy.append('g').attr('class', 'fancyLines '+ id).attr('opacity',0).attr('transform', 'translate(0,0)rotate(' + angle + ')');


    // Add x axis
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.n; })])
        .range([0, 50]);
    fancyLine.append("g")
        .attr("transform", "translate(0," + 250 + ")")
        .call(d3.axisBottom(x).ticks(2));


    // Add y axis --> it is a date format
    let y = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return +d.year; }))
        .range([ radius*0.5, 250 ]);

    fancyLine.append("g")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0f")))
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "translate(-15,0), rotate(90)");


    // Draw the line
    fancyLine.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", function(d) {  return (lookUpColor(collection)) })
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.n) })
            .y(function(d) { return y(d.year) })
            .curve(d3.curveBasis)
        )

}