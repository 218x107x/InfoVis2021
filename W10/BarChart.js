class BarChart {

    constructor( config, data ) {
        this.config = {
            width : config.width || 256,
            height : config.height || 128,
            margin : config.margin || {top:10, right:10, bottom:20, left:60},
            animation_duration : config.animation_duration || 1000
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        self.svg = d3.select('#drawing_region')
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.bottom - self.config.margin.top;

        // Initialize axis scales
        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.value)])
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .domain(self.data.map(d => d.label))
            .range([0, self.inner_height])
            .paddingInner(0.1);

        // Initialize axes
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        // Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call( self.xaxis );

        self.yaxis_group = self.chart.append('g')
            .call( self.yaxis );
    }

    update(data) {
        let self = this;
        self.data = data;

        self.xscale
            .domain([0, d3.max(self.data, d => d.value)]);
        self.yscale
            .domain(self.data.map(d => d.label))

        self.renderer();
    }

    renderer() {
        let self = this;
        
        self.chart.selectAll("rect").data(self.data)
            .join("rect")
            .transition().duration(self.config.animation_duration)
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());

        self.yaxis_group
            .call( self.yaxis );
    }

}