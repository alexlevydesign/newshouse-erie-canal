
let desktopScreenHeight = window.innerHeight;
let desktopScreenWidth = window.innerWidth;

function desktopReportWindowSize() {
    let desktopScreenWidth = window.innerWidth;
    if (desktopScreenWidth > 600) {
        console.log("Desktop:" + desktopScreenWidth);

    // Set margins
const margin = { top: 120, right: 120, bottom: 120, left: 120 };
// const height = 400 - margin.top - margin.bottom;

// Function to render the chart based on the current width of #chart
function renderChart() {
    // Get current width of the #chart element from CSS
    const svgContainer = d3.select("#chart").node();
    const width = parseFloat(getComputedStyle(svgContainer).width) - margin.left - margin.right;
    const height = parseFloat(getComputedStyle(svgContainer).height) - margin.top - margin.bottom;

    // Clear existing chart contents to re-render on resize
    d3.select("#chart").selectAll("*").remove();

    // Set up the SVG canvas
    const svg = d3.select("#chart")
        // .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load and process data
    d3.csv("data.csv").then(data => {
        data.forEach(d => {
            d["Percent Population Change"] = +d["Percent Population Change"].replace('%', '');
        });

        // Set up scales
        const x = d3.scaleBand()
            .domain(data.map(d => d.City))
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            // .domain([0, d3.max(data, d => d["Percent Population Change"])])
            .domain([0, 1400])
            // .nice()
            .range([height, 0]);

        // Draw X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Draw Y axis
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d3.format("d")).ticks(7));

        // Draw bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.City))
            .attr("y", d => y(d["Percent Population Change"]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d["Percent Population Change"]));

        // Add X axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            // .attr("y", height + margin.bottom - 10)
            .attr("y", height + (margin.bottom/1.5))
            .text("City")
            .attr("class", "axis-title desktop");

        // Add Y axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            // .attr("y", -margin.left + 15)
            .attr("y", 1-(margin.left/1.5))
            .text("Percent Population Change")
            .attr("class", "axis-title desktop");

        svg.append("text")
        .text("Desktop Chart")
        .attr("x", width/2)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title desktop");
    }).catch(error => console.error("Error loading CSV file:", error));
}

// Initial render
renderChart();

// Add event listener to resize chart when window is resized
window.addEventListener("resize", renderChart);
} else {
    console.log("Desktop fail");
}
    }

window.onresize = desktopReportWindowSize;