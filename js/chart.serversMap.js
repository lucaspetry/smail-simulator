
function ServersMap() {
    this.svg;
    this.rowLabels;
    this.colLabels;

    this.buckets = 9;
    this.colors = ["#41ab5d", "#41ab5d", "#41ab5d", "#d83838"];
    this.rows = ["1", "2", "3", "4", "5"];
    this.cols = [];
    this.numCols = 0;
    
    this.numServers = 0;
    
    this.build = function(divId, data, numServers) {
        var margin = { top: 25, right: 0, bottom: 20, left: 30 };
        var width = 332 - margin.left - margin.right;
        var height = 120 - margin.top - margin.bottom;
        var gridSize = Math.floor(width / 20);
        this.numServers = numServers;
        
        this.numCols = Math.ceil(numServers/this.rows.length);

        this.cols = [];
        for(i = 1; i <= this.numCols; i++)
            this.cols.push(i);
        
        d3.select(divId).html("");
        
        this.svg = d3.select(divId).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.rowLabels = this.svg.selectAll(".rowLabel")
          .data(this.rows)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .style("font-size", "9px")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")");

        this.colLabels = this.svg.selectAll(".colLabel")
          .data(this.cols)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .style("font-size", "9px")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)");

        colorScale = d3.scale.quantile()
          .domain([0, this.buckets - 1, d3.max(data, function (d) { return d.value; })])
          .range(this.colors);

        cards = this.svg.selectAll(".col")
          .data(data, function(d) {return d.row+':'+d.col;});

        cards.append("title");

        cards.enter().append("rect")
          .attr("x", function(d) { return (d.col - 1) * gridSize; })
          .attr("y", function(d) { return (d.row - 1) * gridSize; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("class", "col bordered")
          .attr("width", gridSize)
          .attr("height", gridSize)
          .style("fill", this.colors[0]);

        cards.transition().duration(250)
          .style("fill", function(d) { return colorScale(d.value); });

        cards.select("title").text(function(d) { return d.value; });

        cards.exit().remove();
    }

    this.update = function(data) {        
        var colorScale = d3.scale.quantile()
          .domain([0, this.buckets - 1, d3.max(data, function (d) { return d.value; })])
          .range(this.colors);

        var cards = this.svg.selectAll(".col")
          .data(data, function(d) {return d.row+':'+d.col;});

        cards.transition().duration(250)
          .style("fill", function(d) { return colorScale(d.value); });

        cards.select("title").text(function(d) { return d.value; });
    };
    
}