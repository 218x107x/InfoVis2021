d3.csv("https://218x107x.github.io/InfoVis2021/W10/task2_data.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.population = +d.population; d.infected = +d.infected; });
        // Decrease the number of digits
        data.forEach( d => { d.population *= 0.0001; });
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:40, right:40, bottom:40, left:60},
            domain_margin: {top:10, right:10, bottom:10, left:10},
            radius: 8
        }

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    }
);