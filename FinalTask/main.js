d3.csv("https://218x107x.github.io/InfoVis2021/FinalTask/data/COVID-19-geographic-disbtribution-worldwide.csv")
    .then( data => {
        // Convert strings to numbers
        // data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        var config = {
            width: 512,
            height: 256,
            margin: {top:10, right:10, bottom:20, left:40},
            animation_duration: 1000
        }
        
    })
    .catch( error => {
        console.log( error );
    }
);