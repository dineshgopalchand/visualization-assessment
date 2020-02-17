let rowData = [];
let pieData = [];
let barData = [];
d3.csv('assests/data/sales-data-set.csv', (res) => {
    rowData.push(res);
}).then(() => {
    let data = [...rowData];
    // console.log(rowData);
    pieObj = {};
    barObj = {};
    data.map(item => {
            const date = item.Date.split('/');
            item.Date = date[2];
            return item;
        })
        .forEach(ele => {
            // pieData.push()
            // console.log(ele);
            if (ele.IsHoliday === 'TRUE') {
                pieObj[ele.Date] = pieObj[ele.Date] ? pieObj[ele.Date] + 1 : 1;
            }
            barObj[ele.Date] = barObj[ele.Date] ? barObj[ele.Date] + parseFloat(ele.Weekly_Sales) : parseFloat(ele.Weekly_Sales);
        });
    for (const key in pieObj) {
        if (pieObj.hasOwnProperty(key)) {
            pieData.push({
                name: key,
                value: pieObj[key]
            });
        }
    }
    for (const key in barObj) {
        if (barObj.hasOwnProperty(key)) {
            barData.push({
                name: key,
                value: parseInt(barObj[key], 10)
            });
        }
    }
    // console.log(barData);
    // console.log(pieData);
    drawPie();
    drawBarChart();

});

function drawPie() {
    let data = pieData;
    let text = "";

    let width = 350;
    let height = 350;
    let padding = 10;
    let opacity = .8;
    let opacityHover = 1;
    let otherOpacityOnHover = .8;
    let tooltipMargin = 13;

    let radius = Math.min(width - padding, height - padding) / 2;
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let svg = d3.select("#pie")
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height + 70);

    let g = svg.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    let pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    g.selectAll('path')
        .data(pie(data))
        .enter()
        .append("g")
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .style('opacity', opacity)
        .style('stroke', 'white')
        .on("mouseover", function(d) {
            d3.selectAll('path')
                .style("opacity", otherOpacityOnHover);
            d3.select(this)
                .style("opacity", opacityHover);


        })

    .on("mouseout", function(d) {
        d3.selectAll('path')
            .style("opacity", opacity);
    });

    let legend = d3.select("#pie").append('div')
        .attr('class', 'legend')
        .style('margin-top', '30px');

    let keys = legend.selectAll('.key')
        .data(data)
        .enter().append('div')
        .attr('class', 'key')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('margin-right', '20px');

    keys.append('div')
        .attr('class', 'symbol')
        .style('height', '10px')
        .style('width', '10px')
        .style('margin', '5px 5px')
        .style('background-color', (d, i) => color(i));

    keys.append('div')
        .attr('class', 'name')
        .text(d => `${d.name} (${d.value})`);

    keys.exit().remove();
    svg.append("text")
        .attr('class', 'title')
        .attr("x", width / 2)
        .attr("y", height + 10)
        .style("text-anchor", "middle")
        .text("Pie chart for no of holidays");
}

function drawBarChart() {
    console.log(barData);
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    const data = [...barData];
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 40, left: 80 },
        width = 400 - margin.left - margin.right,
        height = 370 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);
    var svg = d3.select("#bar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr('fill', (d, i) => color(i))
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr('class', 'title')
        .attr("x", width / 2)
        .attr("y", height + 40)
        .style("text-anchor", "middle")
        .text("Bar chart for Sales in year");

}