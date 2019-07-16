// set the dimensions and margins of the graph
let barDiv = $('#barDiv'),
    barMargin = {top: 30, right: 50, bottom: 70, left: 50},
    barWidth = barDiv.width() - barMargin.left - barMargin.right,
    barHeight = barDiv.height() - barMargin.top - barMargin.bottom;


// append the svg object to the body of the page
let barSvg = d3.select("#barDiv")
    .append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + barMargin.left + "," + barMargin.top + ")");

// append heading
let barHeading = barSvg.append("text")
    .attr("class", "graphHeading")
    .attr("x", barWidth/2)
    .attr("y", -10)
    .style("text-anchor", "middle")
    .text('Holdings Mentioned in the HLB');

// Parse the Data
d3.csv("data/collections.csv").then( function(data) {

    // sort data
    data.sort(function(b, a) {
        return a.HLB_Publications - b.HLB_Publications;
    });

    // X axis
    let x = d3.scaleBand()
        .range([ 0, barWidth ])
        .domain(data.map(function(d) { return d.Collection; }))
        .padding(0.2);
    barSvg.append("g")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("class","barLabels")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, 15])
        .range([ barHeight, 0]);
    barSvg.append("g")
        .call(d3.axisLeft(y).ticks(4));

    // Add labels
    let yLabel = barSvg.append("text")
        .attr("class", "lineLabels")
        .attr('transform', 'translate(13,0), rotate(-90)')
        .style("text-anchor", "end")
        .text("# of mentions");

    // Bars
    barSvg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class" , "bar")
        .attr("x", function(d) { return x(d.Collection); })
        .attr("y", function(d) { return y(d.HLB_Publications); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return barHeight - y(d.HLB_Publications);})
        .on("mouseover", function(d) {
            $("#infoField").html(`Collection: ${d.Collection} </br> Total # of HLB_Publications: ${d.HLB_Publications}`)
        })
        .on("click", function(d){
            // check if already clicked
            if(d3.select(this).classed('selectedBar')=== false){
                d3.select(this).classed("selectedBar", true);

                // then add selection to array
                selectedHoldings.push(d.Collection);
            }
            else {
                d3.select(this).classed("selectedBar", false);
                selectedHoldings.push(d.Collection);
            }
        })
});