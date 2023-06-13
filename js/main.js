var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

var overlay  = new ol.Overlay(({
		element: container,
		autoPan: true,
		autoPanAnimation: {
				duration: 250
		}
	})
);
	var shouldUpdate = true;
	var center = [564429.04, 2317738.2];
	var zoom = 16.1232616546521;
	var rotation = 0;

  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

var format = "image/png";
var bounds = [533982.875,2514956.5,535041.25,2516020.25];

var vung = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    ratio: 1,
    url: "http://localhost:8080/geoserver/csdl_dc/wms",
    params: {
      FORMAT: format,
      VERSION: "1.1.0",
      STYPE: "",
      LAYERS: "csdl_dc:thuadat",
    },
  }),
});
var xudong = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    ratio: 1,
    url: "http://localhost:8080/geoserver/csdl_dc/wms",
    params: {
      FORMAT: format,
      VERSION: "1.1.0",
      STYPE: "",
      LAYERS: "csdl_dc:xudong",
    },
  }),
});
// var diem = new ol.layer.Image({
//   source: new ol.source.ImageWMS({
//     ratio: 1,
//     url: "http://localhost:8080/geoserver/dh11_c3/wms",
//     params: {
//       FORMAT: format,
//       VERSION: "1.1.0",
//       STYPE: "",
//       LAYERS: "dh11_c3:camhoangub_1",
//     },
//   }),
// });
var projection = new ol.proj.Projection({
  code: "EPSG:3405",
  units: "m",
  axitsOrientation: "neu",
});
var view = new ol.View({
  projection: projection,
});
var map = new ol.Map({
  target: "map",
  layers: [vung, xudong],
  overlays: [overlay],
  view: new ol.View({
    projection: projection,
  }),
});

map.getView().fit(bounds, map.getSize());

var styles = {
  MultiPolygon: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "red",
      width: 5,
    }),
  }),
};

var styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

var vectorLayer = new ol.layer.Vector({
  style: styleFunction,
});

map.addLayer(vectorLayer);
// 2.Bật tắt (các) lớp bản đồ

$("#checkvung").change(function () {
  if ($("#checkvung").is(":checked")) {
    vung.setVisible(true);
  } else {
    vung.setVisible(false);
  }
});

$("#checkdiem").change(function () {
  if ($("#checkdiem").is(":checked")) {
    xudong.setVisible(true);
  } else {
    xudong.setVisible(false);
  }
});

// $("#checkdiem").change(function () {
//   if ($("#checkdiem").is(":checked")) {
//     diem.setVisible(true);
//   } else {
//     diem.setVisible(false);
//   }
// });

map.on("singleclick", function (evt) {
  var view = map.getView();
  var viewResolution = view.getResolution();
  var source = xudong.getSource();
  var url = source.getGetFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    view.getProjection(),
    { INFO_FORMAT: "application/json", FEATURE_COUNT: 50 }
  );
  if (url) {
    $.ajax({
      type: "POST",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (n) {
        var content = "<table>";
        for (var i = 0; i < n.features.length; i++) {
          var feature = n.features[i];
          var featureAttr = feature.properties;
          content +=
            "<tr><td>Loại đất: " +
            featureAttr["loaidat"] +
            "<tr><td>Chủ sử dụng: " +
            featureAttr["chusudung"] +
            "<tr><td> ";
        }
        // $("#info").html(content);
        $("#popup-content").html(content);
        overlay.setPosition(evt.coordinate);
        var vectorSource = new ol.source.Vector({
          features: new ol.format.GeoJSON().readFeatures(n),
        });
        vectorLayer.setSource(vectorSource);
      },
    });
  }
});

