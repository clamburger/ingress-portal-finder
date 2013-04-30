var ingr, geoc, target = '*', lastd;
var center;
var firstTime = true;

function _ob(id){return document.getElementById(id);}

function initialize() {
   if( !window.google || !window.google.maps ) {
     return parent.postMessage('map-failed', target);
   }
   try{
     var mapOptions = {
       center: new google.maps.LatLng(-27.47281, 153.02791),
       zoom: 12,
       mapTypeId: google.maps.MapTypeId.ROADMAP,
       streetViewControl: false,
     };
     ingr = new google.maps.Map(_ob("google_map"),
         mapOptions);

     geoc = new google.maps.Geocoder();
     _ob('header').style.display = 'block';
    
     parent.postMessage('map-ready', target);

     _ob('mysearch').onclick = function(){
       _ob('searchError').innerHTML = '';
       var val = _ob('mycity').value;
       if(/^\s*$/.test(val)) {
         return _ob('mycity').focus();
       }
       geoc.geocode( { 'address': val}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            ingr.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: ingr,
              position: results[0].geometry.location
            });
          } else {
            _ob('searchError').innerHTML = "Couldn't find location.";
          }
        });
     };
     _ob('mycity').onkeypress = function(e){
      if( e.keyCode == 13 ) {
        _ob('mysearch').onclick();
      }
     };
     
     function checkBounds() {
        var bounds = ingr.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        
        if (Math.abs(ne.lat()-sw.lat()) > 1 || Math.abs(ne.lng()-sw.lng()) > 1.2) {
          _ob('searchError').innerHTML = "Can't get portals at this zoom level.";
        } else {
          _ob('searchError').innerHTML = "";
        }
          
        //console.log("Vert: "+(ne.lat()-sw.lat())+", Horiz: "+(ne.lng()-sw.lng()));
      }
     
      google.maps.event.addListener(ingr, "zoom_changed", checkBounds);
      google.maps.event.addListener(ingr, "bounds_changed", checkBounds);
      
      // This bit of code makes sure the map is properly centered when the iframe is first loaded
      var listener = google.maps.event.addListener(ingr, "center_changed", function() {
        google.maps.event.removeListener(listener);
        ingr.setCenter( center );
        console.log("Map centered");
      });
     
   } catch(e){
     return parent.postMessage('map-failed', target);
   }
}

var marker;
window.addEventListener('message', function(event) {
  console.log("Received message");
  console.log(event.data);
  var d = event.data;
  if( !ingr || !window.google || !google.maps ) {
    if( d && d.x !== undefined )
      lastd = d;

    if( lastd && lastd.lvi ) {
      lvi = lastd.lvi;
      delete lastd.lvi;
    }
    return event.source.postMessage('map-failed', target);
  }

  if( d === 'BOUNDS' ) {
    var bounds = ingr.getBounds()
      , sw = bounds.getSouthWest()
      , ne = bounds.getNorthEast()
      , center = ingr.getCenter();

    event.source.postMessage( {bounds: [[sw.lat().toFixed(6), sw.lng().toFixed(6)], [ne.lat().toFixed(6), ne.lng().toFixed(6)]], center: [center.lat().toFixed(6), center.lng().toFixed(6)], zoom: ingr.getZoom()}, target );
    sw = ne = center = bounds = null;
    return true;
  }

  if( d && d.key ) {
    var job = document.createElement('script');
    job.onload = function(){
      if( window.google && window.google.maps ) {
        initialize();
        lastd && process( lastd );
        if( ingr ) lastd = null;
      }
    };
    job.src = 'https://maps.googleapis.com/maps/api/js?key='+d.key+'&sensor=true';
    document.body.appendChild( job );
    job = null;
    return true;
  }

  if( !d || d.x === undefined || d.y === undefined)
    return false;
  
  if( d && d.lvi ) {
    lvi = d.lvi;
    delete d.lvi;
  }

  process(d);
});

var lvi = {};

function process(d){
  if( !window.google || !ingr ) {
    return false;
  }
  if( marker )
    marker.setMap(null);

  var myLatlng = new google.maps.LatLng(d.x,d.y);
  var tn = d.team ? d.team.substr(0,1).toLowerCase() : 'n'
    , ico;
  if( tn == 'n' || !lvi[tn] || lvi[tn] === false || !lvi[tn][parseInt(d.level)] ) {
    ico = new google.maps.MarkerImage(lvi[tn] ? tn +'.png' : 'n.png');
  } else {
    ico = lvi[tn][parseInt(d.level)];
  }
  marker = new google.maps.Marker({
      position: myLatlng,
      map: ingr,
      title: d.name || '',
      icon: ico
  });

  if( d.title ) {
    document.getElementById('header').style.display = 'none';
    var infowindow = new google.maps.InfoWindow({
        content: '<div style="color:'+(tn=='a'?'#060':(tn=='r'?'#309':'#000'))+'">'+d.title+'</div>'
    });
    infowindow.open(ingr, marker);
    ingr.setZoom( d.zoom || 18 );

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(ingr, marker);
    });
  } else {
    document.getElementById('header').style.display = '';
    ingr.setZoom( d.zoom || 12 );
  }

  center = myLatlng;
  if (!firstTime) {
    ingr.setCenter( myLatlng );
  }
  firstTime = false;
}