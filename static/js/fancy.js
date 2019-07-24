
/* * * * * * * * * * * * * * * * * *
*                                  *
*      FANCY INITIALIZATION        *
*                                  *
* * * * * * * * * * * * * * * * *  */


// set the dimensions and margins of the graph
let widthFancy = mainSVGwidth,
    heightFancy = mainSVGheight,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
let radius = Math.min(widthFancy, heightFancy) / 2 - margin;

// append the svg object to the div called 'my_dataviz'
svgFancy = d3.select("#fancy")
    .append("svg")
    .attr("width", widthFancy)
    .attr("height", heightFancy)
    .append("g")
    .attr('id','SVG_start')
    .attr("transform", "translate(" + widthFancy / 2 + "," + heightFancy / 2 + ")");



function fancy (collection) {

    // reset
    document.getElementById('SVG_start').innerHTML ='';

    // Compute the position of each group on the pie:
    let pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function(d) {return 1 });

    // prepare data
    let data_ready = pie(d3.entries(data[collection]));

    console.log('data in fancy', data_ready);

    // The arc generator
    let innerArc = d3.arc()
        .innerRadius(radius * 0.2)
        .outerRadius(radius * 0.35),
        arc = d3.arc()
        .innerRadius(radius * 0.35)
        .outerRadius(radius * 0.5),
        outerArc = d3.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius * 0.7);


    // draw miniSlices
    svgFancy.selectAll('miniSlices')
        .data(pie(d3.entries(Array.from({length: 150}, () => Math.floor(Math.random() * 40)))))
        .enter()
        .append('path')
        .attr('d', innerArc)
        .attr('fill', 'grey')
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .attr("opacity", 1);


    // draw slices
    svgFancy.selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('id', function(d){return 'slice_' + d.data.key})
        .attr('d', arc)
        .attr('fill', function(d){

            // compute current angle and draw fancy line
            let angle = 360 / (2* Math.PI) * (d.startAngle + (d.endAngle - d.startAngle)) - 180 - 360/10;
            console.log(d);

            drawFancyLine(angle, d.data.value.articles, collection,('slice_' + d.data.key));

            // first check whether the current arc tile contains articles
            if (d.data.value.articles.length === 0) {
                // if not -> color them grey
                return 'grey'
            }
            else {
                // else apply correct color
                lookUpColor(collection);
                return(lookUpColor(collection));
            }
        })
        // intense
        .attr("stroke", "white")
        .attr("stroke-width", "2px")
        .attr("opacity", 1)
        .on('mouseover', function(d) { d3.select(this).attr('opacity', 0.6)})
        .on('mouseout', function(d) { d3.select(this).attr('opacity', 1)})
        .on("click", function(d){





            if (d3.select('.polyline_' + d.index).attr('opacity') === '0'){

                // make this invisible
                console.log(d.data.key);
                d3.select('.slice_' + d.data.key).attr('opacity',0);

                // make prior line and label visible
                d3.select('.polyline_' + d.index).attr('opacity',1);
                d3.select('.label_' + d.index).attr('opacity',1);


            }
            else {

                console.log('making the line visible');
                // make prior line and label invisible
                d3.select('.polyline_' + d.index).attr('opacity',0);
                d3.select('.label_' + d.index).attr('opacity',0);

                //
                d3.select('.slice_' + d.data.key).attr('opacity',1);
            }
        });


    // text in the middle
    svgFancy.append("text")
        .text(LookUpCurrentCollection())
        .attr('x', 0)
        .attr('y',5)
        .attr('text-anchor', 'middle') ;

    // Add the polylines between chart and labels:
    svgFancy
        .selectAll('allPolylines')
        .data(data_ready)
        .enter()
        .append('polyline')
        .attr('class', function(d){return 'polyline_' + d.index})
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
            let posA = arc.centroid(d); // line insertion in the slice
            let posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
            let posC = outerArc.centroid(d); // Label position = almost the same as posB
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position
            // will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
        });

// Add the labels:
    svgFancy
        .selectAll('allLabels')
        .data(data_ready)
        .enter()
        .append('text')
        .attr('class', function(d){return 'label_' + d.index})
        .text( function(d) { return d.data.value.name } )
        .attr('transform', function(d) {
            let pos = outerArc.centroid(d);
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function(d) {
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        });
}


function LookUpCurrentCollection() {
    let inner = '';
    for (let i = 0; i < selectedClasses.length; ++i) {
        if (selectedClasses[i] === '') {
            inner = selectedClasses[i - 1];
            console.log('treffer', i);
            break;
        }
        else {
            console.log('word', selectedClasses[i])
        }
    }
    return inner;
}