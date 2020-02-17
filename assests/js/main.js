let rowData = [];
let pieData = [];
let barDate = [];
d3.csv('assests/data/sales-data-set.csv', (res) => {
    rowData.push(res);
}).then(() => {
    let data = [...rowData];
    console.log(rowData);
    pieObj = {};
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
        });
    for (const key in pieObj) {
        if (pieObj.hasOwnProperty(key)) {
            pieData.push({
                name: key,
                value: pieObj[key]
            });
        }
    }
    console.log(pieData);
    drawPie();

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
        .attr('height', height + 50);

    let g = svg.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    let pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    let path = g.selectAll('path')
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

            let g = d3.select("svg")
                .style("cursor", "pointer")
                .append("g")
                .attr("class", "tooltip-ele")
                .style("opacity", 0);

            g.append("text")
                .attr("class", "name-text")
                .text(`${d.data.name} (${d.data.value})`)
                .attr('text-anchor', 'middle');

            let text = g.select("text");
            let bbox = text.node().getBBox();
            let padding = 2;
            g.insert("rect", "text")
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + (padding * 2))
                .attr("height", bbox.height + (padding * 2))
                .style("fill", "white")
                .style("opacity", 0.75);
        })
        .on("mousemove", function(d) {
            let mousePosition = d3.mouse(this);
            let x = mousePosition[0] + width / 2;
            let y = mousePosition[1] + height / 2 - tooltipMargin;

            let text = d3.select('.tooltip-ele text');
            let bbox = text.node().getBBox();
            if (x - bbox.width / 2 < 0) {
                x = bbox.width / 2;
            } else if (width - x - bbox.width / 2 < 0) {
                x = width - bbox.width / 2;
            }

            if (y - bbox.height / 2 < 0) {
                y = bbox.height + tooltipMargin * 2;
            } else if (height - y - bbox.height / 2 < 0) {
                y = height - bbox.height / 2;
            }

            d3.select('.tooltip-ele')
                .style("opacity", 1)
                .attr('transform', `translate(${x}, ${y})`);
        })
        .on("mouseout", function(d) {
            d3.select("svg")
                .style("cursor", "none")
                .select(".tooltip-ele").remove();
            d3.selectAll('path')
                .style("opacity", opacity);
        })
        .on("touchstart", function(d) {
            d3.select("svg")
                .style("cursor", "none");
        })
        .each(function(d, i) { this._current = i; });

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