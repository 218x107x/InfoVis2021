d3.csv("https://218x107x.github.io/InfoVis2021/W04/w04_task2.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        var config = {
            width: 256,
            height: 256,
            inner_radius: 20,
            margin: {top:10, right:10, bottom:10, left:10},
        }
        const pie_chart = new PieChart(config, data);
        pie_chart.update();
        
    })
    .catch( error => {
        console.log( error );
    }
);