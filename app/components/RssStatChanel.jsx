import React from 'react';

class RssStatChanel extends React.Component {
  static get defaultProps() {
    return {
      stat: {
        message: 0,
        author: 0
      }
    }
  }
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <b>rss message:</b> {this.props.stat.message} | <b>rss author:</b> {this.props.stat.author}
      </div>);
  }
}
export default RssStatChanel;