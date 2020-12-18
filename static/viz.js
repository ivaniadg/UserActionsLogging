function createViz(userLogger) {

    function toggleAlpha() {
        var currentAlpha = 0.5;

        return function () {
            currentAlpha = currentAlpha == 0.5 ? 1 : 0.5;
            d3.select(this).style("opacity", currentAlpha);
        }
    }

// set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#dataviz_brushScatter")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([4, 8])
        .range([0, width]);
// Function that is triggered when brushing is performed

    // A function that return TRUE or FALSE according if a dot is in the selection or not

// Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 9])
        .range([height, 0]);


    var brush = d3.brush()                 // Add the brush feature using the d3.brush function
        .extent([[0, 0], [width, height]])

    function isBrushed(brush_coords, cx, cy) {
        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
    }

    function updateChart() {
        extent = d3.event.selection
        svg.selectAll("circle").classed("selected", function (d) {
            return isBrushed(extent, x(d.Sepal_Length), y(d.Petal_Length))
        })
    }

    userLogger.subscribeObject('circle')
    brush.on("start brush", updateChart)
    svg.append("g")
        .attr("class", "brush")
        .call(brush);
//Read the data
    d3.csv("https://raw.githubusercontent.com/indonoso/UserActionsLogging/master/data/iris.csv", function (data) {


        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


        svg.append("g")
            .call(d3.axisLeft(y));

        // Color scale: give me a specie name, I return a color
        var color = d3.scaleOrdinal()
            .domain(["setosa", "versicolor", "virginica"])
            .range(["#440154ff", "#21908dff", "#fde725ff"])

        // Add dots
        svg.append('g')
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr('pointer-events', 'all') // IMPORTANT
            .attr("cx", function (d) {
                return x(d.Sepal_Length);
            })
            .attr("cy", function (d) {
                return y(d.Petal_Length);
            })
            .attr("r", 8)
            .attr("data-sepal-length", function (d) {
                return d.Sepal_Length
            })
            .attr("data-petal-length", function (d) {
                return d.Petal_Length
            })
            .attr("data-species", function (d) {
                return d.Species
            })
            .style("fill", function (d) {
                return color(d.Species)
            })
            .style("opacity", 0.5)
            .on("click", toggleAlpha());

        userLogger.subscribeObject('circle')
    })

}

