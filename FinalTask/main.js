d3.csv("https://covid.ourworldindata.org/data/latest/owid-covid-latest.csv")
    .then( data1 => {
        d3.csv("https://218x107x.github.io/InfoVis2021/FinalTask/data/WHR20_DataForFigure2.1.csv")
            .then( data2 => {
                d3.json("https://218x107x.github.io/InfoVis2021/FinalTask/data/countries.json")
                    .then( map => {
                        COVID_input_data = data1;
                        HAPPINESS_input_data = data2;
                        world_map = map;
                        // convert string to number
                        COVID_input_data.forEach( d => {
                            d.total_cases = +d.total_cases;
                        });
                        HAPPINESS_input_data.forEach( d => {
                            d[`Ladder score`] = +d[`Ladder score`];
                        });

                        Filter();
                        main();
                    })
            })
    })
    .catch( error => {
        console.log( error );
    }
);

function Filter() { 
    // Extract countries that exist in both data.
    filter = [];
    HAPPINESS_input_data.forEach(d => {
        if(!filter.includes(d[`Country name`])){
            filter.push(d[`Country name`]);
        }
    });
    COVID_data = COVID_input_data.filter( d => {
        return filter.includes(d.location);
    });
}

function main() {
     // Combine the two data
     data = [];
     COVID_data.forEach( cd => {
         hd = HAPPINESS_input_data.find( d => cd.location === d[`Country name`]);
         if(hd == null) return;         
         data.push({
             country    : cd.location,
             cases      : cd.total_cases / cd.population,
             score      : hd[`Ladder score`],
             population : cd.population,
         });
     });

    scatter_plot = new ScatterPlot({
        parent: '#drawing_region_scatterplot',
        width : 512,
        height: 512,
        margin: {top:10, right:10, bottom:100, left:100},
        xlabel: 'happiness score',
        ylabel: 'COVID cases / population',
        fontsize: `16px`
    }, data);
    scatter_plot.update();

    happiness_world_map = new WorldColorMap({
        parent: '#drawing_region_happiness_worldmap',
        width : 512,
        height: 512,
        scale : 64,
        margin: {top:10, right:50, bottom:100, left:10},
        value : function(d){ return d.cases; },
        label : `COVID cases for each country`
    }, data, world_map);
    happiness_world_map.update();

    covid_world_map = new WorldColorMap({
        parent: '#drawing_region_covid_worldmap',
        width : 512,
        height: 512,
        scale : 64,
        margin: {top:10, right:50, bottom:100, left:10},
        value : function(d){ return d.score; },
        label : `Happiness score for each country`
    }, data, world_map);
    covid_world_map.update();
}