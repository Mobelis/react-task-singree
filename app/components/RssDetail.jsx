import React, {PropTypes as pt} from 'react'
var Chart = require('react-google-charts').Chart;

export default class RssDetail extends React.Component {
  static get defaultProps() {
    return {
      item: {}
    }
  }
  static get propTypes() {
    return {
      item: pt.object.isRequired
    }
  }
  getChartData() {
    let letters = {},s = this.props.item.contentSnippet.toString();
    s.replace(/([a-z])/gmi, function(l) {
      l = l.toLowerCase();
      letters[l] = (isNaN(letters[l]) ? 1 : ++letters[l]);
    });
    return  this.getArrayObject(letters);
  }

  getArrayObject(obj) {
    var arr = [['','']];
    if (typeof obj === 'object') {
      for (var prop in obj) {
        arr.push([prop,obj[prop]]);
      }
    }
    return arr.sort();
  }
  render() {
    let data = this.props.item,
        chartData = this.getChartData();

    return (
      <div>
        <div id="chart_wrap">
          <div id="piechart">
            <Chart chartType="PieChart"
                 width={"100%"}
                 height={"100%"}
                 options={{
                  legend: 'none',
                  pieSliceText: 'label',
                  width: '100%',
                  height: '100%',
                  chartArea: {
                    left: "3%",
                    top: "3%",
                    height: "94%",
                    width: "94%"
                  }
                 }}
                 data={chartData} />
          </div>
        </div>
        <div id="full-text">{data.contentSnippet}</div>
      </div>
    );
  }
}
