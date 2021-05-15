d3.csv("https://218x107x.github.io/InfoVis2021/W08/task2_data.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        var config = {
            width: 512,
            height: 256,
            margin: {top:10, right:10, bottom:20, left:40},
        }
        const line_chart = new LineChart(config, data);
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    }
);