// this loads the list of availible IDs and places them in the dropdown in the HTML
d3.json('samples.json').then(function(data) {
    var sampleNames = data.names;
        d3.select('#selDataset').selectAll('option').data(sampleNames)
        .enter().append('option').html(function (m) {
            return` ${m} `
        }) 

});

// This function loads the correct data and creates the bar graph
function reload(ID) {
    d3.json('samples.json').then(function(dbar) {
        function barFilter (num) {return num.id == ID}
        var barResults = dbar.samples.filter(barFilter)
        var values = barResults[0].sample_values
        var idnames = barResults[0].otu_ids.map(function (i) {return `OTU ${i}`})
        var label = barResults[0].otu_labels
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
                // Begins the bubble graph
            reloadBuble(ID , barResults , values , label)
                // Triggers the Demographic info to load 
            reloadinfo(ID,dbar)

    })
}


// Tjis generates the bubble graph
function reloadBuble(ID , bubbleResults , values , label ){

    var idNumber = bubbleResults[0].otu_ids

    var trace1 = {
        x : idNumber, 
        y : values , 
        text: label, 
        type : "scatter", 
        mode : 'markers',
        marker : {
            color: idNumber,
            colorscale: [[0, 'rgb(0,0,255)'], [1, 'rgb(165,42,42)']], 
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
};

// Generates the demographic info 
function reloadinfo (ID , data){

    function barFilter (num) {return num.id == ID}
    var infoResults = data.metadata.filter(barFilter)
    var values = infoResults[0]
    var ul = d3.select('#sample-metadata').html("")
    Object.entries(values).forEach( ([key,value]) => {
        ul.append('p').text(`${key}: ${value}`)
    })


};

// Triggers the chain of reload functions
function optionChanged () {
    id = d3.select('#selDataset').property('value');
    reload(id)
    return id
};