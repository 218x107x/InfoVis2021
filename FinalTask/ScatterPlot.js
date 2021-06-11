
class ScatterPlot {

    now_selected_countries = [];

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xvalue: config.xvalue,
            yvalue: config.yvalue,
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            fontsize: config.fontsize || `12px`
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr("width", self.config.width)
            .attr("height", self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        // scaling range
        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        // axis
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');
    }

    update() {
        let self = this;

        // scaling domain
        const xmin = d3.min( self.data, self.config.xvalue );
        const xmax = d3.max( self.data, self.config.xvalue );
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, self.config.yvalue );
        const ymax = d3.max( self.data, self.config.yvalue );
        self.yscale.domain( [ymin, ymax] );

        self.cscale = d => { 
            if( self.now_selected_countries.length === 0 ) return "black";
            if( self.now_selected_countries.includes(d.country) ) return "red";
            else return "silver";
        }
          
        self.render();
    }

    render() {
        let self = this;

        // point
        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .join('circle');

        const circle_color = 'steelblue';
        const circle_radius = 8;
        circles
            .attr("r", circle_radius )
            .attr("cx", d => self.xscale( self.config.xvalue(d) ) )
            .attr("cy", d => self.yscale( self.config.yvalue(d) ) )
            .attr("fill", d => self.cscale(d))
            .on('click', (ev,d) => Filter(d.country) );

        // mouse
        circles
            .on('mouseover', (e,d) => {
                var xvalue = Math.floor(self.config.xvalue(d) * 100) / 100;
                var yvalue = Math.floor(self.config.yvalue(d) * 100) / 100;

                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.country}</div>
                    ${self.config.xlabel} : ${xvalue}<br>
                    ${self.config.ylabel} : ${yvalue}
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

        // axis
        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );

        // label
        const xlabel_space = 40;
        var xlabel = self.chart.select(`#xlabel`);
        if(xlabel.empty())
            xlabel = self.chart.append('text').attr(`id`, `xlabel`);

        xlabel.style('font-size', self.config.fontsize)
            .attr('x', self.inner_width / 2)
            .attr('y', self.inner_height + xlabel_space)
            .attr('text-anchor', 'middle')
            .text( self.config.xlabel );

        const ylabel_space = 60;
        var ylabel = self.chart.select(`#ylabel`);
        if(ylabel.empty())
            ylabel = self.chart.append('text').attr(`id`, `ylabel`);

        ylabel.style('font-size', self.config.fontsize)
            .attr('transform', `rotate(-90)`)
            .attr('y', -ylabel_space)
            .attr('x', -self.inner_height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }


    update_filter(clicked_country) {
        if(this.now_selected_countries.includes(clicked_country)) {
            this.now_selected_countries = this.now_selected_countries.filter( d => d != clicked_country);
        }
        else {
            this.now_selected_countries.push(clicked_country);
        }
        this.update();
    }
}