$.jqplot.config.enablePlugins = true;

function countChars(text) {
  var out = {"a": 0, "b": 0, "c": 0, "d": 0, "e": 0, "f": 0, "g": 0, "h": 0, "i": 0, "j": 0, "k": 0, "l": 0, "m": 0, "n": 0, "o": 0, "p": 0, "q": 0, "r": 0, "s": 0, "t": 0, "u": 0, "v": 0, "w": 0, "x": 0, "y": 0, "z": 0, "A": 0, "B": 0, "C": 0, "D": 0, "E": 0, "F": 0, "G": 0, "H": 0, "I": 0, "J": 0, "K": 0, "L": 0, "M": 0, "N": 0, "O": 0, "P": 0, "Q": 0, "R": 0, "S": 0, "T": 0, "U": 0, "V": 0, "W": 0, "X": 0, "Y": 0, "Z": 0}
  for(var c in text) {
    if(text[c] in out)
      out[text[c]] += 1;
  }
  
  // Sort the stuff
  var out2 = [];
  for(var k in out) {
    out2.push([k, out[k]]);
  }
  
  out2.sort(function(a, b) {return a[1] - b[1]});
  
  return out2;
}

function caesarShift(text, amount) {
  var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  
  var out = "";
  
  for(var k in text) {
    var index = alphabet.indexOf(text[k]);
    if(index != -1)
      out += alphabet[(index + amount) % alphabet.length];
  }
  
  return out;
}

var App = Backbone.View.extend({
  
  events: {
    "click .process": "makeGraph"
  },
  
  /*jqplotOptions: {
    seriesDefaults: {
      renderer:$.jqplot.BarRenderer,
      pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
      shadowAngle: 135,
      rendererOptions: {
        barDirection: 'horizontal',
        barWidth: 20,
      }
    },    
    axes: {
      xaxis: {
        label: "Number of occurances"
      },
      yaxis: {
        labelRenderer: $.jqplot.CategoryAxisRenderer,
        label: "Character"
      }
    }
  },*/
  
  jqplotOptions: {
    // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
    animate: !$.jqplot.use_excanvas,
    seriesDefaults:{
      renderer:$.jqplot.BarRenderer,
      pointLabels: { show: true },
      rendererOptions: {
        barDirection: 'horizontal',
      }
    },
    axes: {
      yaxis: {
        renderer: $.jqplot.CategoryAxisRenderer,
      }
    },
    highlighter: { show: false }
  },
  
  plot1: null,
  plot2: null,
  
  makeGraph: function() {
    console.log("makeGraph");
    
    var text = this.$el.find("#raw").val();
    
    var countedChars = countChars(text);
    
    var chars = [];
    var data = [];
    
    for(var k in countedChars) {
      chars.push(countedChars[k][0]);
      data.push(countedChars[k][1]);
    }
    
    this.jqplotOptions['axes']['yaxis']['ticks'] = chars;
    
    $("#raw_graph").height("750px");
    this.plot1 = $.jqplot("raw_graph", [data], this.jqplotOptions);
    
    /*
     * Now apply to the caesar shift
     */
    var shifted = caesarShift(text, $("#caesar_shift_amount").val());
    
    countedChars = countChars(shifted);
    
    $("#caesar").val(shifted);
    
    chars = [];
    data = [];
    
    for(var k in countedChars) {
      chars.push(countedChars[k][0]);
      data.push(countedChars[k][1]);
    }
    
    this.jqplotOptions['axes']['yaxis']['ticks'] = chars;
    
    $("#caesar_graph").height("750px");
    this.plot2 = $.jqplot("caesar_graph", [data], this.jqplotOptions);
    
    
    
    // Prevent reloading of the page
    return false;
  }
});

$(function() {
  new App({el: $("#main")});
});