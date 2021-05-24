/*
d3.csv("https://218x107x.github.io/InfoVis2021/W04/w04_task1.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:40, right:40, bottom:40, left:40},
            domain_margin: {top:10, right:10, bottom:10, left:10} // Modified from sample ex05
        }

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    }
);
*/

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            domain_margin: config.axis_margin || {top:10, right:10, bottom:10, left:10} // Modified from sample ex05
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );   // Modified from sample ex05

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);
        
    }

    update() {
        let self = this;
        const domain_margin = self.config.domain_margin;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin - domain_margin.left, xmax + domain_margin.right] );  // Modified from sample ex05

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymin - domain_margin.top, ymax + domain_margin.bottom] );  // Modified from sample ex05

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        // Modified from sample ex05
        self.xaxis_group
            .call( self.xaxis )
            .append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width * 0.5)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "middle")
            .text("x");
        self.yaxis_group
            .call( self.yaxis )
            .append("text")
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("x", -self.inner_height * 0.5)
            .attr("y", -30)
            .attr("transform", "rotate(-90)")
            .attr("font-weight", "middle")
            .attr("font-size", "10pt")
            .text("y");
    }
}
