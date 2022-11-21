$(document).ready(function(){
  const socket = io();

  const ctx = $("#graphChart")[0].getContext('2d');
  let graphChart;

  const datasetsColor = [
    'rgba(255, 99, 132)',
    'rgba(97, 136, 255)',
    'rgba(255, 255, 97)',
    'rgba(0, 230, 0)'
  ];

  const configData = {
    datasets: [
      
    ]
  };

  let addStockLock = true;
  $.ajax({
    url: '/stock',
    method: 'GET',
    success: data => {
      data.stocks.forEach(stock => {
        configData.datasets.push({
          label: stock.symbol,
          data: stock.monthlyTimeSeries,
          backgroundColor: datasetsColor[configData.datasets.length],
          borderColor: datasetsColor[configData.datasets.length]
        });  
      });
      try { graphChart.destroy(); } catch(_) {}
      graphChart = new Chart(ctx, config);
      $('#stockSymbolInput').val('');
      addStockLock = false;
    }
  });

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
        let monthlyTimeSeries = data.monthlyTimeSeries;

        for (let time in monthlyTimeSeries) {
          datasetsData.push({
            x: time,
            y: monthlyTimeSeries[time],
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
        saveStock(datasetsObject);
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

    function saveStock(stockObj) {
      $.ajax({
        method: 'POST',
        url: '/stock',
        data: { stockObj },
        success: data => {
          addStockLock = false;
          console.log(data);
        },
        error: resp => {
          const errMsg = resp.responseJSON.error;
          alert('Failed to save stock: ' + errMsg);
        }
      })
    }
  });

  $('#stockSymbolInput').keydown(e => {
    if (e.key === 'Enter') $('#addStock').click();
  });

  $('#openHelpModal').on('click', () => {
    if ($('#helpModal').css('display') !== 'none') return;

    $('.modal-backdrop').css({
      'display': 'block',
      'opacity': 0
    }).animate({ 'opacity': 0.4 }, 200);
    $('#helpModal').fadeIn(200).css('display', 'flex');
    $('.modal-backdrop').on('click', () => {
      $('#closeHelpModal').click();
    });
  });

  $('#closeHelpModal').on('click', () => {
    $('.modal-backdrop').fadeOut(200).off('click');
    $('#helpModal').fadeOut(200);
  });
});

/*
- Remove a Stock
- socket.io
- unit tests
*/
