d3.csv("https://covid.ourworldindata.org/data/latest/owid-covid-latest.csv")
    .then( data1 => {
        d3.csv("https://218x107x.github.io/InfoVis2021/FinalTask/data/WHR20_DataForFigure2.1.csv")
            .then( data2 => {
                d3.json("https://218x107x.github.io/InfoVis2021/FinalTask/data/countries.json")
                    .then( map => {
                        COVID_input_data = data1;
                        HAPPINESS_input_data = data2;
                        world_map = map;

                        setup_data();
                        main();
                    })
            })
    })
    .catch( error => {
        console.log( error );
    }
);

function setup_data() { 
    // Extract countries that exist in both data.
    let name_filter = [];
    HAPPINESS_input_data.forEach(d => {
        if(!name_filter.includes(d[`Country name`])){
            name_filter.push(d[`Country name`]);
        }
    });
    COVID_data = COVID_input_data.filter( d => {
        return name_filter.includes(d.location);
    });

    self.cases_kinds = COVID_input_data.columns.slice(0).slice(4, 16);
    self.score_kinds = HAPPINESS_input_data.columns.slice(0).slice(2, 19);

    // convert string to number
    COVID_input_data.forEach( cd => {
        self.cases_kinds.forEach( kind => {
            cd[kind] = +cd[kind];
        });
    });
    HAPPINESS_input_data.forEach( hd => {
        self.score_kinds.forEach( kind => {
            hd[kind] = +hd[kind];
        });
    });

    // Combine the two data
    data = [];
    COVID_data.forEach( cd => {
        hd = HAPPINESS_input_data.find( d => cd.location === d[`Country name`]);
        if(hd == null) return;
        
        let data1 = {
            country: cd.location,
        };
        self.cases_kinds.forEach( kind => data1[kind] = cd[kind] );
        self.score_kinds.forEach( kind => data1[kind] = hd[kind] );
        data.push(data1);
    });
}


function main() {
    let self = this;

    // title
    d3.select('#drawing_region_title').style(`background-color`, `orange`).append('g')
        .append('text')
        .style('font-size', `30px`)
        .attr('x', 16)
        .attr('y', 42)
        .attr('text-anchor', 'start')
        .text(`Relationship between the number of people infected with coronavirus and happiness score`)

    // graphs
    self.scatter_plot = new ScatterPlot({
        parent: '#drawing_region_scatter',
        width : 500,
        height: 500,
        margin: {top:30, right:10, bottom:100, left:120},
        xvalue: function(d){ return d[`Ladder score`]; },
        yvalue: function(d){ return d[`total_cases`]; },
        xlabel: 'happiness score',
        ylabel: 'COVID cases',
        fontsize: `20px`
    }, data);
    self.scatter_plot.update();

    happiness_world_map = new WorldColorMap({
        parent: '#drawing_region_happiness',
        width : 560,
        height: 320,
        viewBox: `0 0 560 160`,
        scale : 64,
        margin: {top:10, right:50, bottom:50, left:10},
        value : function(d){ return d[`Ladder score`]; },
        color_theme: d3.interpolateMagma,
        label : `Happiness score`
    }, data, world_map);
    self.happiness_world_map.update();

    self.covid_world_map = new WorldColorMap({
        parent: '#drawing_region_covid',
        width : 560,
        height: 320,
        viewBox: `0 0 560 160`,
        scale : 64,
        margin: {top:10, right:50, bottom:50, left:10},
        value : function(d){ return d[`total_cases`]; },
        color_theme: d3.interpolateOrPu,
        label : `COVID cases`
    }, data, world_map);
    self.covid_world_map.update();

    // happiness score kind selection box
    var options = self.score_kinds;
    var happiness_selection = d3.select("#selectBox_happiness")
        .style("width","512")
        .style("height","32")
        .style("font-size", "20")   
    happiness_selection.selectAll("option").data(options).enter()
        .append("option")
        .attr("value", d => { return d; })
        .append("text")
        .text(d => { return d })
    document.getElementById("selectBox_happiness").options[0].selected = true;

    happiness_selection.attr("onchange", "scoreKindChange()");

    // covid cases kind selection box
    options = self.cases_kinds;
    var covid_selection = d3.select("#selectBox_covid")
        .style("width","512")
        .style("height","32")
        .style("font-size", "20")
    covid_selection.selectAll("option").data(options).enter()
        .append("option")
        .attr("value", d => { return d; })
        .append("text")
        .text(d => { return d })
    document.getElementById("selectBox_covid").options[0].selected = true;

    covid_selection.attr("onchange", "casesKindChange()");
}


// reflect selection box value to graph
function scoreKindChange() {
    var selection = document.getElementById("selectBox_happiness");
    var index = selection.selectedIndex;
    var option = selection.options[index].value;
    
    self.scatter_plot.config.xvalue = function(d){ return d[option]; };
    self.scatter_plot.config.xlabel = option;
    self.scatter_plot.update();

    self.happiness_world_map.config.value = function(d){ return d[option]; };
    self.happiness_world_map.config.label = option;
    self.happiness_world_map.update();
}

// reflect selection box value to graph
function casesKindChange() {
    let selection = document.getElementById("selectBox_covid");
    let index = selection.selectedIndex;
    let option = selection.options[index].value;
    
    self.scatter_plot.config.yvalue = function(d){ return d[option]; };
    self.scatter_plot.config.ylabel = option;
    self.scatter_plot.update();

    self.covid_world_map.config.value = function(d){ return d[option]; };
    self.covid_world_map.config.label = option;
    self.covid_world_map.update();
}


//
function Filter(clicked_country) {
    self.scatter_plot.update_filter(clicked_country);
    self.happiness_world_map.update_filter(clicked_country);
    self.covid_world_map.update_filter(clicked_country);
}