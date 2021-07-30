// Global Options
Chart.defaults.global.defaultFontFamily='Lato';
Chart.defaults.global.defaultFontSize=18;
Chart.defaults.global.defaultFontColor='#777';
Chart.defaults.global.animation=800;
Chart.defaults.global.legend.position='bottom';

var deduction = 0;
var deductionType = "None";
var standardDeduction = 12550;
var itemizedDeduction = 0;
var totalTaxNum = 0;
var taxYear = 2021;
// 0 - single; 1 - head; 2 - married separate; 3 - married joint
var filing = 0;
var taxRates = [];
var taxRates2021 = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
taxRates = taxRates2021;

var taxBracketLimits = [];
// 2021
var singleTaxBracketLimits2021 = [9950, 40525, 86375, 164925, 209425, 523600];
var headTaxBracketLimits2021 = [14200, 54200, 86350, 164900, 209400, 523600];
var marriedSeperateBracketLimits2021 = [9950, 40525, 86375, 164925, 209425, 314150];
var marriedJointBracketLimits2021 = [19900, 81050, 172750, 329850, 418850, 628300];
var taxBracketLimits2021 = [singleTaxBracketLimits2021, headTaxBracketLimits2021, marriedSeperateBracketLimits2021, marriedJointBracketLimits2021];
var standardDeductions2021 = [12550, 18800, 12550, 25100];

// 2020
var singleTaxBracketLimits2020 = [9875, 40125, 85525, 163300, 207350, 518400];
var headTaxBracketLimits2020 = [14100, 53700, 85500, 163300, 207350, 518400];
var marriedSeperateBracketLimits2020 = [9875, 40125, 85525, 163300, 207350, 311025];
var marriedJointBracketLimits2020 = [19750, 80250, 171050, 326600, 414700, 622050];
var taxBracketLimits2020 = [singleTaxBracketLimits2020, headTaxBracketLimits2020, marriedSeperateBracketLimits2020, marriedJointBracketLimits2020];
var standardDeductions2020 = [12400, 18650, 12400, 24800];

taxBracketLimits = singleTaxBracketLimits2021;

var taxBracket = [];
calculateTaxBrackets();

var scale = 250000;

var slider = document.getElementById("myIncomeRange");
var annualIncomeNumber = document.getElementById("incomeNumber");

var usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

// Table elements
var taxBracket1 = document.getElementById("taxbracket1");
var taxBracket2 = document.getElementById("taxbracket2");
var taxBracket3 = document.getElementById("taxbracket3");
var taxBracket4 = document.getElementById("taxbracket4");
var taxBracket5 = document.getElementById("taxbracket5");
var taxBracket6 = document.getElementById("taxbracket6");
var taxBrackets = [taxBracket1, taxBracket2, taxBracket3, taxBracket4, taxBracket5, taxBracket6];

var amountbar1 = document.getElementById("amountbar1");
var amountbar2 = document.getElementById("amountbar2");
var amountbar3 = document.getElementById("amountbar3");
var amountbar4 = document.getElementById("amountbar4");
var amountbar5 = document.getElementById("amountbar5");
var amountbar6 = document.getElementById("amountbar6");
var amountBars = [amountbar1, amountbar2, amountbar3, amountbar4, amountbar5, amountbar6];
var amount7 = document.getElementById("amount7");

var taxAmount1 = document.getElementById("taxAmount1");
var taxAmount2 = document.getElementById("taxAmount2");
var taxAmount3 = document.getElementById("taxAmount3");
var taxAmount4 = document.getElementById("taxAmount4");
var taxAmount5 = document.getElementById("taxAmount5");
var taxAmount6 = document.getElementById("taxAmount6");
var taxAmount7 = document.getElementById("taxAmount7");
var taxAmounts = [taxAmount1, taxAmount2, taxAmount3, taxAmount4, taxAmount5, taxAmount6, taxAmount7];

var totalAmount = document.getElementById("totalAmount");
var totalTax = document.getElementById("totalTax");
var effectiveTaxRate = document.getElementById("effectiveTaxRate");

annualIncomeNumber.innerHTML = usdFormatter.format(slider.value);

var income = slider.value;

