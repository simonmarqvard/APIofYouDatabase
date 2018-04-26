var ddata = []
var timeslots;
var open = false;

function initialize() {
  getData();
}


var start = true
///////////////////////////OVERLAY DAYS///////////////////

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
      data = data.data
      if (start) {
        data.forEach(function(day) {
          addDayMeasurement(day)
          start = false;
          console.log("alldays    ", day)
        })
      } else {
        day = data[data.length - 1] //lastDay = data[n]
        addDayMeasurement(day)
        console.log("oneday    ", day)
      }
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

  var changeDate = new Date(day["dateAdded"])
  var readableDate = changeDate.toISOString().split('T')[0]

  dayHtml +=
    '<div class="datebox">' + readableDate + '</div>'
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
          borderColor: ['white', '#FCF4D9']
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


    counter2++
    // console.log(counter)
    var options = {
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          fontColor: '00AAA0'
        },
        hover: {
          mode: null
        },
      },
      tooltips: {
        enabled: true,
      },
      animation: {
        animateScale: false,
        duration: 2000
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
  // console.log(counter)
}



//HERE IS THE PROBLEM - I WANT TO SEND DATA WITH AJAX CALL INSTEAD OF
//REDIRECTING WHOLE PAGE

//HAS SOMETHING TO DO WITH FORM- ACTION?
//OR THIS CALL?


$(document).ready(function() {


  $(".menu").click(function() {
    open = !open
    controlPanel()
  })


  function controlPanel() {
    ///////////// OPEN AND CLOSE CONTROLPANEL /////////////////
    if (open == true) {
      $(".inputBox").animate({
        height: "800px",
        width: "400px",
        marginTop: "3%",
        marginLeft: "40%",
      }, 800)

      $(".menu").animate({
        width: "400px"
      }, 800)

      $(".buttonSubmit").animate({
        width: "400px"
      }, 800)

      $(".menu").text("CLOSE")

      $(".glucoseSchema").css("visibility", "visible")
    } else {
      $(".inputBox").animate({
        height: "50px",
        width: "100px",
        marginTop: "0px",
        marginLeft: "0px"

      }, 500)
      $(".glucoseSchema").css("visibility", "hidden")
      $(".menu").animate({
        width: "100"
      }, 500)
      $(".menu").text("OPEN")
    }
  }


  $("#formToSend").submit(function(e) {
    console.log('submitting form');
    // first, let's pull out all the values
    // the name form field value
    var name = $("#Name").val();
    var morningtime = $("#Measure1Time").val();
    var morningvalue = $("#Measure1Value").val();
    var prelunchtime = $("#Measure2Time").val();
    var prelunchvalue = $("#Measure2Value").val();
    var postlunchtime = $("#Measure3Time").val();
    var postlunchvalue = $("#Measure3Value").val();
    var bedtime = $("#Measure4Time").val();
    var bedvalue = $("#Measure4Value").val();

    //When there is nothing ins
    // if (!morningtime || morningtime == "") return alert('We dont have enough data!');
    console.log("do stuff")

    // POST the data from above to our API create route
    $.ajax({
      url: '/create-temp',
      dataType: 'json',
      type: 'POST',
      // we send the data in a data object (with key/value pairs)
      data: {
        name: name,
        morningtime: morningtime,
        morningvalue: morningvalue,
        prelunchtime: prelunchtime,
        prelunchvalue: prelunchvalue,
        postlunchtime: postlunchtime,
        postlunchvalue: postlunchvalue,
        bedtime: bedtime,
        bedvalue: bedvalue
      },
      success: function(response) {
        if (response.status == "OK") {
          // success
          console.log(response);
          //When new data is coming in - run Getdata (creates a day with graphs and appends it)
          getData();
          // now, clear the input fields
          $("#formToSend input").val('');
        } else {
          alert("SOMEEEEEETHING went wrong");
        }
      },
      error: function(err) {
        // do error checking
        alert("something went wrong");
        console.error(err);
      }
    });

    // prevents the form from submitting normally
    e.preventDefault();
    return false;
  });
})

//NOTE: NOTE: NOTE:
// A new way to create multistring ${   } is an input no plusses needed
// var timeslot = `
//   foo ${state["type"]} bar
//   <div class="${state["type"]}">
//     <div class="description">
//     ...
// `;


// NOTE: THIS IS FROM WHEN I HAD A REFERENCE CHART IN THE FIRST Column
// NOTE: BEFORE I MADE IT MULTIDOUGHNUT CHARTS
