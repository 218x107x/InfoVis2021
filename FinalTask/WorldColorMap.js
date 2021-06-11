
class WorldColorMap {

    now_selected_countries = [];

    // convert country name defined by world map to defined by data file.
    name_filter = function(name) {
        if(name == "United States of America")
            return "United States"
        return name;
    };

    constructor(config, data, world_map) {
        this.config = {
            parent: config.parent,
            width : config.width  || 256,
            height: config.height || 256,
            scale : config.scale  || 50,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            value : config.value,
            label : config.label  || ``,
        }
        this.data       = data;
        this.world_map  = world_map;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr("width", self.config.width)
            .attr("height", self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

    }

    update() {
        let self = this;

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        // world map
        self.projection = d3.geoMercator()
            .scale(self.config.scale)
            .center([0, 0])  
            .translate([self.inner_width / 2, self.inner_height / 2]);

        self.path = d3.geoPath().projection(self.projection);

        // color scale
        self.min = d3.min(data, self.config.value);
        self.max = d3.max(data, self.config.value);

        self.cscale = d3.scaleSequential(d3.interpolateYlOrRd)
            .domain([self.min, self.max]);

        self.colorByName = ( country => {; 
            var d = self.data.find( d => { return d.country == country; });
            if( d == null ) 
                return "white";
            else if( self.now_selected_countries.length === 0 || self.now_selected_countries.includes(country)) 
                return self.cscale(self.config.value(d));    
            else
                return "white";
        });

        self.render();
    }

    render() {
        let self = this;

        // world map
        self.countries = self.chart.selectAll('path')
            .data(world_map.features)
            .join(`path`);

        self.countries
            .attr('d', self.path)
            .style("fill", (country) => {
                return self.colorByName(self.name_filter(country.properties.NAME));
            })
            .attr("stroke", "black")
            .on('click', (ev,d) => {
                Filter(self.name_filter(d.properties.NAME))
            })

        // mouse
        self.countries
            .on('mouseover', (e,d) => {
                var name = self.name_filter(d.properties.NAME);
                var d1= self.data.find( data => { return data.country == name });
                var value = (d1 == null) ?  0 : Math.floor(self.config.value(d1) * 1000) / 1000;

                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${name}</div>
                    ${self.config.label} : ${value}
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
            
        // label
        var label = self.chart.select(`#label`);
        if(label.empty())
            label = self.chart.append(`text`).attr(`id`, `label`);
            
        label.style('font-size', '16px')
            .attr('x', self.inner_width / 2)
            .attr('y', self.inner_height + self.config.margin.top + 20)
            .attr('text-anchor', 'middle')
            .text( self.config.label );
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