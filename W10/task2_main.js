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