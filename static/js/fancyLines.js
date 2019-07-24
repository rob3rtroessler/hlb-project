

/* * * * * * * * * * * * * * * * * *
*           FANCY LINES            *
*        HELPER FUNCTION           *
* * * * * * * * * * * * * * * * *  */

function drawFancyLine(angle, collection, boxes){

    // create new group 'fancyLines'
    let fancyLine = svgFancy.append('g').attr('class','fancyLines').attr('transform','translate(0,0)rotate('+angle +')');


// Read the data
    d3.csv("data/publicationsOverTime.csv").then( function(data) {

        //console.log(data);

        // group the data: I want to draw one line per group
        let sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function(d){return d.collection;})
            .entries(data);

        // convert year into number TODO: scaleTime
        data.forEach(function (d) {
            d.year = +d.year;
        });

        //console.log(sumstat);

        let myTest = collection.box_1.articles;
        //console.log(myTest);


        // Add y axis --> it is a date format
        let y = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d.year; }))
            .range([ radius*0.5, 300 ]);

        fancyLine.append("g")
            .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0f")))
            .selectAll("text")
            .style("text-anchor", "start")
            .attr("transform", "translate(-15,0), rotate(90)");


        // Add x axis
        let x = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.n; })])
            .range([0, 80]);
        fancyLine.append("g")
            .attr("transform", "translate(0," + 300 + ")")
            .call(d3.axisBottom(x).ticks(3));


        // Draw the line
        fancyLine.selectAll(".line")
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

}
