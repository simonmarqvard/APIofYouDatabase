var ddata = []
var timeslots;
var open = false;

function initialize() {
  getData();





  $(".menu").click(function() {
    open = !open
    controlPanel()
  })


  function controlPanel() {
    if (open == true) {
      $(".inputBox").animate({
        height: "100%",
        width: "400px"
      }, 1000)

      $(".menu").animate({
        width: "400px"
      }, 1000)

      $(".menu").text("CLOSE")

      $(".glucoseSchema").css("visibility", "visible")
    } else {
      $(".inputBox").animate({
        height: "50px",
        width: "50px",
      }, 1000)
      $(".glucoseSchema").css("visibility", "hidden")
      $(".menu").animate({
        width: "100"
      }, 1000)
      $(".menu").text("OPEN")
    }
  }
}



function getData() {
  $.ajax({
    url: "/showDBdata",
    dataType: "json",
    error: function(err) {
      console.log(err)
    },
    success: function(data) {
      // window.data = data;
      console.log("data is served");
      //  console.log(data)
      data = data.data
      data.forEach(function(day) {
        //    console.log(day)
        //    console.log(day.state)
        addDayMeasurement(day);
      })
    }
  })
}



var counter = 0;
var counter2 = 0;

function addDayMeasurement(day) {

  var dayHtml = '<div class= dayColumn>';
  // add specific timeslots
  day.state.forEach(function(state) {
    counter++
    var timeslot =
      '<div class =' + state["type"] + '>' +
      '<div class="description">' + state["sampleTime"] + '</div>' +
      '<div class="insideNO">' + state["measurement"] + "<br>" + "<span>mg/dl</span>" +
      '</div>' +
      '<div id="chart-container">' + '<canvas id="myChart' + counter + '" + width="100%" height="100%">' +
      '</canvas>' + '</div>' +
      '</div>'
    //concatenate string (push them together)
    dayHtml += timeslot;
  });

  dayHtml +=
    '<div class="datebox">' + day["dateAdded"] + '</div>'
  // +
  // +
  // '</div>';

  $('.days').append(dayHtml);
  buildDoughnutChart(day);
}



// Build myDoughnutChart for each time each day
//THIS VARIABLE COULD BE JUST HUNDRED BUT IN AN ARRAY I CAN ADJUST THE CHART VISUAL BY CHANGING PERCENTAGES
var GlobalChartReferenceValues = [100, 100, 100, 100];
var refvalues = [100, 120, 140, 110];
var i = -1;

function buildDoughnutChart(day) {

  day.state.forEach(function(state) {
    i++
    if (i > 3) {
      i = 0;
    }
    //  console.log(GlobalChartReferenceValues[i])

    var data = {
      labels: [
        "Measure"
      ],
      datasets: [{
          data: [state["measurement"], GlobalChartReferenceValues[i]],
          backgroundColor: ['#00AAA9', '#FCF4D9'],
          borderColor: ['white', '#FCF4D9'],

          //  hoverBackgroundColor: [red, red],
        },
        {
          data: [refvalues[i], GlobalChartReferenceValues[i]],
          backgroundColor: ['#FF7A5A', '#FCF4D9'],
          borderColor: ['white', '#FCF4D9']
          //    hoverBackgroundColor: [blue, blue],
        },
      ]
    };
    // var data = {
    //   labels: [
    //     "Hillary Clinton",
    //     "Donald Trump",
    //   ],
    //   datasets: [{
    //     data: [measurement["measurement_mgdl"], GlobalChartReferenceValues[i]],
    //     backgroundColor: [
    //       "#179ee0",
    //       "#fff",
    //     ],
    //     hoverBackgroundColor: [
    //       "#1594d2",
    //       "#f0563a",
    //     ]
    //   }]
    // };

    counter2++
    console.log(counter)
    var options = {
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          fontColor: '00AAA0'
        },
      },
      tooltips: {
        backgroundColor: '#222',
      },
      animation: {
        animateScale: false,
        duration: 7000
      },
      //
      // rotation: counter2 * Math.PI
    }


    var ctx = document.getElementById("myChart" + counter2).getContext("2d");
    // now, create the doughnut chart, passing in:
    // 1. the type (required)
    // 2. the data (required)
    // 3. chart options (optional)
    myDoughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });
  });
  console.log(counter)
}







// NOTE: THIS IS FROM WHEN I HAD A REFERENCE CHART IN THE FIRST Column
// NOTE: BEFORE I MADE IT MULTIDOUGHNUT CHARTS

// ReferenceChart

// function referenceChart() {
//   //the real values for reference chart
//   var refvalues = [100, 110, 140, 110];
//
//   for (var i = 0; i <= 3; i++) {
//     var values = refvalues[i];
//     var chartReferenceValues = GlobalChartReferenceValues[i]
//
//     // var data = {
//     //   labels: [
//     //     "Ref-Value",
//     //     "extra",
//     //   ],
//     //   datasets: [{
//     //     data: [values, chartReferenceValues],
//     //     backgroundColor: [
//     //       "red",
//     //       "white",
//     //     ],
//     //     hoverBackgroundColor: [
//     //       "#1594d2",
//     //       "#f0563a",
//     //     ]
//     //   }]
//     // };
//
//     var data = {
//       datasets: [{
//           data: [values, chartReferenceValues],
//           backgroundColor: ['red', 'blue'],
//           //  hoverBackgroundColor: [red, red],
//         },
//         {
//           data: [60, 40],
//           backgroundColor: ['green', 'orange'],
//           //    hoverBackgroundColor: [blue, blue],
//         },
//       ]
//     };
//
//     var options = {
//       legend: {
//         display: false,
//         position: 'bottom',
//         labels: {
//           fontColor: '#fff'
//         },
//       },
//       tooltips: {
//         backgroundColor: '#222',
//       },
//       animation: {
//         animateScale: false,
//         duration: 5000
//       },
//     }
//     // first, get the context of the canvas where we're drawing the chart
//     var xpos = document.getElementById("my" + [i] + "Chart").getContext("2d");
//     // now, create the doughnut chart, passing in:
//     // 1. the type (required)
//     // 2. the data (required)
//     // 3. chart options (optional)
//     myDoughnutChart = new Chart(xpos, {
//       type: 'doughnut',
//       data: data,
//       options: options
//     });
//   }
// }
