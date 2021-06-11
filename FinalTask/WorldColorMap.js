
class WorldColorMap {

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
            value : config.value  || function(d){ return d.cases; },
            label : config.label  || ``,
        }
        this.data       = data;
        this.world_map  = world_map;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

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

        self.colorByName = ( name => {
            var d = self.data.find( d => { return d.country == self.name_filter(name); });
            if( d == null ) return "white";
            return self.cscale(self.config.value(d));
        });

        self.render();
    }

    render() {
        let self = this;

        // world map
        self.chart.selectAll('path')
            .data(world_map.features)
            .enter()
            .append('path')
            .attr('d', self.path)
            .style("fill", (country) => {
                return self.colorByName(country.properties.NAME);
            })
            .attr("stroke", "black")
            

        // label
        self.chart.append('text')
            .style('font-size', '16px')
            .attr('x', self.config.margin.left + self.inner_width / 2)
            .attr('y', self.inner_height + self.config.margin.top + 20)
            .attr('text-anchor', 'middle')
            .text( self.config.label );
    }
}