var myChart = document.getElementById('myChart').getContext('2d');
var barChartData = {
        labels:['Taxable Income'],
        datasets:[{
            label:'@ 10% Tax Rate',
            backgroundColor: '#FF5733',
            data:[
                0
            ]
        }, {
            label:'@ 12% Tax Rate',
            backgroundColor: '#9999ff',
            data:[
                0
            ]
        }, {
            label:'@ 22% Tax Rate',
            backgroundColor: '#e6e600',
            data:[
                0
            ]
        }, {
            label:'@ 24% Tax Rate',
            backgroundColor: '#33FF57',
            data:[
                0
            ]
        }, {
            label:'@ 32% Tax Rate',
            backgroundColor: '#cc33ff',
            data:[
                0
            ]
        }, {
            label:'@ 35% Tax Rate',
            backgroundColor: '#00cc8b',
            data:[
                0
            ]
        }, {
            label:'@ 37% Tax Rate',
            backgroundColor: '#5fd9d5',
            data:[
                0
            ]
        }]
    };

var chart = new Chart(myChart, {
    type:'bar',
    data:barChartData,
    options:{
        title: {
            display: true,
            text: 'Tax Rate Chart'
        },
        responsive: true,
        aspectRatio: 0.5,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                    stacked: true,
                }],
            yAxes: [{
                id: 'y-axis-1',
                stacked: true,
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 250000,
                    callback: function(value, index, values) {
                      return value.toLocaleString("en-US",{style:"currency", currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0});
                    }
                }
            }] 
        },
        annotation: {
            drawTime: "beforeDatasetsDraw",
            annotations: [{
                id: 'box1',
              type: 'box',
              yScaleID: 'y-axis-1',
              yMin: 0,
              yMax: taxBracketLimits[0],
              backgroundColor: '#ffc1b3',
              borderColor: '#ffc1b3'
            },{
                id: 'box2',
              type: 'box',
              yScaleID: 'y-axis-1',
              yMin: taxBracketLimits[0],
              yMax: taxBracketLimits[1],
              backgroundColor: '#e6e6ff',
              borderColor: '#e6e6ff'
            },{
                id: 'box3',
              type: 'box',
              yScaleID: 'y-axis-1',
              yMin: taxBracketLimits[1],
              yMax: taxBracketLimits[2],
              backgroundColor: '#ffffcc',
              borderColor: '#ffffcc'
            },{
                id: 'box4',
              type: 'box',
              yScaleID: 'y-axis-1',
              yMin: taxBracketLimits[2],
              yMax: taxBracketLimits[3],
              backgroundColor: '#ccffd5',
              borderColor: '#ccffd5'
            },{
                id: 'box5',
              type: 'box',
              yScaleID: 'y-axis-1',
              yMin: taxBracketLimits[3],
              yMax: taxBracketLimits[4],
              backgroundColor: '#f9e6ff',
              borderColor: '#ccffef'
            },{
                id: 'box6',
              type: 'box',
              yScaleID: 'y-axis-1',
              yMin: taxBracketLimits[4],
              yMax: taxBracketLimits[5],
              backgroundColor: '#b3ffe7',
              borderColor: '#ccffef'
            },{
                id: 'box7',
              type: 'box',
              yScaleID: 'y-axis-1',
              yMin: taxBracketLimits[5],
              yMax: taxBracketLimits[5]*2,
              backgroundColor: '#a1edeb',
              borderColor: '#ccffef'
            }]
        }  
    }    
});

update();


function update() {
    updateBrackets();
    updateDeductions();
    updateChart();
    updateTable();
    updateEffectiveTaxRate();
}

function calculateTaxBrackets() {
    var previous = 0;
    for (i = 0; i < 6; i++) {
        taxBracket[i] = taxBracketLimits[i] - previous;
        previous = taxBracketLimits[i];
    }
}

function updateEffectiveTaxRate() {
    var effectiveNumber = Number((totalTaxNum/(income-deduction)));
    if (effectiveNumber < 0 || income-deduction == 0)
    {
        effectiveNumber = 0;
    }
    var effectivePercent = effectiveNumber.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}); 
    effectiveTaxRate.innerHTML = "Effective Tax Rate = Tax / Gross Income = " + effectivePercent.replace('-', '');;
}

function updateBrackets() {
    var initialNumber = 0;
    for (i = 0; i < 6; i++) {
        taxBrackets[i].innerHTML = usdFormatter.format(initialNumber) + " - " + usdFormatter.format(taxBracketLimits[i]);
        initialNumber = initialNumber + taxBracket[i];
        if (i == 0)
        {
            initialNumber = initialNumber + 1;
        }
    }
}

function updateDeductions(){
    if (taxYear == 2021){
        standardDeduction = standardDeductions2021[filing];
    }
    if (taxYear == 2020){
        standardDeduction = standardDeductions2020[filing];
    }
    standardAmount.innerHTML = usdFormatter.format(standardDeduction);
    if (deductionType == "Standard"){
        deduction = standardDeduction;
    }
    if (deductionType == "Itemized"){
        deduction = itemizedDeduction;
    }
}

