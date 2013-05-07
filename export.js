var Base64 = {};
Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
Base64.encode = function(str, utf8encode) {
  utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
  var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
  var b64 = Base64.code;
   
  plain = utf8encode ? Utf8.encode(str) : str;
  
  c = plain.length % 3;
  if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
  for (c=0; c<plain.length; c+=3) {
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c+1);
    o3 = plain.charCodeAt(c+2);
      
    bits = o1<<16 | o2<<8 | o3;
      
    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join('');
  coded = coded.slice(0, coded.length-pad.length) + pad;
  return coded;
}

var Utf8 = {};
Utf8.encode = function(strUni) {
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}

// escape xml
function vxml( s ) {
  if( !s && !s.toString )
    return '';

  if( typeof(s) !== 'string' )
    s = s.toString();

  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');     
}

function exportPortals(format, includeImages, levelFilter) {

  console.log("autoDownload:",autoDownload);

  if (levelFilter == undefined) {
    levelFilter = [0,1,2,3,4,5,6,7,8];
  } else {
    levelFilter = [levelFilter];
  }
  
  var regex;

  var locationFilter = $('#mykey').val();
  if( /\S/.test(locationFilter) && !autoDownload) {
    regex = new RegExp( '(' +locationFilter.replace(/^[\s,]+|[\s,]+$/g,'').toLowerCase().replace(/\s*,\s*/g, '|').replace(/\|{2,}/g, '|') +')', 'ig' ); 
  }

  var teamFilter = [];
  if( $('#enlightened:checked').length || autoDownload ) {
    teamFilter.push('ALIENS');
  }
  if( $('#resistance:checked').length || autoDownload) {
    teamFilter.push('RESISTANCE');
  }
  if( $('#neutral:checked').length || autoDownload ) {
    teamFilter.push('NEUTRAL');
  }
  
  var wantedPortals = [];
  
  levelFilter.forEach(function(level) {
    var ourPortals = levels[level];
    if ( !ourPortals || ourPortals.length == 0 ) return;
        
    ourPortals.sort(function(a, b) {
      a = portals[a];
      b = portals[b];
      return a.name.localeCompare(b.name);
    });
    
    ourPortals.forEach(function(portal) {
      portal = portals[portal];
      
      if (portal && (regex ? regex.test(portal.addr) : true)
          && teamFilter.indexOf(portal.team) != -1) {
        wantedPortals.push(portal);
      }
      
    });
    
  });
  
  return window["export"+format.capitalize()](wantedPortals, includeImages);
}

function exportKml(portals, img) {
  var kmlstr = '';
  var styles = '<Style id="ALIENS"><IconStyle><Icon><href>http://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png</href></Icon><color>ff00aa55</color></IconStyle><LabelStyle><color>ff00aa00</color></LabelStyle></Style><Style id="RESISTANCE"><IconStyle><Icon><href>http://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png</href></Icon><color>ffaa0000</color></IconStyle><LabelStyle><color>ffaa0000</color></LabelStyle></Style><Style id="NEUTRAL"><IconStyle><Icon><href>http://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png</href></Icon><color>ff333366</color></IconStyle><LabelStyle><color>ff333366</color></LabelStyle></Style>'
    , colors = {'ALIENS':'#00aa00','RESISTANCE':'#0000aa','NEUTRAL':'#663333'};

  portals.forEach(function(l) {
    kmlstr += '<Placemark><name>' + vxml(l.name) +'</name><description><![CDATA[<table>';
    kmlstr += '<tr><td style="color:'+colors[l.team]+'"><p>'+vxml(l.addr)+'</p><ul><li>Resonators: ' +vxml(l.resonators.join('') || '-') +'</li>';
    kmlstr += '<li>Level: '+(0+l.level)+'</li>';
    kmlstr += '<li>Energy: '+(0+l.energyLevel)+'%</li>';
    kmlstr += '<li>Links: '+(0+l.links)+'</li>';
    kmlstr += '<li>Mods: '+vxml(l.modArray.join('') || '-')+'</li></ul>';
    kmlstr += '</td>'+(img?'<td width="120"><div style="background-position:center center;background-size:contain;background-repeat: no-repeat;width:120px;height: 160px;background-image:url('+l.imageUrl+')"></div></td>':'')+'</tr></table>';
    kmlstr += ']]></description><styleUrl>#'+l.team+'</styleUrl><Point><coordinates>'+l.lng+','+l.lat+',0</coordinates></Point></Placemark>';
  });

  var now = new Date();
  var timeStr = (now.getDate()>9?'':'0') + now.getDate() + "/" + (now.getMonth()>8?'':'0') + (now.getMonth()+1) + "/" +  + now.getFullYear().toString().substr(2);
  var title = "Ingress Portals";

  var xmlStr = '<?xml version="1.0" encoding="UTF-8"?>'
    + '<kml xmlns="http://earth.google.com/kml/2.2"><Document>'
    + '<name>'+title+' '+timeStr+'</name>'
    + '<open>1</open>'
    + styles + kmlstr
    + '</Document></kml>';

  return {mime: 'application/vnd.google-earth.kml+xml', data: xmlStr};
}

function exportCsv(portals, img) {
  var csvstr = '"Portal ID","Latitude","Longitude","Name","Address","Team","Level","Energy Percentage","Links","Mods","Resonators",';
  if (img) {
    csvstr += "Photo URL";
  }
  csvstr += '\n';

  portals.forEach(function(l) {
    csvstr += '"'+l.id+'"';
    csvstr += ',"'+l.lat+'"';
    csvstr += ',"'+l.lng+'"';
    csvstr += ',"'+l.name.replace(/\"/g, '\'\'')+'"';
    csvstr += ',"'+l.addr.replace(/\"/g, '\'\'')+'"';
    csvstr += ',"'+(l.team=='ALIENS'?'ENLIGHTENED':l.team)+'"';
    csvstr += ',"'+(0+l.level)+'"';
    csvstr += ',"'+(0+l.energyLevel)+'"';
    csvstr += ',"'+(0+l.links)+'"';
    csvstr += '," '+vxml(l.modArray.join(''))+'"';
    csvstr += '," '+vxml(l.resonators.join('') || '-')+'"';
    if (img) {
      csvstr += ',"'+(l.imageUrl||'')+'"';
    } 
    csvstr += '\n';
  });

  return {mime: 'text/csv', data: csvstr};
}

function exportJson(portals, img) {

  var newPortals = [];

  portals.forEach(function(portal) {
    newPortals.push(portal.rawInfo);
  });

  var jsonStr = JSON.stringify(newPortals);
  
  return {mime: 'application/json', data: jsonStr};
}