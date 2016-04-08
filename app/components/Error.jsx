import React from 'react';
//import ReactDOM from 'react-dom';

class Error extends React.Component {
  static defaultProps() {
    message: ''
  }
  constructor() {
    super();
    this.timer = null;
    this.state = {showhide: 'show'}
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.timer)
    if(nextProps.message!==null && nextProps.message.length > 0) {
      this.showBox()
      this.timer = setTimeout((() => {this.hideBox()}).bind(this), 5000)
    }
  }

  showBox() {
    this.setState({showhide: 'show'})
  }

  hideBox() {
    this.setState({showhide: 'hidden'})
  }
  
  render() {
    let className = 'error error-message ' + this.state.showhide;
    return (<div className="col-sm-12"><div className={className}>{this.props.message}</div></div>);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
}
export default Error;