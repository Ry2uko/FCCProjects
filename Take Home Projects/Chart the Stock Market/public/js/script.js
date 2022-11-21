$(document).ready(function(){
  const socket = io();

  $('#stockSymbolInput').val('');
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

  let dbLoaded = false;
  function removeStockItemCb(e) {
    if (!dbLoaded) return;
    
    const symbol = $(e.target).parent('li').find('span').text();
    $.ajax({
      url: '/stock',
      method: 'DELETE',
      data: { symbol },
      success: data => {
        $(e.target).parent('li').remove();

        for (let i = 0; i < configData.datasets.length; i++) {
          if (configData.datasets[i].label === symbol) {
            configData.datasets.splice(i, 1);
            break;
          }
        }
        
        if (configData.datasets.length === 0) {
          $('.remove-stocks-container').fadeOut(300);
          $('#removeStock').css({
            'pointer-events': 'none',
          }).animate({ 'opacity': 0.6 }, 200);
        }
        socket.emit('REMOVESTOCK', symbol);
        reloadChart();
      }, 
      error: resp => {
        const errMsg = resp.responseJSON.error;
        console.log(resp);
        alert('Failed to remove stock: ' + errMsg);
      }
    });
  }

  // DB get chart data
  
  $.ajax({
    url: '/stock',
    method: 'GET',
    success: data => {
      data.stocks.forEach(stock => {
        $('.remove-stocks-list').append(`<li><span>${stock.symbol}</span> <button type="button" class="remove-stock-item">&times;</button></li>`);
        configData.datasets.push({
          label: stock.symbol,
          data: stock.monthlyTimeSeries,
          backgroundColor: datasetsColor[configData.datasets.length],
          borderColor: datasetsColor[configData.datasets.length]
        });  
      });

      $('.remove-stock-item').on('click', removeStockItemCb);

      if (configData.datasets.length > 0) {
        $('#removeStock').css({
          'pointerEvents': 'auto',
          'opacity': 1
        });
      }
      reloadChart();
      dbLoaded = true;
    }
  });

  // Config options for the chart
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

  // For reloading chart and automatically resets and updates everything
  function reloadChart() {
    configData.datasets.forEach((stockData, colorIndex) => {
      stockData.backgroundColor =  datasetsColor[colorIndex],
      stockData.borderColor = datasetsColor[colorIndex]
    });
    try { graphChart.destroy(); } catch(_) {}
    graphChart = new Chart(ctx, config);
  }

  graphChart = new Chart(ctx, config);

  let addStockLock = false;
  $('#addStock').on('click', () => {
    if (addStockLock || !dbLoaded) return;
    addStockLock = true;
    const stockSymbol = $('#stockSymbolInput').val().toUpperCase();
    if (stockSymbol.length < 1 || configData.datasets.length >= 4) return;

    // Check if stock already exists
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

        if (configData.datasets.length === 0) {
          $('#removeStock').css({
            'pointerEvents': 'auto',
            'opacity': 1
          });
        }

        configData.datasets.push(datasetsObject);
        saveStock(datasetsObject);

        $('.remove-stocks-list').append(`<li><span>${stockSymbol}</span> <button type="button" class="remove-stock-item">&times;</button></li>`);
        $('.remove-stock-item').on('click', removeStockItemCb);
        reloadChart();
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
          socket.emit('ADDSTOCK', stockObj);
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
  
  $('#removeStock').on('click', () => {
    $('.remove-stocks-container').css('display') === 'none' 
    ? $('.remove-stocks-container').fadeIn(300).css('display', 'flex')
    : $('.remove-stocks-container').fadeOut(300);
  });

  // Socket Events
  socket.on('ADDSTOCKBROADCAST', dsObj => {
    if (configData.datasets.length === 0) {
      $('#removeStock').css({
        'pointerEvents': 'auto',
        'opacity': 1
      });
    }

    configData.datasets.push(dsObj);
    $('.remove-stocks-list').append(`<li><span>${dsObj.label}</span> <button type="button" class="remove-stock-item">&times;</button></li>`);
    $('.remove-stock-item').on('click', removeStockItemCb);
    reloadChart();
  });

  socket.on('REMOVESTOCKBROADCAST', stockSymbol => {
    $('.remove-stocks-list li').each(function() {
      console.log($(this));
      if ($(this).find('span').text() === stockSymbol) $(this).remove();
    });

    for (let i = 0; i < configData.datasets.length; i++) {
      if (configData.datasets[i].label === stockSymbol) {
        configData.datasets.splice(i, 1);
        break;
      }
    }

    if (configData.datasets.length === 0) {
      $('.remove-stocks-container').fadeOut(300);
      $('#removeStock').css({
        'pointerEvents': 'none',
      }).animate({ 'opacity': 0.6 }, 200);
    }

    reloadChart();
  });

  $(window).on('beforeunload', () => {
    socket.close();
  });
});
