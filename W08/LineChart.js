class LineChart {

    constructor( config, data ) {
        this.config = {
            width : config.width || 256,
            height : config.height || 128,
            margin: config.margin || {top:10, right:10, bottom:20, left:60}
        }
        this.data = data;
        this.init();
    }

    init(){
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
            .domain([0, d3.max(self.data, d => d.x)])
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.y)])
            .range([self.inner_height, 0]);

        // Initialize axes
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(self.data.length)
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

    update(){
        this.renderer();
    }

    renderer(){
        let self = this;

        const line = d3.line()
            .x( d => self.xscale(d.x) )
            .y( d => self.yscale(d.y) );
        self.chart.append('path')
            .attr('d', line(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'none');
   }

}