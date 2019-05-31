// set the dimensions and margins of the graph
let barDiv = $('#barDiv'),
    barMargin = {top: 30, right: 30, bottom: 70, left: 70},
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
    .text('Top 10 Holdings mentioned in the HLB');

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv").then( function(data) {

    // sort data
    data.sort(function(b, a) {
        return a.Value - b.Value;
    });

    // X axis
    let x = d3.scaleBand()
        .range([ 0, barWidth ])
        .domain(data.map(function(d) { return d.Country; }))
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
        .domain([0, 13000])
        .range([ barHeight, 0]);
    barSvg.append("g")
        .call(d3.axisLeft(y));

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
        .attr("x", function(d) { return x(d.Country); })
        .attr("y", function(d) { return y(d.Value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return barHeight - y(d.Value);})
        .on("mouseover", function(d) {
            $("#infoField").html(`Country: ${d.Country} </br> Value: ${d.Value}`)
        })
        .on("click", function(d){
            // check if already clicked
            if(d3.select(this).classed('selectedBar')=== false){
                d3.select(this).classed("selectedBar", true);

                // then add selection to array
                selectedHoldings.push(d.Country);
            }
            else {
                d3.select(this).classed("selectedBar", false);
                selectedHoldings.push(d.Country);
            }
        })
});