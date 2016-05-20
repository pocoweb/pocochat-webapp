(function ($) {

    $.avatar = function (options) {

        // Defining Colors
        var colors = ["#8e44ad", "#cc9999", "#66cccc", "#1abc9c", "#f69785", "#2ecc71", "#e67e22",  "#3498db", "#e74c3c", "#c0392b", "#b49255", "#95a5a6", "#ec87bf", "#f1c40f"];

        var settings = $.extend({
            // Default settings
            name: 'Name',
            seed: 0,
            charCount: 1,
            textColor: '#ffffff',
            height: 100,
            width: 100,
            fontSize: 40,
            fontWeight: 400,
            fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
            radius: 0
        }, options);

        // overriding from data attributes
        //settings = $.extend(settings, {name: name});
        
        // making the text object
        var c = settings.name.substr(settings.charCount-3, settings.charCount+1).toUpperCase();
        var cobj = $('<text text-anchor="middle"></text>').attr({
            'y': '50%',
            'x': '50%',
            'dy' : '0.35em',
            'pointer-events':'auto',
            'fill': settings.textColor,
            'font-family': settings.fontFamily
        }).html(c).css({
            'font-weight': settings.fontWeight,
            'font-size': settings.fontSize+'px',
        });

        console.log(c);
        var colorIndex = Math.floor((c.charCodeAt(0) + settings.seed) % colors.length);

        var svg = $('<svg></svg>').attr({
            'xmlns': 'http://www.w3.org/2000/svg',
            'pointer-events':'none',
            'width': settings.width,
            'height': settings.height
        }).css({
            'background-color': colors[colorIndex],
            'width': settings.width+'px',
            'height': settings.height+'px',
            'border-radius': settings.radius+'px',
            '-moz-border-radius': settings.radius+'px'
        });

        svg.append(cobj);
        // svg.append(group);
        var svgHtml = window.btoa(unescape(encodeURIComponent($('<div>').append(svg.clone()).html())));

        return ('data:image/svg+xml;base64,' + svgHtml);
    };

    $.fn.initial = function (options) {
        return this.each(function(){
            var e = $(this);
            var options = $.extend(e.data(), options);
            console.log(options);
            e.attr("src", $.avatar(options));
        });
    };

}(jQuery));