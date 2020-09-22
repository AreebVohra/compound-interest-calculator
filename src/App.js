import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from "highcharts/modules/exporting";
import factory from "highcharts/modules/export-data";
import $ from 'jquery';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initalInvestment: 0,
      monthlyContribution: 0,
      timeInYears: 0,
      interestPercentage: 0,
      interestRateVariance: 0,
      compoundFrequency: 1,
      futureValueSeries: [],
      varianceAboveSeries: [],
      varianceBelowSeries: [],
      ContributionSeries: [],
      graphComplete: false,
      showTable: false
    };
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = parseInt(event.target.value);
    if (isNaN(val)) {
      this.setState({ [nam]: 0 });
    } else {
      this.setState({ [nam]: val });
    }
  }

  calculateCompoundInterest = async (event) => {
    event.preventDefault();

    let futureValue = [];
    let varianceAbove = [];
    let varianceBelow = [];

    let total = [];
    let principal = this.state.initalInvestment;
    let principalAbove = this.state.initalInvestment;
    let principalBelow = this.state.initalInvestment;

    let varianceRange = this.state.interestRateVariance;

    var interest = this.state.interestPercentage / 100;
    var interestAbove = (this.state.interestPercentage + varianceRange) / 100;
    var interestBelow = (this.state.interestPercentage - varianceRange) / 100;

    let time = this.state.timeInYears * this.state.compoundFrequency;
    let monthly = this.state.monthlyContribution;
    let savings = monthly * 12;

    futureValue.push(principal);
    varianceAbove.push(principalAbove);
    varianceBelow.push(principalBelow);

    total.push(principal);


    for (let index = 0; index < time; index++) {

      if (this.state.compoundFrequency === 1) {
        principal = principal + (principal * interest) + (monthly * 12);
        if (this.state.interestRateVariance !== 0) {
          principalAbove = principalAbove + (principalAbove * interestAbove) + (monthly * 12);
          principalBelow = principalBelow + (principalBelow * interestBelow) + (monthly * 12);
        }
      }
      else if (this.state.compoundFrequency === 2) {
        principal = principal + (principal * (interest / 2)) + (monthly * 6);
        if (this.state.interestRateVariance !== 0) {
          principalAbove = principalAbove + (principalAbove * (interestAbove / 2)) + (monthly * 6);
          principalBelow = principalBelow + (principalBelow * (interestBelow / 2)) + (monthly * 6);
        }
      }
      else if (this.state.compoundFrequency === 12) {
        principal = principal + (principal * (interest / 12)) + (monthly * 1);
        if (this.state.interestRateVariance !== 0) {
          principalAbove = principalAbove + (principalAbove * (interestAbove / 12)) + (monthly * 1);
          principalBelow = principalBelow + (principalBelow * (interestBelow / 12)) + (monthly * 1);
        }
      }
      else if (this.state.compoundFrequency === 365) {
        principal = principal + (principal * (interest / 365)) + (monthly / (365 / 12));
        if (this.state.interestRateVariance !== 0) {
          principalAbove = principalAbove + (principalAbove * (interestAbove / 365)) + (monthly / (365 / 12));
          principalBelow = principalBelow + (principalBelow * (interestBelow / 365)) + (monthly / (365 / 12));
        }
      }

      futureValue.push(parseFloat(principal.toFixed(2)));
      if (this.state.interestRateVariance !== 0) {
        varianceAbove.push(parseFloat(principalAbove.toFixed(2)));
        varianceBelow.push(parseFloat(principalBelow.toFixed(2)));
      }
      total.push(total[index] + savings);
    }

    let newFinal = [];
    let newVarianceAbove = [];
    let newVarianceBelow = [];


    for (let i = 0; i <= time; i += this.state.compoundFrequency) {
      newFinal.push(futureValue[i]);
      if (this.state.interestRateVariance !== 0) {
        newVarianceAbove.push(varianceAbove[i]);
        newVarianceBelow.push(varianceBelow[i]);
      }
    }

    await this.setState({
      futureValueSeries: [...newFinal],
      varianceAboveSeries: [...newVarianceAbove],
      varianceBelowSeries: [...newVarianceBelow],
      ContributionSeries: [...total.slice(0, this.state.timeInYears + 1)],
      graphComplete: true
    })
  }

  resetCalculator = (event) => {
    // event.preventDefault();

    this.setState({
      initalInvestment: 0,
      monthlyContribution: 0,
      timeInYears: 0,
      interestPercentage: 0,
      interestRateVariance: 0,
      compoundFrequency: 1,
      futureValueSeries: [],
      varianceAboveSeries: [],
      varianceBelowSeries: [],
      ContributionSeries: [],
      graphComplete: false
    })
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  toggleTable = (data) => {

    if (this.state.showTable === false) {
      if (data) {
        var columns = data.length;
        var rows = data[0].data.length;
        var newTable = '<div class="highcharts-data-table">';
        var highlighted = 'highlighted-value';
        newTable += '<table id="highcharts-data-table-0" summary="Table representation of chart.">';
        newTable += '<caption class="highcharts-table-caption">Total Savings in US Dollars</caption>';
        newTable += '<thead><tr>';
        newTable += '<th scope="col" class="text">Years</th>';

        for (let y = 0; y < columns; y++) {
          var classNames = (data[y].name === 'Future Value' || data[y].name === 'Total Savings Compounded') ? ('text ' + highlighted) : ('text');
          newTable += '<th scope="col" class="' + classNames + '" >' + data[y].name + '</th>'
        }
        newTable += '</thead></tr>';
        newTable += '<tbody>';
        for (let i = 0; i < rows; i++) {
          newTable += '<tr>';
          newTable += '<td scope="row" class="text">Year ' + i + '</td>';
          for (let j = 0; j < columns; j++) {
            var classNames = (data[j].name === 'Future Value' || data[j].name === 'Total Savings Compounded') ? ('number ' + highlighted) : ('number');
            newTable += '<td class="' + classNames + '" >$' + data[j].data[i].toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</td>';
          }
          newTable += '</tr>'
        }
        newTable += '</tbody>';
        newTable += '</table>';
        newTable += '</div>';

        $('#calculator_results_table').append(newTable);
      }
    }
    else {
      $('#calculator_results_table').empty();
    }

    this.setState(prevState => ({ showTable: !prevState.showTable }));
  }

  render() {
    exporting(Highcharts);
    factory(Highcharts);
    Highcharts.setOptions({ lang: { decimalPoint: '.', thousandsSep: ',' } });

    const { interestPercentage, interestRateVariance, futureValueSeries,
      varianceAboveSeries, varianceBelowSeries, ContributionSeries } = this.state;

    const diffVarianceChart = [
      { name: `Variance Above (${interestPercentage + interestRateVariance}.00%)`, data: varianceAboveSeries, color: '#00325b' },
      { name: `Future Value (${interestPercentage}.00%)`, data: futureValueSeries, color: '#bf280d' },
      { name: `Variance Below (${interestPercentage - interestRateVariance}.00%)`, data: varianceBelowSeries, color: '#269092' }
    ];

    const normalChart = [
      { name: `Future Value (${interestPercentage}.00%)`, data: futureValueSeries, color: '#bf280d' },
      { name: 'Total Contributions', data: ContributionSeries, color: '#269092' }
    ];

    var mySeries = [];

    if (interestRateVariance !== 0)
      mySeries = diffVarianceChart
    else
      mySeries = normalChart

    const options = {
      title: { text: 'Total Savings' },
      credits: { text: 'ILoveMakingMoney.com', href: 'https://ilovemakingmoney.com/' },
      tooltip: {
        shared: true, valuePrefix: '$',
        valueDecimals: 2, thousandsSep: ',',
        headerFormat: 'Year {point.key}<br/>',
      },
      yAxis: {
        title: { text: 'US Dollar($)' },
        labels: { format: '${value:,.0f}' },
        tickInterval: 1000,
      },
      xAxis: {
        labels: { formatter: function () { return 'Year ' + this.value } },
        title: {
          text: 'Number of Years',
          style: {
            visibility: 'hidden',
          }
        }
      },

      series: mySeries,
      navigation: {
        menuStyle: {
          background: '#E0E0E0',
          color: 'black'

        },
        menuItemHoverStyle: {
          color: 'white'
        }
      },
      exporting: {
        enabled: true,
      }
    };

    console.log('====================================');
    console.log(typeof this.state.monthlyContribution);
    console.log(this.state.monthlyContribution);
    console.log('====================================');
    return (
      <div className="block block-sec-calculator block-sec-calculator-blocksec-compound-calculator block-title-sec-compound-interest-calculator">
        <form onSubmit={this.calculateCompoundInterest.bind(this)}>
          <div id="compound-interest-calc-wrapper">
            <p className="form-required"><strong><span>*</span> DENOTES A REQUIRED FIELD</strong></p>
            <div className="sec-calculator" id="compound-interest-calc">
              <div className="calculator">

                <div id="calculator_wrapper" className="calculator_wrapper js-form-wrapper form-wrapper">

                  <div className="calculator_step">
                    <h3>Step 1: Initial Investment</h3>
                    <div className="calculator__form-input">
                      <div className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-principal form-item-principal">
                        <label htmlFor="edit-principal" className="js-form-required form-required">Initial Investment</label>
                        <input className="monetary-input num-input form-text required" type="text" name="initalInvestment" size="10" maxLength="128" required onChange={this.myChangeHandler} />
                        <div id="edit-principal--description" className="description">Amount of money that you have available to invest initially.</div>
                      </div>
                    </div>
                  </div>

                  <div className="calculator_step">
                    <h3>Step 2: Contribute</h3>
                    <div className="calculator__form-input">
                      <div className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-addition form-item-addition">
                        <label htmlFor="edit-addition">Monthly Contribution</label>
                        <input className="monetary-input neg-input form-text" type="text" name="monthlyContribution" size="10" maxLength="128"
                          onChange={this.myChangeHandler} />

                        <div id="edit-addition--description" className="description">
                          Amount that you plan to add to the principal every month, or a negative
                          number for the amount that you plan to withdraw every month.
                                      </div>
                      </div>
                    </div>

                    <div className="calculator__form-input">
                      <div className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-num-years form-item-num-years">
                        <label htmlFor="edit-num-years" className="js-form-required form-required">Length of Time in Years</label>
                        <input className="num-years num-input form-text required" type="text" name="timeInYears" size="10" maxLength="128" required onChange={this.myChangeHandler} />

                        <div id="edit-num-years--description" className="description">Length of time, in years, that you plan to save.</div>
                      </div>
                    </div>
                  </div>

                  <div className="calculator_step">
                    <h3>Step 3: Interest Rate</h3>
                    <div className="calculator__form-input">
                      <div className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-interest-rate form-item-interest-rate">
                        <label htmlFor="edit-interest-rate" className="js-form-required form-required">Estimated Interest Rate</label>
                        <input className="interest-rate ir-input num-input form-text required" type="text" name="interestPercentage" size="10" maxLength="128" required onChange={this.myChangeHandler} />

                        <div id="edit-interest-rate--description" className="description">Your estimated annual interest rate.</div>
                      </div>
                    </div>

                    <div className="calculator__form-input">
                      <div className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-interest-rate-variance form-item-interest-rate-variance">
                        <label htmlFor="edit-interest-rate-variance">Interest rate variance range</label>
                        <input className="interest-rate ir-input num-input form-text" type="text" name="interestRateVariance" size="10" maxLength="128" onChange={this.myChangeHandler} />

                        <div id="edit-interest-rate-variance--description" className="description">
                          Range of interest rates (above and below the rate set above) that you desire
                          to see results for.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="calculator_step">
                    <h3>Step 4: Compound It</h3>
                    <div className="calculator__form-input">
                      <div className="js-form-item form-item js-form-type-select form-type-select js-form-item-compound-interest form-item-compound-interest">
                        <label htmlFor="edit-compound-interest">Compound Frequency</label>
                        <select className="compound-interest form-select" value={this.state.compoundFrequency} onChange={this.myChangeHandler} name="compoundFrequency">
                          <option value="1">Annually</option>
                          <option value="2">Semiannually</option>
                          <option value="12">Monthly</option>
                          <option value="365">Daily</option>
                        </select>
                        <div id="edit-compound-interest--description" className="description">
                          Times per year that interest will be compounded.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="compound-calc__buttons" className="buttons">
                    <div id="edit-actions">
                      <input className="submit button" type="submit" value="Calculate" />
                      <input type="reset" onClick={this.resetCalculator} id="edit-reset" name="op" value="Reset" className="button button--reset js-form-submit form-submit" />
                    </div>
                  </div>
                  {
                    this.state.graphComplete === false
                      ? null
                      : <div id="results_container" className="results-container ajax-changed" tabIndex="-1" >
                        <div className="results-container__inner">
                          <h2>The Results Are In</h2>
                          <h3 className="calculator__results-amount">In <span className="amount">{this.state.timeInYears}</span> years, you will have <span className="amount">${this.numberWithCommas(this.state.futureValueSeries[this.state.timeInYears])}</span></h3>
                        </div>
                        <div className="highChart"><HighchartsReact highcharts={Highcharts} options={options} /></div>
                        <button onClick={() => this.toggleTable(mySeries)} id="toggle_table">{this.state.showTable ? "Hide Table" : "Show Table"}</button>
                        <div id="calculator_results_table" className="results_container__table" width="400">
                        </div>
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default App;
