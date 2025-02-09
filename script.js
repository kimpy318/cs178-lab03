// Color maps you can use: https://colorbrewer2.org/

// Set the dimensions and margins of the graph. You don't need to change this.
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* SVG_SCATTER WILL REPRESENT THE CANVAS THAT YOUR SCATTERPLOT WILL BE DRAWN ON */
// Append the svg object to the body of the page. You don't need to change this.
const svg_scatter = d3
    .select("#my_scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background", "#eee")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

/* SVG_BAR WILL REPRESENT THE CANVAS THAT YOUR BARCHART WILL BE DRAWN ON */
// Append the svg object to the body of the page. You don't need to change this.
const svg_bar = d3
    .select("#my_barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background", "#eee")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Read the iris dataset
d3.csv("/iris.csv", d3.autoType).then(function (data) {
    /****************************************   
     TODO: Complete the scatter plot tasks
    *****************************************/
    //find all numeric columns in data
    let attrs = Object.keys(data[0]).filter(
        (a) => typeof data[0][a] === "number",
    );

    d3.select("#xAxisDropdown")
        .selectAll("option")
        .data(attrs)
        .join("option")
        .attr("value", (d) => d)
        .text((d) => d);
    //TODO: do the same for yAxisDropdown
    d3.select("#yAxisDropdown")
        .selectAll("option")
        .data(attrs)
        .join("option")
        .attr("value", (d) => d)
        .text((d) => d);

    // TODO: Create a scale for the x-axis that maps the x axis domain to the range of the canvas width
    // TODO: Implement the x-scale domain and range for the x-axis
    let xScale_scatter = d3
        .scaleLinear()
        //TODO: make this depend on the dropdown option
        .domain(d3.extent(data, (d) => d[d3.select("#xAxisDropdown").property("value")]))
        .range([0, width]);

    // dynamically update x-scale domain
    d3.select("#xAxisDropdown").on("change", function() {
        let selectedOption = d3.select(this).property("value");
        
        // Update scale domain
        xScale_scatter.domain(d3.extent(data, d => d[selectedOption]));
        
        // Update axis
        svg_scatter.select(".xAxis")
            .transition()
            .duration(1000)
            .call(d3.axisBottom(xScale_scatter));

        svg_scatter.select(".xAxisLabel")
            .transition()
            .duration(1000)
            .text(selectedOption);

        svg_scatter.select(".scatterTitle")
            .transition()
            .duration(1000)
            .text(d3.select("#yAxisDropdown").property("value") + " vs " + selectedOption);
            
        // Update dots
        svg_scatter.selectAll(".dot")
            .transition()
            .duration(1000)
            .attr("cx", d => xScale_scatter(d[selectedOption]));
     });
    
    // TODO: Create a scale for the y-axis that maps the y axis domain to the range of the canvas height
    // Hint: You can create variables to represent the min and max of the y-axis values

    let yScale_scatter = d3
        .scaleLinear()
        // TODO: Fill these out
        .domain(d3.extent(data, (d) => d[d3.select("#yAxisDropdown").property("value")]))
        .range([height, 0]);

    // dynamically update y-scale domain
    d3.select("#yAxisDropdown").on("change", function() {
        let selectedOption = d3.select(this).property("value");
            
        // Update scale domain
        yScale_scatter.domain(d3.extent(data, d => d[selectedOption]));
            
        // Update axis
        svg_scatter.select(".yAxis")
            .transition()
            .duration(1000)
            .call(d3.axisLeft(yScale_scatter));

        svg_scatter.select(".yAxisLabel")
            .transition()
            .duration(1000)
            .text(selectedOption);

        svg_scatter.select(".scatterTitle")
            .transition()
            .duration(1000)
            .text(selectedOption + " vs " + d3.select("#xAxisDropdown").property("value"));
                
        // Update dots
        svg_scatter.selectAll(".dot")
            .transition()
            .duration(1000)
            .attr("cy", d => yScale_scatter(d[selectedOption]));
    });

    // TODO: Append the scaled x-axis tick marks to the svg
    svg_scatter
        .append("g")
        .attr("class", "xAxis")
        .style("font", "11px monaco")
        .attr("transform", `translate(0, ${height})`)
        // TODO: Explain the following line of code in a comment
        .call(d3.axisBottom(xScale_scatter));

    // TODO: Append the scaled y-axis tick marks to the svg
    svg_scatter
        .append("g")
        .attr("class", "yAxis")
        .style("font", "11px monaco")
        .call(d3.axisLeft(yScale_scatter));

    var color = d3.scaleOrdinal()
        .domain(["Setosa", "Versicolor", "Virginica" ])
        .range([ "#440154ff", "#21908dff", "#fde725ff"])

    // TODO: Draw scatter plot dots here. Finish the rest of this
    let dots = svg_scatter
        .append("g")
        .selectAll(".dot")
        //TODO: feed real data here
        .data(data)
        .join("circle")
        .attr("class", "dot")
        // TODO: Fix these, find position of dots using appropriate scale
        .attr("cx", (d) => xScale_scatter(d[d3.select("#xAxisDropdown").property("value")])) // Scale x-axis position
        .attr("cy", (d) => yScale_scatter(d[d3.select("#yAxisDropdown").property("value")]))
        .attr("r", 5)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        //TODO: color points by iris variety using a categorical color map
        .style("fill", (d) => color(d["variety"]));

    //TODO: add tooltip here
    dots.on("mouseover", (event, d) => {
        console.log("Moused over a dot. \nEvent:", event, "D:", d);
    });

    // TODO: X axis label
    svg_scatter
        .append("text")
        .attr("class", "xAxisLabel")
        .attr("text-anchor", "end")
        .attr("x", margin.left + width / 2)
        .attr("y", height + 36)
        // TODO: Finish this...
        .text(d3.select("#xAxisDropdown").property("value"));

    // TODO: Y axis label
    svg_scatter
        .append("text")
        .attr("class", "yAxisLabel")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/7) 
        .attr("y", -40)
        .text(d3.select("#yAxisDropdown").property("value"));

    svg_scatter
        .append("text")
        .attr("class", "scatterTitle")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .attr("x", width/2)
        .attr("y", -10)
        .text(d3.select("#xAxisDropdown").property("value") + " vs " + d3.select("#yAxisDropdown").property("value"));

    /********************************************************************** 
     TODO: Complete the bar chart tasks

     Note: We provide starter code to compute the average values for each 
     attribute. However, feel free to implement this any way you'd like.
    ***********************************************************************/

    // Create an array that will hold all computed average values
    let average_data = [];
    // Compute all average values for each attribute, except 'variety'
    average_data.push({
        "sepal.length": d3.mean(data, (d) => d["sepal.length"]),
    });
    // TODO (optional): Add the remaining values to your array
    average_data.push({
        "sepal.width": d3.mean(data, (d) => d["sepal.width"]),
    });
    average_data.push({
        "petal.length": d3.mean(data, (d) => d["petal.length"]),
    });
    average_data.push({
        "petal.width": d3.mean(data, (d) => d["petal.width"]),
    });

    // Compute the maximum and minimum values from the average values to use for later
    let max_average = Object.values(average_data[0])[0];
    let min_average = Object.values(average_data[0])[0];
    average_data.forEach((element) => {
        max_average = Math.max(max_average, Object.values(element)[0]);
        min_average = Math.min(min_average, Object.values(element)[0]);
    });

    // TODO: Create a scale for the x-axis that maps the x axis domain to the range of the canvas width
    // Hint: the domain for X should be the attributes of the dataset
    // xDomain = ['sepal.length', ...]
    // then you can use 'xDomain' as input to .domain()
    let xDomain = ["sepal.length", "sepal.width", "petal.length", "petal.width"];
    let xScale_bar = d3
        .scaleBand()
        .domain(xDomain)
        .range([0, width])
        .padding(0.4);

    // TODO: Finish this
    svg_bar
        .append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale_bar));
    // ....

    // TODO: Create a scale for the y-axis that maps the y axis domain to the range of the canvas height
    let yScale_bar = d3
        .scaleLinear()
        // TODO: Fix this!
        .domain([0, max_average])
        .range([height, 0]);

    // TODO: Finish this
    svg_bar.append("g").attr("class", "yAxis").call(d3.axisLeft(yScale_bar));
    // ....

    // TODO: You can create a variable that will serve as a map function for your sequential color map
    // Hint: Look at d3.scaleLinear()
    // let bar_color = d3.scaleLinear()...
    // Hint: What would the domain and range be?
    let bar_color = d3.scaleLinear();
    // .domain()
    // .range()

    // TODO: Append bars to the bar chart with the appropriately scaled height
    // Hint: the data being used for the bar chart is the computed average values! Not the entire dataset
    // TODO: Color the bars using the sequential color map
    // Hint: .attr("fill") should fill the bars using a function, and that function can be from the above bar_color function we created
    svg_bar
        .selectAll(".bar")
        // TODO: Fix these
        .data([
            {x: 100, y: 100},
            {x: 150, y: 200},
            {x: 200, y: 180},
        ])
        .join("rect")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("width", 40)
        .attr("height", 80)
        .attr("fill", d3.schemeCategory10[0]);

    // TODO: Append x-axis label
    // svg_bar.append("text"); // TODO: Fix this
    svg_bar.append("text")
        .attr("class", "x-axis-bar-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 36)  // Position below x-axis
        .style("font-size", "14px")
        .text("Attribute"); 
    // TODO: Append y-axis label
    svg_bar.append("text")
        .attr("class", "y-axis-bar-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        // .attr("transform", `translate(-40, ${height / 2}) rotate(-90)`) 
        .attr("x", -height/7)
        .attr("y", -40)  // Position below x-axis
        .style("font-size", "14px")
        .text("Average"); 
    // TODO: Append bar chart title
    // TODO: Draw gridlines for both charts

    // Fix these (and maybe you need more...)
    // d3.selectAll("g.yAxis g.tick")
    // .append("line")
    // .attr("class", "gridline")
    // .attr("x1", ...)
    // .attr("y1", ...)
    // .attr("x2", ...)
    // .attr("y2", ...)
    // .attr("stroke", ...)
    // .attr("stroke-dasharray","2")
});
