// set the dimensions and margins of the graph
let bubbleChartDiv = $('#bubbleChartDiv'),
    bubbleMargin = {top: 30, right: 50, bottom: 30, left: 50},
    bubbleWidth = bubbleChartDiv.width() - bubbleMargin.left - bubbleMargin.right,
    bubbleHeight = bubbleChartDiv.height() - bubbleMargin.top - bubbleMargin.bottom;

// append the svg object to the body of the page
let bubbleSvg = d3.select("#bubbleChartDiv")
    .append("svg")
    .attr("width", bubbleWidth + bubbleMargin.left + bubbleMargin.right)
    .attr("height", bubbleHeight + bubbleMargin.top + bubbleMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + bubbleMargin.left + "," + bubbleMargin.top + ")");

// append heading
let bubbleHeading = bubbleSvg.append("text")
    .attr("class", "graphHeading")
    .attr("x", bubbleWidth/2)
    .attr("y", -10)
    .style("text-anchor", "middle")
    .text('Research Status');


let gridLine = bubbleSvg.append('line')
    .attr('class', 'gridLine')
    .attr("x1", 0)
    .attr("y1", bubbleHeight)
    .attr("x2", bubbleWidth)
    .attr("y2", 0)
    .style("stroke-width", 1)
    .style("stroke", "#929292")
    .style("stroke-dasharray", ("3, 3"))
    .style("opacity", 0.6)
    .style("fill", "none");



//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv").then( function(data) {

    // Add X axis
    let x = d3.scaleLinear()
        .domain([0, d3.max(data.map(function(d){return +d.gdpPercap}))])
        .range([ 0, bubbleWidth ]);
    bubbleSvg.append("g")
        .attr("transform", "translate(0," + bubbleHeight + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([35, 90])
        .range([ bubbleHeight, 0]);
    bubbleSvg.append("g")
        .call(d3.axisLeft(y));

    // Add a scale for bubble size
    let z = d3.scaleLinear()
        .domain([200000, 1310000000])
        .range([ 1, 40]);

    // Add labels
    let yLabel = bubbleSvg.append("text")
        .attr("class", "lineLabels")
        .attr('transform', 'translate(13,0), rotate(-90)')
        .style("text-anchor", "end")
        .text("# of HLB articles / RRRs");

    let xLabel = bubbleSvg.append("text")
        .attr("class", "lineLabels")
        .attr("transform",
            "translate(" + (bubbleWidth) + " ," +
            (bubbleHeight + 13) + ")")
        .style("text-anchor", "end")
        .text("size of holding in ");

    // Add dots
    bubbleSvg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { console.log(d); return x(d.gdpPercap); } )
        .attr("cy", function (d) { return y(d.lifeExp); } )
        .attr("r", function (d) { return z(d.pop); } )
        .attr("class", "circle")
        .on("mouseover", function(d) {
            $("#infoField").html(`Country: ${d.country} </br> Population: ${d.pop} </br> GDP: ${d.gdpPercap} </br> lifeExp: ${d.lifeExp}`)
        })
        .on("click", function(d){
            // check if already clicked
            if(d3.select(this).classed('selectedCircle')=== false){
                d3.select(this).classed("selectedCircle", true);

                // then add selection to array
                selectedHoldings.push(d.Country);
            }
            else {
                d3.select(this).classed("selectedCircle", false);
                selectedHoldings.push(d.Country);
            }
        })

});