// set the dimensions and margins of the graph
let histogramDiv = $('#histogramDiv'),
    histoMargin = {top: 10, right: 30, bottom: 50, left: 70},
    histoWidth = histogramDiv.width() - histoMargin.left - histoMargin.right,
    histoHeight = histogramDiv.height() - histoMargin.top - histoMargin.bottom;

// append the svg object to the body of the page
let histoSvg = d3.select("#histogramDiv")
    .append("svg")
    .attr("width", histoWidth + histoMargin.left + histoMargin.right)
    .attr("height", histoHeight + histoMargin.top + histoMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + histoMargin.left + "," + histoMargin.top + ")");

// get the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv").then( function(data) {

    // X axis: scale and draw:
    let x = d3.scaleLinear()
        .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, histoWidth]);
    histoSvg.append("g")
        .attr("transform", "translate(0," + histoHeight + ")")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    let histogram = d3.histogram()
        .value(function(d) { return d.price; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(70)); // then the numbers of bins

    // And apply this function to data to get the bins
    let bins = histogram(data);

    console.log(bins);
    // Y axis: scale and draw:
    let y = d3.scaleLinear()
        .range([histoHeight, 0]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    histoSvg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    histoSvg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return histoHeight - y(d.length); })
        .style("fill", "#69b3a2")

});
