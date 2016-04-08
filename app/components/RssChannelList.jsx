import React, {PropTypes as pt} from 'react'
import RssChannelListRow  from './RssChannelListRow'

export default class RssChannelList extends React.Component {
  
  static get propTypes() {
    return {
      items: pt.object.isRequired,
      onDeleteRssItem: pt.func.isRequired,
      onLoadRssItem: pt.func.isRequired
    }
  }
  
  render() {
    let items =  this.props.items,
      rows = Object.keys(items).map(item => {
        return <RssChannelListRow key={item}
                                  text={items[item]}
                                  id={item}
                                  activeLink={this.props.activeLink}
                                  onDelete={this.props.onDeleteRssItem}
                                  onClick={this.props.onLoadRssItem}
        />
      });
    return (
      <div className="table-responsive">
        <table className="table table-bordered">
          <tbody>{rows}</tbody>
        </table>
      </div>);
  }
}