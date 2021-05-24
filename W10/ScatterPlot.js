

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            domain_margin: config.axis_margin || {top:10, right:10, bottom:10, left:10},
            radius: config.radius || 5,
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

        // scaling
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        // axis
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);

        // title
        self.title_group = self.chart.append('g');
        
    }

    update() {
        let self = this;
        const domain_margin = self.config.domain_margin;

        const xmin = d3.min( self.data, d => d.population);
        const xmax = d3.max( self.data, d => d.population);
        self.xscale.domain( [0, xmax + domain_margin.right] );

        const ymin = d3.min( self.data, d => d.infected );
        const ymax = d3.max( self.data, d => d.infected );
        self.yscale.domain( [0, ymax + domain_margin.bottom] );

        self.render();
    }

    render() {
        let self = this;

        // draw circles
        let circles =  self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle");
        circles
            .attr("cx", d => self.xscale( d.population ) )
            .attr("cy", d => self.yscale( d.infected ) )
            .attr("r",self.config.radius );

        // draw axis
        self.xaxis_group
            .call( self.xaxis )
            .append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width * 0.5)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "middle")
            .text("population * 10^-4");
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
            .text("infected with coronavirus");
        
        // draw title
        self.title_group.append("text")
            .attr("fill", "black")
            .attr("x", 0)
            .attr("y", -15)
            .attr("font-size", "12pt")
            .text("Population and Infected with Coronavirus by Prefecture");

        // tooltip
        circles
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.name}</div>
                        population(2015) : ${d.population * 10000}<br>
                        infected(5/24) : ${d.infected}<br>
                        infected rate : ${(d.infected / d.population).toFixed(3)} x 10^-4<br><br>
                        references<br>
                            pupulation : https://ja.wikipedia.org/wiki/%E9%83%BD%E9%81%93%E5%BA%9C%E7%9C%8C%E3%81%AE%E4%BA%BA%E5%8F%A3%E4%B8%80%E8%A6%A7<br>
                            infected : https://www3.nhk.or.jp/news/special/coronavirus/data/
                        `);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });
    }
}
