$(document).ready(function(){
  const ctx = $("#graphChart")[0].getContext('2d');
  let graphChart;

  const configData = {
    datasets: [
      
    ]
  };

  const datasetsColor = [
    'rgba(255, 99, 132)',
    'rgba(97, 136, 255)',
    'rgba(255, 255, 97)',
    'rgba(0, 230, 0)'
  ]

  const config = {
    type: 'line', 
    data: configData,
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: context => {
              let label = context.dataset.label || '';

              if (label) label += ': ';

              if (context.parsed.y !== null) {
                label += `${context.parsed.y} USD`;
              }

              return label;
            }
          }
        },
        legend: {
          labels: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      },
      scales: {
        x: {
          grid: {
            drawBorder: false,
            color: 'rgba(255, 255, 255, 0)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        y: {
          grid: {
            drawBorder: false,
            color: 'rgba(255, 255, 255, 0.44)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)',
            padding: 10
          },
          beginAtZero: true,
          grace: 1  
        }
      }
    },
    plugins: [
      {
        id: 'legendMargin',
        beforeInit: (chart, legend, options) => {
          const fitValue = chart.legend.fit;

          chart.legend.fit = function fit() {
            fitValue.bind(chart.legend)();
            return this.height += 5
          }
        }
      }
  ]
  }

  graphChart = new Chart(ctx, config);

  let addStockLock = false;
  $('#addStock').on('click', () => {
    if (addStockLock) return;
    addStockLock = true;
    const stockSymbol = $('#stockSymbolInput').val().toUpperCase();
    if (stockSymbol.length < 1 || configData.datasets.length >= 4) return;

    if(configData.datasets.some(dataset => {
      return dataset.label === stockSymbol;
    })) return;

    $.ajax({
      method: 'POST',
      url: '/api',
      data: {
        symbol: stockSymbol
      },
      success: data => {
        const datasetsData = [];
        let monthlyTimeSeries = data['Monthly Time Series'];
        
        // limit to only 2019~
        let filtered = Object.keys(monthlyTimeSeries)
        .filter(key => ['2022', '2021', '2020', '2019'].some(year => {
          return key.includes(year);
        }))
        .reduce((obj, key) => {
          obj[key] = monthlyTimeSeries[key];
          return obj;
        }, {});

        for (let date in filtered) {
          let dateObject = filtered[date];
          datasetsData.push({
            x: date,
            y: parseFloat(dateObject['4. close']),
          });
        }

        datasetsData.reverse();

        const datasetsObject = {
          label: stockSymbol,
          data: datasetsData,
          backgroundColor: datasetsColor[configData.datasets.length],
          borderColor: datasetsColor[configData.datasets.length]
        };

        configData.datasets.push(datasetsObject);
        graphChart.destroy();
        graphChart = new Chart(ctx, config);
        $('#stockSymbolInput').val('');
        addStockLock = false;
      },
      error: resp => {
        const errMsg = resp.responseJSON.error;
        alert('Failed to add stock: ' + errMsg);
      }
    });
  });

  $('#stockSymbolInput').keydown(e => {
    if (e.key === 'Enter') $('#addStock').click();
  });

});

/*
https://cloudfront-us-east-2.images.arcpublishing.com/reuters/3XVSE7R5O5NJFMYP32IE36OU7I.png
• Help Button - shows tooltip/message: Stocks other people....
• Visualize Graph (chart.js)
• Stock Symbol Input & Get Stock Btn

-test chart.js
-implement chart.js
-test socket.js
-work on api routes & implement socket.js
-unit tests?
*/


