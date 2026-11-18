// Code for generating a Chart.js line chart
// Values are average blastema measurements of planaria
// Data from https://docs.google.com/spreadsheets/d/1ZUTmd7XY_4XgVSCBGuJaxCouz2fezp0778C-P5-P0f4/edit?usp=sharing


async function getData() {
    const response = await fetch('data/raw-blastema-data.csv');
    const data = await response.text();
    console.log(data);

    const xDays = [];  // x-axis labels = day
    const yControls = [];   // y-axis labels = control group areas
    const yUltrasounds = [] // y-axis = Northern Hemisphere Temps
    const yLowFreqs = [] // y-axis = Southern Hemisphere Temps

    const table = data.split('\n').slice(1);
    //console.log(table);
    table.forEach(row => {
        const columns = row.split(',');                     // Split each row into columns at each comma
        const day = parseFloat(columns[0]);                 // Assign the day (type: string)
        xDays.push(day);                                    // push day value into array xDays     
        const control = parseFloat(columns[1]);             // Control Group Area (string)
        yControls.push(control);                            // Push Control areas to yControls array
        const ultrasound = parseFloat(columns[2]);          // Ultrasound Group Area (string)
        yUltrasounds.push(ultrasound);                      // Push Ultrasound areas to yUltrasounds Array
        const lowfreq = parseFloat(columns[3]);             // Low Frequency Group Area (string)
        yLowFreqs.push(lowfreq);                             // Push Low Frequency areas to yLowFreqs Array

        console.log(day, control, ultrasound, lowfreq);
        // Will use parseFloat() all string values to work with them numerically

    });
    return { xDays, yControls, yUltrasounds, yLowFreqs } // Use {} to return multiple values as an object  
}

async function createChart() {
    const data = await getData(); // Wait until getData() process is completed
    const lineChart = document.getElementById('lineChart');     // Get the html element that will hold the chart
    const squareSymbol = String.fromCharCode(178); // Display the temperature degree symbol
    const myChart = new Chart(lineChart, {  // Construct the chart    
        type: 'line',
        data: {                         // Define data
            labels: data.xDays,        // x-axis labels
            datasets: [                 // Each object describes one dataset of y-values
                {
                    label: `Control Planarians Normalized Average Blastema Area in mm${squareSymbol}`,     // Dataset label for legend
                    data: data.yControls,    // Reference to array of y-values
                    fill: false,           // Fill area under the linechart (true = yes, false = no)
                    backgroundColor: 'rgba(0, 51, 255, 0.2)',    // Color for data marker
                    borderColor: 'rgba(0, 78, 248, 0.74)',      // Color for data marker border
                    borderWidth: 3,   // Data marker border width
                    tension: 0.4 //Smoothness of line.
                },
                {
                    label: `Ultrasound Planarians Normalized Average Blastema Area in mm${squareSymbol}`,     // Dataset label for legend
                    data: data.yUltrasounds,    // Reference to array of y-values
                    fill: false,           // Fill area under the linechart (true = yes, false = no)
                    backgroundColor: 'rgba(255, 0, 132, 0.2)',    // Color for data marker
                    borderColor: 'rgba(255, 0, 0, 0.81)',      // Color for data marker border
                    borderWidth: 3,   // Data marker border width
                    tension: 0.4 //Smoothness of line.
                },
                {
                    label: `Low Frequency Planarians Normalized Average Blastema Area in mm${squareSymbol}`,     // Dataset label for legend
                    data: data.yLowFreqs,    // Reference to array of y-values
                    fill: false,           // Fill area under the linechart (true = yes, false = no)
                    backgroundColor: 'rgba(0, 255, 13, 0.2)',    // Color for data marker
                    borderColor: 'rgb(1, 160, 12)',      // Color for data marker border
                    borderWidth: 3,   // Data marker border width
                    tension: 0.4 //Smoothness of line.
                },
            ]
        },
        options: {                        // Define display chart display options 
            responsive: true,             // Re-size based on screen size
            maintainAspectRatio: false,
            scales: {                     // Display options for x & y axes
                x: {                      // x-axis properties
                    title: {
                        display: true,
                        text: 'Days Since Incision',     // x-axis title
                        font: {                   // font properties
                            size: 14
                        },
                    },
                    ticks: {                      // x-axis tick mark properties
                        callback: function(val, index) {
                            // Control the labeling of the tick marks
                            return index % 2 === 0 ? this.getLabelForValue(val): '';
                        },
                        min: 0,                     // starting value      
                        font: {
                            size: 14
                        },
                    },
                    grid: {                       // x-axis grid properties
                        color: '#6c767e'
                    }
                },
                y: {                              // y-axis properties
                    title: {
                        display: true,
                        text: `Normalized Average Blastema Area (mm${squareSymbol})`,     // y-axis title
                        font: {
                            size: 14
                        },
                    },
                    ticks: {
                        maxTicksLimit: data.yControls.length/10,        // Limit number of tick marks
                        font: {
                            size: 12
                        }
                    },
                    grid: {                       // y-axis gridlines
                        color: '#6c767e'
                    }
                }
            },
            plugins: {                  // Display options for title and legend
                title: {
                    display: true,
                    text: 'Average Blastema Area of Planaria Tigrina vs. Days (since incision)',
                    font: {
                        size: 24,
                    },
                    color: '#black',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    display: true,
                    align: 'start',
                    position: 'bottom',
                    labels:{
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

createChart()