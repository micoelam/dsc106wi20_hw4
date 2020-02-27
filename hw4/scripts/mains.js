// Global constants
const DEBUG = true;
const DINGUS_PRICE = 14.25;
const WIDGET_PRICE = 9.99;

// Some little helpers
const log = msg => (DEBUG ? console.log(msg) : '');
const select = id => document.getElementById(id);


// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
function plotSales(sales) {
	var continent = [
		['eu', 'EUROPE'],
		['oc', 'AUSTRALIA'],
		['af', 'AFRICA'],
		['as', 'ASIA'],
		['na', 'NORTHAMERICA'],
		['sa', 'SOUTHAMERICA']
	];

	data = sales;
	// Create the chart
	chart = new Highcharts.mapChart('container', {

		chart: {
			map: 'custom/world-continents',
		},

		plotOptions: {
			series: {
				cursor: 'pointer',
				point: {
					events: {
						click: function (e) {
							cont = e.point.value
							plotColumn(cont)
							plotPie(cont);
							updateScoreCards(cont);
						}
					}
				}
			}
		},

		title: {
			text: 'World Map'
		},

		subtitle: {
			text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-continents.js">World continents</a>'
		},

		series: [{
			data: continent,
			name: 'Random data',
			states: {
				backgroundColor: '#7CA82B',
				hover: {
					color: '#0C3'
				}
			},
			dataLabels: {
				enabled: true,
				format: '{point.name}'
			}
		}],
	});
}

function plotColumn(continent) {
	let dingusValues = {
		values: [],
		name: "Dinguses"
	}
	let widgetValues = {
		values: [],
		name: "Widgets"
	}
	let sales = data[continent];
	for (const datum of sales) {
		let month = datum['Month'];
		let dingus = datum['Dingus'];
		let widget = datum['Widget'];
		dingusValues['values'].push([month, dingus]);
		widgetValues['values'].push([month, widget]);
	}
	
	var barChart = Highcharts.chart('bar', {
		chart: {
			type: 'column'
		},
		title: {
			text: 'Monthly Sales'
		},
		xAxis: {
            categories: ['January', 'February', 'March'],
            title: {
                text: 'Month'
            }
        },
		yAxis: {
            min: 0,
            title: {
                text: 'Number of units sold',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
		},
		plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
		},

		legend: {
			layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
		},

		legend: true,
		
		series: [{
			data:
				[dingusValues['values'],
				widgetValues['values']]
		}]
	})
}

function plotPie(continent) {
	if (continent === 'ANTARCTICA') {
		zingchart.exec('totalSalesChart', 'destroy');
		return;
	}
	let dingusValues = {
		values: [],
		name: "Dinguses"
	}
	let widgetValues = {
		values: [],
		name: "Widgets"
	}
	let sales = data[continent];
	let dinguses = 0, widgets = 0;
	for (const datum of sales) {
		dinguses += datum['Dingus'];
		widgets += datum['Widget'];
	}
	dingusValues['values'].push(dinguses);
	widgetValues['values'].push(widgets);

	var pieChart = Highcharts.chart('pie', {
		chart: {
			type: 'pie'
		},
		legend: {},
		title: {
			text: 'Total Sales'
		},
		series: [{
			data:
				[
					dingusValues.values,
				widgetValues.values],
		}]
	})
}

function plotStocks(stocks) {
	let prices = [];
	for (datum of stocks) {
		log(datum);
		prices.push([datum['Date'], datum['Adj Close']]);
	}
	var areaChart = Highcharts.chart('area', {
		chart: {
			type: 'area'
		},
		title: {
			text: 'Dynamic Growth'
		},
		subtitle: {
			text: 'Stock Prices of D&W Corp. from 2015-Present',
		},
		xAxis: {
			transform: {
				type: 'date',
				all: '%m/%d/%y'
			},
			zooming: true,
			label: {
				text: 'Date'
			},
			crosshair: true
		},
		yAxis: {
			zooming: true,
			guide: {
				'line-style': 'dotted'
			},
			label: {
				text: 'Adj Close Stock Price'
			},
			crosshair: true
		},

		'crosshair-x': {
			'plot-label': {
				text: "$%v",
				decimals: 2
			},
			'scale-label': {
				visible: true
			}
		},
		'crosshair-y': {
			type: 'multiple',
			'scale-label': {
				visible: true
			}
		},

		series: [
			{
				data: prices,	
			},
		]
	})
}

function updateScoreCards(continent) {
	let sales = data[continent];
	let dinguses = 0, widgets = 0;
	for (const datum of sales) {
		dinguses += datum['Dingus'];
		widgets += datum['Widget'];
	}
	let revenue = DINGUS_PRICE * dinguses + WIDGET_PRICE * widgets;
	select('dingusSold').innerHTML = dinguses;
	select('widgetSold').innerHTML = widgets;
	select('totalSales').innerHTML = revenue.toFixed(2);
}

async function loadJSON(path) {
	let response = await fetch(path);
	let dataset = await response.json(); // Now available in global scope
	return dataset;
}

function init() {
	salesPromise = loadJSON('../hw4/data/sales.json');
	stocksPromise = loadJSON('../hw4/data/stocks.json');
	salesPromise.then(function (sales) {
		plotSales(sales);
	});
	stocksPromise.then(function (stocks) {
		plotStocks(stocks);
	});
}

document.addEventListener('DOMContentLoaded', init, false);