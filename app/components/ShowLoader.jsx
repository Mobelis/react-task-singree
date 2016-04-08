import React from 'react';

class ShowLoader extends React.Component {
  static defaultProps() {
    load: false
  }
  constructor() {
    super();
    this.timer = null;
    this.state = {showhide: 'hidden'}
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.load)
    if(nextProps.load === false)
      this.hideBox();
    else if (nextProps.load === true)
      this.showBox();

  }

  showBox() {
    this.setState({showhide: 'show'})
  }

  hideBox() {
    this.setState({showhide: 'hidden'})
  }
  
  render() {
    return (
      <div className="col-sm-12">
        <div id="loading" className={this.state.showhide}></div>
      </div>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
}
export default ShowLoader;