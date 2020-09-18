import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from "highcharts/modules/exporting";
import factory from "highcharts/modules/export-data";

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
      futureSeries: [10000, 11400, 12828, 14284.56, 15770.25, 17285.66],
      ContributionSeries: [10000, 11200, 12400, 13600, 14800, 16000],
      graphComplete: true
    };
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  }

  calculateCompoundInterest(event) {
    console.log('====================================');
    console.log("Here I am");
    console.log('====================================');

    event.preventDefault();
  }

  render() {
    exporting(Highcharts);
    factory(Highcharts);
    Highcharts.setOptions({ lang: { decimalPoint: '.', thousandsSep: ',' } });

    const options = {
      title: {
        text: 'Total Savings'
      },
      credits: {
        text: 'I Love Making Money',
        href: 'https://ilovemakingmoney.com/'
      },

      tooltip: {
        shared: true,
        valuePrefix: '$',
        valueDecimals: 2,
        thousandsSep: ',',
        headerFormat: 'Year {point.key}<br/>',

      },
      yAxis: {
        title: {
          text: 'US Dollar($)',
        },
        labels: {
          format: '${value:,.0f}'
        },
        tickInterval: 1000,
      },

      xAxis: {
        labels: {
          formatter: function () { return 'Year ' + this.value }
        },
      },

      series: [{
        name: `Future Value (${this.state.interestPercentage.toFixed(2)}%)`,
        color: '#bf280d',
        data: this.state.futureSeries
      }, {
        name: 'Total Contributions',
        color: '#269092',
        data: this.state.ContributionSeries
      }],
      exporting: {
        enabled: true,

      }
    };

    return (
      <div className="block block-sec-calculator block-sec-calculator-blocksec-compound-calculator block-title-sec-compound-interest-calculator">
        <form onSubmit={this.calculateCompoundInterest}>
          <div id="compound-interest-calc-wrapper">
            <p className="form-required"><strong><span>*</span> DENOTES A REQUIRED FIELD</strong></p>
            <div className="sec-calculator" id="compound-interest-calc">
              <div className="calculator">
                <h2 className="element-invisible">Calculator</h2>
                <div id="calculator_wrapper" className="calculator_wrapper js-form-wrapper form-wrapper">

                  <div className="calculator_step">
                    <h3>Step 1: Initial Investment</h3>
                    <div className="calculator__form-input">
                      <div className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-principal form-item-principal">
                        <label htmlFor="edit-principal" className="js-form-required form-required">Initial Investment</label>
                        <input className="monetary-input num-input form-text required" type="text" name="initalInvestment" size="10" maxLength="128" required="required" onChange={this.myChangeHandler} />
                        <div id="edit-principal--description" className="description">Amount of money that you have available to invest initially.</div>

                      </div>
                    </div>
                  </div>

                  <div className="calculator_step">
                    <h3>Step 2: Contribute</h3>
                    <div className="calculator__form-input">
                      <div
                        className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-addition form-item-addition">
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
                        <input className="num-years num-input form-text required" type="text" name="timeInYears" size="10" maxLength="128" required="required" onChange={this.myChangeHandler} />

                        <div id="edit-num-years--description" className="description">Length of time, in years, that you plan to save.</div>
                      </div>
                    </div>
                  </div>

                  <div className="calculator_step">
                    <h3>Step 3: Interest Rate</h3>
                    <div className="calculator__form-input">
                      <div className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-interest-rate form-item-interest-rate">
                        <label htmlFor="edit-interest-rate" className="js-form-required form-required">Estimated Interest Rate</label>
                        <input className="interest-rate ir-input num-input form-text required" type="text" name="interestPercentage" size="10" maxLength="128" required="required" onChange={this.myChangeHandler} />

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
                    <div className="form-actions js-form-wrapper form-wrapper" id="edit-actions">
                      <div id="compound-calc__errors" className="calc-errors"></div>
                      <input className="submit button" type="submit" value="Calculate" />
                      <input type="submit" id="edit-reset" name="op" value="Reset" className="button button--reset js-form-submit form-submit" />
                    </div>
                  </div>

                  <div id="results_container" className="results-container ajax-changed" tabIndex="-1" >
                    <div className="results-container__inner">
                      <h2> The Results Are In</h2>
                      <h3 className="calculator__results-amount">In <span className="amount">{this.state.timeInYears}</span> years, you will have <span className="amount">$116,652.93</span></h3>
                    </div>
                  </div>
                  {
                    this.state.graphComplete == false
                      ? null
                      : <div className="highChart"><HighchartsReact highcharts={Highcharts} options={options} /></div>
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