/**
 * Make map of czech regions for pirati.cz/regiony
 * @param {collection} data
 * @param {string} url attribute to use as url
 **/
var makemap = function(data, url) {
  var settings = data[0].settings;

  $(settings.id).width(settings.size.width);
  $(settings.id).height(settings.size.height);
  var R = Raphael(settings.id, settings.size.width, settings.size.height);

  $("#region-description>div").hide();

  var marked = null;
  var i = 0;
  var reg_list = $('#regions-list');
  var reg_list2 = $('#regions-list-2');

  var regions = data[0].regions;
  $.each(regions, function(index, region) {
    if(i < 7 ) {
      var li = $('<li/>').appendTo(reg_list);
      var span = $('<a/>').text(region.name).attr('href', region[url]).appendTo(li);
    } else {
      var li2 = $('<li/>').appendTo(reg_list2);
      var span2 = $('<a/>').text(region.name).attr('href', region[url]).appendTo(li2);
    }
    i++;

    var custom_attrs = {"title": region.name};
    var attrs = $.extend(settings.region_attrs, custom_attrs);

    if(settings.colors) {
      region.color = Raphael.getColor();
    } else {
      region.color = "#666";
    }
    var path_def = null;
    var reg_id = region.id;

    $.each(region.paths, function(index, path) {
      path = R.path(path).scale(
        settings.size.scale,
        settings.size.scale,
        0,0).attr(attrs);

        var click = function() {
          $(location).attr('href',region[url]);
        };
        var dblclick = function() {
          window.open(region[url]);
        };
        var over = function() {
          path.animate({fill: region.color}, 500).attr({'cursor': "pointer"});
        };
        var out = function() {
          path.animate({fill: "#333"}, 500);
        };

        path[0].onclick = click;
        path[0].ondblclick = dblclick;
        path[0].onmouseover = over;
        path[0].onmouseout = out;
    });
  });
};

$(function() {
  /* Regions */
  if($('#regions-map').length) {
    var use = 'url';  /* Default link in map */
    if(page_url == '/volby/2017/') {
      use = 'kandidatka';
    }
    $.get(api_regions)
      .done(function(data) { makemap(data, use); })
      .fail(function(data) { console.log("Error: map"); });
  }
});
