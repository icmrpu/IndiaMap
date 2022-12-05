var geoServerIPPort = "10.96.4.34:8081";
var geoServerWorkspace = "Torrent";
var stateLayerName = "Torrent:ind_st";
/*
 var indiaStLayer = L.tileLayer.wms(
     "http://" + geoServerIPPort + "/geoserver/" + geoServerWorkspace + "/wms",
     {
         layers: stateLayerName,
         format: "image/png",
         transparent: true,
         version: "1.1.0",
         tiled: false,
     }
 );

*/
var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?',
    {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | GIS Simplified'
    });

var map = L.map('map', {
    center: [23, 79],
    zoom: 5,
    zoomControl: false,
    layers: [baseLayer]
});

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h2>Anemia Cases in India</h2>';
    // + (props ?
    //    '<br /><b>' + props.name + '</b><br />' + (props.cases/100000).toFixed(2) + ' Lac cases' : '<br />Hover mouse over the state');
};

info.addTo(map);


// get color depending on population density value
function getColor(d) {
    return d == 4 ? '#46FF00' :
        d == 3 ? '#FFE000' :
            d == 2 ? '#FF8000 ' :
                d == 1 ? '#FF0000' : '#000000';
}

function style(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'grey',
        dashArray: '',
        fillOpacity: 0.9,
        fillColor: getColor(feature.properties.ANEMIA_V)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties.ANEMIA_V);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


geojson = L.geoJson(anemia_india_b, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


// global statesData 
/*
geojson = L.geoJson(indb, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

*/

/*
geojson = L.geoJson(inds, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);



*/

// geojson = L.geoJson(indd, {
//     style: style,
//     onEachFeature: onEachFeature
// }).addTo(map);





map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 1, 2, 3, 4];
    var labels = [];
    var from, to;
    var anemiaind=['1-Severe','2-Moderate','3-Mild','4-Not anemic','Data Not Avilable']
    for (var i = 0; i < grades.length; i++) {
        from = anemiaind[i];
        color = grades[i ];

        labels.push(
            '<i style="background:' + getColor(color + 1) + '"></i> '
            +(from) + (to ? ' &ndash; ' + to + '  Anemia' : ''));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);