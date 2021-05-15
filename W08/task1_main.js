d3.csv("https://218x107x.github.io/InfoVis2021/W04/w04_task2.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        var config = {
            width: 512,
            height: 256,
            margin: {top:10, right:10, bottom:20, left:40},
        }
        const bar_chart = new BarChart(config, data);
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    }
);
