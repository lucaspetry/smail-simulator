
function ServersMap() {
    this.svg;
    this.rowLabels;
    this.colLabels;

    this.margin = { top: 30, right: 0, bottom: 30, left: 30 };
    this.width = 412 - this.margin.left - this.margin.right;
    this.height = 100 - this.margin.top - this.margin.bottom;
    this.gridSize = Math.floor(this.width / 30);
    this.buckets = 10;
    this.colors = ["#41ab5d", "#41ab5d", "#41ab5d", "#d83838"];
    this.rows = ["1", "2", "3", "4", "5"];
    this.cols = [];
    this.numCols = 0;

    this.build = function(divId, dataset, numServers) {
        this.numCols = Math.ceil(numServers/this.rows.length);

        this.cols = [];
        for(i = 1; i <= this.numCols; i++)
            this.cols.push(i);
        
        this.svg = d3.select(divId).append("svg")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.rowLabels = this.svg.selectAll(".rowLabel")
          .data(this.rows)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * this.gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + this.gridSize / 1.5 + ")");

        this.colLabels = this.svg.selectAll(".colLabel")
          .data(this.cols)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * this.gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + this.gridSize / 2 + ", -6)");

        this.heatmapChart(dataset);
    }

    this.heatmapChart = function(data) {
      var colorScale = d3.scale.quantile()
          .domain([0, this.buckets - 1, d3.max(data, function (d) { return d.value; })])
          .range(this.colors);

      var cards = this.svg.selectAll(".col")
          .data(data, function(d) {return d.row+':'+d.col;});

      cards.append("title");

      cards.enter().append("rect")
          .attr("x", function(d) { return (d.col - 1) * this.gridSize; })
          .attr("y", function(d) { return (d.row - 1) * this.gridSize; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("class", "col bordered")
          .attr("width", this.gridSize)
          .attr("height", this.gridSize)
          .style("fill", this.colors[0]);

      cards.transition().duration(1000)
          .style("fill", function(d) { return colorScale(d.value); });

      cards.select("title").text(function(d) { return d.value; });

      cards.exit().remove();
    };
}