function updateTable() {
    var amountLeft = income-deduction;
    if (amountLeft < 0){
        amountLeft = 0;
    }
    totalAmount.innerHTML = usdFormatter.format(amountLeft);
    var tax = 0;
    totalTaxNum = 0;
    var taxUsd = "";
    lastBracket.innerHTML = usdFormatter.format(taxBracketLimits[5] + 1);
    
    for (i = 0; i < 6; i++) {
        if (amountLeft >= taxBracket[i]) {
            var usd = usdFormatter.format(taxBracket[i]);
            tax = taxBracket[i]*taxRates[i];
            totalTaxNum += tax;
            taxUsd = usdFormatter.format(tax);
            taxAmounts[i].innerHTML=taxUsd;
            amountLeft-=taxBracket[i];
            amountBars[i].setAttribute('aria-valuenow',taxBracket[i]);
            amountBars[i].setAttribute('style','width: 100%');
            amountBars[i].innerHTML=usd;
        }
        else {
            amountLeft = Math.max(0, amountLeft);
            var amountLeftUsd = usdFormatter.format(amountLeft);
            tax = amountLeft*taxRates[i];
            totalTaxNum += tax;
            taxUsd = usdFormatter.format(tax);
            taxAmounts[i].innerHTML=taxUsd;
            amountBars[i].setAttribute('aria-valuenow',amountLeft);
            amountBars[i].innerHTML=amountLeftUsd;
            var pcg = Math.floor((amountLeft/taxBracket[i]*100));
            amountBars[i].setAttribute('style','width:'+Number(pcg)+'%');
            amountLeft-=taxBracket[i];
        }
    }

    if (amountLeft > 0) {
        amount7.innerHTML = usdFormatter.format(amountLeft);
        tax = amountLeft*0.37;
        totalTaxNum += tax;
        taxUsd = usdFormatter.format(tax);
        taxAmount7.innerHTML = taxUsd;
    }
    else {
        amount7.innerHTML = "$0";
        taxAmount7.innerHTML = "$0";
    }

    totalTax.innerHTML = usdFormatter.format(totalTaxNum);
}

function updateChart() {
    updateTaxableIncome();
    chart.annotation.elements['box1'].options.yMax = taxBracketLimits[0];
    chart.annotation.elements['box2'].options.yMin = taxBracketLimits[0];
    chart.annotation.elements['box2'].options.yMax = taxBracketLimits[1];
    chart.annotation.elements['box3'].options.yMin = taxBracketLimits[1];
    chart.annotation.elements['box3'].options.yMax = taxBracketLimits[2];
    chart.annotation.elements['box4'].options.yMin = taxBracketLimits[2];
    chart.annotation.elements['box4'].options.yMax = taxBracketLimits[3];
    chart.annotation.elements['box5'].options.yMin = taxBracketLimits[3];
    chart.annotation.elements['box5'].options.yMax = taxBracketLimits[4];
    chart.annotation.elements['box6'].options.yMin = taxBracketLimits[4];
    chart.annotation.elements['box6'].options.yMax = taxBracketLimits[5];
    chart.annotation.elements['box7'].options.yMin = taxBracketLimits[5];
    chart.update();
}

function updateTaxableIncome() {
    var remainingIncome = income-deduction;
    for (i = 0; i < 7; i++) {
        if (remainingIncome >= taxBracket[i]) {
            chart.data.datasets[i].data[0]=taxBracket[i];
            remainingIncome-=taxBracket[i];
        }
        else {
            remainingIncome = Math.max(0, remainingIncome);
            chart.data.datasets[i].data[0]=remainingIncome;
            remainingIncome = 0;
        }
    }
}

function taxYearChange(control) {
    taxYear = control.value;
    if (taxYear == 2021) {
        taxBracketLimits = taxBracketLimits2021[filing];
    }
    else {
        taxBracketLimits = taxBracketLimits2020[filing];
    }
    calculateTaxBrackets();
    update();
}

function onStandardDeductionClicked(){
    deductionType = "Standard";
    update();
}

function onItemizedDeductionClicked(){
    deductionType = "Itemized";
    update();
}

function itemizedAmountChange(control) {
    itemizedDeduction = control.value;
    if (deductionType == "Itemized"){
        update();
    }
}

function filingStatusChange(control) {
    filing = control.value;
    taxBracketLimits = taxBracketLimits2021[filing];
    calculateTaxBrackets();
    update();
}

slider.oninput = function() {
    console.log(slider.value); // f12 console
    income = slider.value;
    annualIncomeNumber.innerHTML = usdFormatter.format(income);
    update();
}