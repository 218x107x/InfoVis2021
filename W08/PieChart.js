class PieChart {
    constructor( config, data ) {
        this.config = {
            width : config.width || 256,
            height : config.height || 256,
            inner_radius : config.inner_radius || 20,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init(){
        let self = this;
        self.svg = d3.select('#drawing_region')
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width /2}, ${self.config.height/2})`);

        let inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        let inner_height = self.config.height - self.config.margin.bottom - self.config.margin.top;        
        self.radius = (inner_width < inner_height) ? inner_width / 2 : inner_height / 2;
    }

    update(){
        let self = this;

        self.pie = d3.pie()
            .value( d => d.value );
            
        self.pie_group = self.svg.selectAll("pie")
            .data(self.pie(self.data))
            .enter()
            .append("g");
        
        this.renderer();
    }

    renderer(){
        let self = this;

        self.arc = d3.arc()
            .innerRadius(self.config.inner_radius)
            .outerRadius(self.radius);

        self.pie_group.append('path')
            .attr('d', self.arc)
            .attr('fill', 'green')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        self.pie_group.append("text")
            .attr("fill", "white")
            .attr("transform", d => "translate(" + self.arc.centroid(d) + ")")
            .attr("text-anchor", "middle")
            .text(d => d.data.label);
    }
}