// $("popup-content").html(content);
// overlay.setPosition(evt.coordinate);
// <?php
// 	define('PG_DB',"GIS7C2");
// 	define('PG_HOST','localhost');
// 	define('PG_USER','postgres');
// 	define('PG_PORT','5432');
// 	define('PG_PASS','hai1234');
// 	$conn  = pg_connect("dbname".PG_DB."password=".PG_PASS."host=".PG_HOST." user=".PG_USER." port=".PG_PORT);
// ?>
// <?php
// 	include('../db/connection.php');
// 	if (isset($_GEt['ten_vung'])) {
// 		$ten_vung = $_GET['ten_vung'];
// 		$name  = strtolower($ten_vung);
// $squery = "select *,st_x(ST_Centroid((geom)) as x,st_y(ST_Centroid(geom)) as y from public.camhoangdc where LOWER(txtnemo) like '%$name%'";
// 		$result = pg_query($conn,$squery);
// 		$tong_so = pg_nem_rows($result);
// 			if ($tong_so > 0) {
// 				while($dong = pg_fetch_array($result, null,PGSQL_ASSOC)){
// 					$link = "<a href='javascript:void();' onclick='di_den_diem(".$dong['x'].",".$dong['y'].") '>here</a>";
// 					print("hien trong su dung : ".$dong['txtnemo']."| dien tich : ".$dong['shape_area']." ".$link."</br>");
// 				}
// 			}else {
// 				print("NOT FOUND");
// 			}
// 	}	else {
// 		echo "NOT FOUND"
// 	}
// ?>
// function showResult(str) {
// 	if (str.length==0){
// 		document.getElementsById("livesearch").innerHTML="";
// 		document.getElementsById("livesearch").style.border="0px";
// 		return;
// 	}
// 	var xmlhttp=new XMLHttpRequest();
// 	xmlhttp.onreadystatechange=function() {
// 		if (thsi.readyState==4 && this.status==200) {
// 			document.getElementsById("livesearch").innerHTML=this.responseText;
// 			document.getElementsById("livesearch").style.border="1px solid #A5ACB2";
// 		}
// 	}
// 	xmlhttp.open("GET","live_search_.php?ten_vung"+str,true);
// 	xmlhttp.send();
// }
// var updatepermalink = function() {
// 	if (!shouldUpdate) {
// 		shouldUpdate = true;
// 		return;
// 	}
// 	var center = view.getCenter();
// 	var hash = '#map=' +
// 		view.getZoom() + '/' +
// 		Math.round(center[0] * 100) /100 + '/' +
// 		Math.round(center[1] * 100) /100 + '/' +
// 		view.getRotation();
// 	var state  = {
// 		zoom: view.getZoom(),
// 		center: view.getCenter(),
// 		rotation: view.getRotation()
// 	};
// 	window.history.pushState(state, 'map', hash);
// };

// map.on('moveend', updatePermalink);
// window.addEventListener('popstate', function(event) {
// 	if (event.state === null) {
// 		return;
// 	}
// 	map.getView().setCenter(event.state.center);
// 	map.getView().setZoom(event.state.zoom);
// 	map.getView().getRotation(event.state.rotation);
// 	shouldUpdate = false;
// });
// function di_dien_diem(x,y){
// 	var vi_tri = ol.proj.formLomLat([x,y], projection);
// 	view.animate({
// 		center: vi_tri,
// 		duration: 2000,
// 		zoom :20
// 	})
// }
// var shouldUpdate = true;
// var center = [232132,1651 ];
// var zoom = 132131;
// var rotation = 0;
// if (window.location.hash.replace!== '') {
// 	var hash = window.location.hash.replace('#map=', ' ');
// 	var parts = hash.split('/');
// 	if (parts.length == 4) {
// 		zoom = parseInt(parts[0], 10);
// 		center = [
// 			parseFloat(parts[1]),
// 			parseFloat(parts[2])
// 		];
// 		rotation = parseFloat(parts[3]);
// 	}
// }
// var view = new ol.View({
// 	projection: projection,
// 	center: center,
// 	zoom: zoom,
// 	rotation: rotation
// });
