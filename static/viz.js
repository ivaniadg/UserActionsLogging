function createViz(userLogger) {

    // This function is just to see the click visually
    function toggleSize() {
        svg.selectAll(".clicked").classed("clicked", false)
        d3.select(this).attr("class", "clicked")
    }

    let margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let svg = d3.select("#dataviz_brushScatter")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleLinear()
        .domain([4, 8])
        .range([0, width]);

    let y = d3.scaleLinear()
        .domain([0, 9])
        .range([height, 0]);


    let brush = d3.brush()
        .extent([[0, 0], [width, height]]);

    function isBrushed(brush_coords, cx, cy) {
        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
    }

    function updateChart() {
        let extent = d3.event.selection
        svg.selectAll("circle").classed("selected", function (d) {
            return isBrushed(extent, x(d.Sepal_Length), y(d.Petal_Length))
        })
    }
    function startBrush(){
        updateChart()
        let extent = d3.event.selection
        // We don't subscribe this event, we manually add it to the queue
        userLogger.addAction({'action': 'new brush', 'dimensions': extent}, d3.event.sourceEvent)
    }

    brush.on("start", startBrush)

    brush.on("brush", updateChart)

    svg.append("g")
        .attr("class", "brush")
        .call(brush);

    d3.csv("https://raw.githubusercontent.com/indonoso/UserActionsLogging/master/data/iris.csv", function (data) {

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        let color = d3.scaleOrdinal()
            .domain(["setosa", "versicolor", "virginica"])
            .range(["#440154ff", "#21908dff", "#fde725ff"])

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
            .on("click", toggleSize);  // You can have several event listeners

        // Here we subscribe all the circles to the logging events
        userLogger.subscribeObject('circle')
    })

}

