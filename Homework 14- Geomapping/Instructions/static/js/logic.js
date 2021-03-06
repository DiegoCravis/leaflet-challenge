// JSON link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(mag) {
  return mag * 30000;
}

function markerColor(mag) {
  if (mag <= 1) {
      return "#FBEEE6";
  } else if (mag <= 2) {
      return "#EDBB99";
  } else if (mag <= 3) {
      return "#DC7633";
  } else if (mag <= 4) {
      return "#BA4A00";
  } else if (mag <= 5) {
      return "#A04000";
  } else {
      return "#6E2C00";
  };
}

d3.json(link, function(data) {
  createFeatures(data.features);
});

function createFeatures(ourData) {

  var earthquakes = L.geoJSON(ourData, {
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Mag.: " +  feature.properties.mag + "</p>")
    },     
        pointToLayer: function (feature, latlng) {
        return new L.circle(latlng,
            {radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.properties.mag),
            fillOpacity: 1,
            stroke: false,
    })
  }
  });
    
    createMap(earthquakes);
}

function createMap(earthquakes) {
  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });


  
  var baseMaps = {
    "Satellite Map": satmap,
    "Dark Map": darkmap
  };
  var overlayMaps = {
    Earthquakes: earthquakes
  };


  var map = L.map("map", {
    center: [30,-100],
    zoom: 3,
    layers: [satmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  var legend = L.control({position: 'topright'});

  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(map);
}