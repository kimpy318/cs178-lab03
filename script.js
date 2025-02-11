/////////////////////////////

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
        .domain([d3.min(data, (d) => d[d3.select("#xAxisDropdown").property("value")]) - 0.1,
                d3.max(data, (d) => d[d3.select("#xAxisDropdown").property("value")]) + 0.1])
        .range([0, width]);

    // dynamically update x-scale domain
    d3.select("#xAxisDropdown").on("change", function() {
        let selectedOption = d3.select(this).property("value");

        // Update scale domain
        xScale_scatter.domain([
            d3.min(data, d => d[selectedOption]) - 0.5,
            d3.max(data, d => d[selectedOption]) + 0.5
        ]);
         
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
        .domain([d3.min(data, (d) => d[d3.select("#yAxisDropdown").property("value")]) - 0.1,
                d3.max(data, (d) => d[d3.select("#yAxisDropdown").property("value")]) + 0.1])
        .range([height, 0]);

    // dynamically update y-scale domain
    d3.select("#yAxisDropdown").on("change", function() {
        let selectedOption = d3.select(this).property("value");
            
        // Update scale domain
        yScale_scatter.domain([
            d3.min(data, d => d[selectedOption]) - 0.5,
            d3.max(data, d => d[selectedOption]) + 0.5
        ]);    
    
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
        .call(d3.axisBottom(xScale_scatter)
    );

    // TODO: Append the scaled y-axis tick marks to the svg
    svg_scatter
        .append("g")
        .attr("class", "yAxis")
        .style("font", "11px monaco")
        .call(d3.axisLeft(yScale_scatter));

    var color = d3.scaleOrdinal()
        .domain(["Setosa", "Versicolor", "Virginica" ])
        .range([ "#440154ff", "#21908dff", "#fde725ff"])
    
    svg_scatter.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale_scatter)
        .tickSize(-height)
        .tickFormat(""))
        .selectAll(".tick line")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.5);

    svg_scatter.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale_scatter)
        .tickSize(-width)
        .tickFormat(""))
        .selectAll(".tick line")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.5);


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
        .style("fill", (d) => color(d["variety"]))
        // .on("mouseover", mouseover)

    // // //TODO: add tooltip here 
    var tooltip = d3.select("#my_scatterplot")  // Select scatterplot container
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("padding", "10px")
        .style("left", "100px")  // Fixed position from left
        .style("top", "400px");  // Fixed position from top

    // Modify mouseover to not change position
    dots.on("mouseover", (event, d) => {
        let xAttribute = d3.select("#xAxisDropdown").property("value");
        let yAttribute = d3.select("#yAxisDropdown").property("value");
        
        tooltip.style("opacity", 1)
            .html(`${xAttribute}: ${d[xAttribute]}<br/>
                ${yAttribute}: ${d[yAttribute]}<br/>
                variety: ${d.variety}`);
    })
    .on("mouseout", (event, d) => {
        tooltip.style("opacity", 0);
    });

    // Handmade legend
    let legend = d3.select("#scatterplot_legend")
        .append("svg")
        .attr("width", 500)  // Increased width to accommodate horizontal layout
        .attr("height", 50)  // Reduced height since we only need one row
        .append("g")
        .attr("transform", "translate(10,10)");

    // Add colored circles for each variety
    legend.selectAll("dots")
        .data(["Setosa", "Versicolor", "Virginica"])
        .enter()
        .append("circle")
        .attr("cx", (d,i) => 130 * i + 20)  // Space circles horizontally
        .attr("cy", 30)  // Keep y position constant
        .attr("r", 5)
        .style("fill", d => color(d));

    // Add text labels
    legend.selectAll("labels")
        .data(["Setosa", "Versicolor", "Virginica"])
        .enter()
        .append("text")
        .attr("x", (d,i) => 130 * i + 30)  // Position text to the right of circles
        .attr("y", 30)  // Keep y position constant
        .style("fill", "black")
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

    legend
        .append("text")
        .attr("class", "legend-title")
        .attr("x", 130)
        .attr("y", 5)
        .style("text-decoration", "underline")
        .text("Iris Varieties")


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

    const my_attributes = ["sepal.length", "sepal.width", "petal.length", "petal.width"];
    const aggregated_data = my_attributes.map(my_attributes => ({
        attribute: my_attributes,
        AVG: d3.mean(data, d => d[my_attributes]),
        MIN: d3.min(data, d => d[my_attributes]),
        MAX: d3.max(data, d => d[my_attributes]),
    }));

    const xScale_bar = d3.scaleBand().domain(my_attributes).range([0, width]).padding(0.2);
    const yScale_bar = d3.scaleLinear().range([height, 0]);
    const bar_color = d3.scaleLinear().domain([0, 5]).range(["#fde725ff", "#440154ff"]);

    svg_bar.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(xScale_bar));
    svg_bar.append("g").attr("class", "yAxis");

    svg_bar.append("text").attr("class", "barTitle").attr("x", width / 2).attr("y", -10).style("text-anchor", "middle");
    svg_bar.append("text").attr("class", "y-axis-bar-label").attr("transform", "rotate(-90)").attr("x", -height / 2).attr("y", -40).style("text-anchor", "middle");


    svg_bar.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale_bar)
        .tickSize(-height)
        .tickFormat(""))
        .selectAll(".tick line")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.5);

    svg_bar.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale_bar)
        .tickSize(-width)
        .tickFormat(""))
        .selectAll(".tick line")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.5);
    
    function updateBar(metric) {
        yScale_bar.domain([0, d3.max(aggregated_data, d => d[metric]) * 1.1]);

        svg_bar.select(".yAxis")
            .transition()
            .duration(1000)
            .call(d3.axisLeft(yScale_bar));

        svg_bar.select(".barTitle").text(`${metric} Values Per Attribute`).style("text-decoration", "underline");
        svg_bar.select(".y-axis-bar-label").text(metric);

        const bars = svg_bar.selectAll(".bar").data(aggregated_data);

        bars.join("rect")
            .attr("class", "bar")
            .transition()
            .duration(1000)
            .attr("x", d => xScale_bar(d.attribute))
            .attr("y", d => yScale_bar(d[metric]))
            .attr("width", xScale_bar.bandwidth())
            .attr("height", d => height - yScale_bar(d[metric]))
            .attr("fill", d => bar_color(d[metric]));

        const labels = svg_bar.selectAll(".bar-label")
            .data(aggregated_data);
    
        labels.join("text")
            .attr("class", "bar-label")
            .transition()
            .duration(1000)
            .attr("x", d => xScale_bar(d.attribute) + xScale_bar.bandwidth() / 2)
            .attr("y", d => yScale_bar(d[metric]) - 5) // Position 5 pixels above the bar
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(d => d[metric].toFixed(2));
    }

    d3.selectAll("input[name='metric']").on("change", function () {
        const metric = d3.select(this).property("value");
        updateBar(metric);
    });

    updateBar("AVG");

    // Create color legend for bar chart
    let barLegend = d3.select("#barchart_legend")
        .append("svg")
        .attr("width", width + margin.left + margin.right)  // Match the width of your bar chart
        .attr("height", 50)
        .append("g")
        .attr("transform", "translate(" + margin.left + ",10)");

    // Create gradient definition
    let legendDefs = barLegend.append("defs");
    let legendGradient = legendDefs.append("linearGradient")
        .attr("id", "bar-legend-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    // Add the color stops to the gradient
    legendGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#fde725ff");

    legendGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#440154ff");

    // Add the colored rectangle
    barLegend.append("rect")
        .attr("x", 0)
        .attr("y", 20)
        .attr("width", width) 
        .attr("height", 15)
        .style("fill", "url(#bar-legend-gradient)");

    // Add scale for the axis
    let legendScale = d3.scaleLinear()
        .domain([0, d3.max(aggregated_data, d => d[d3.select("input[name='metric']:checked").property("value")])])  // Dynamic domain based on selected metric
        .range([0, width]);

    // Add the axis
    let legendAxis = d3.axisBottom(legendScale)
        .ticks(5);

    barLegend.append("g")
        .attr("transform", "translate(0,35)")
        .call(legendAxis);

    // Add title
    barLegend.append("text")
        .attr("x", width/2)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Range of Values");

});