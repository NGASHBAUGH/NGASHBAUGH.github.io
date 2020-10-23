d3.json('samples.json').then(function(data) {
    console.log(data.samples[0].sample_values)
    var sampleNames = data.names;
        d3.select('#selDataset').selectAll('option').data(sampleNames)
        .enter().append('option').html(function (m) {
            return` ${m} `
        }) 

});


function reload(ID) {
    console.log("This worked")
    d3.json('samples.json').then(function(dbar) {
        console.log(dbar.samples)
        console.log(ID)

        function barFilter (num) {return num.id == ID}

        var barResults = dbar.samples.filter(barFilter)
        console.log(barResults)

        var values = barResults[0].sample_values
        console.log(values)
        var idnames = barResults[0].otu_ids.map(function (i) {return `OTU ${i}`})
        console.log(idnames)
        var label = barResults[0].otu_labels
        console.log(label)
        trace = {
            y : idnames.slice(0, 10).reverse(), 
            x : values.slice(0, 10).reverse(), 
            text : label.slice(0, 10).reverse(),
            type: 'bar',
            orientation : 'h'

        };
        var barData = [trace]

        var layout = {
            title: 'Top 10 Samples'
        };

        Plotly.newPlot('bar' , barData , layout);

            reloadBuble(ID , barResults , values , label)

            reloadinfo(ID,dbar)

    })
}



function reloadBuble(ID , bubbleResults , values , label ){

    var idNumber = bubbleResults[0].otu_ids
    console.log(idNumber)

    var trace1 = {
        x : idNumber, 
        y : values , 
        text: label, 
        type : "scatter", 
        mode : 'markers',
        marker : {
            color: idNumber,
            colorscale: [[0, 'rgb(200, 255, 200)'], [1, 'rgb(0, 100, 0)']], 
            cmin: d3.min(idNumber),
            cmax: d3.max(idNumber),
            size : values
        }
    };
    var data1 = [trace1];
    var layout1 = {
        showlegend: false, 

    }
    Plotly.newPlot('bubble' , data1 , layout1)
    
}

function reloadinfo (ID , data){

    function barFilter (num) {return num.id == ID}

    var infoResults = data.metadata.filter(barFilter)
    console.log(infoResults)

    var values = infoResults[0]
    console.log(values)

    var ul = d3.select('#sample-metadata').html("")
    Object.entries(values).forEach( ([key,value]) => {
        ul.append('p').text(`${key}: ${value}`)
    })


}


function optionChanged () {
    id = d3.select('#selDataset').property('value');
    console.log(id)
    reload(id)
    return id
}
