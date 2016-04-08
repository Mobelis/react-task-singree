import React, {PropTypes as pt} from 'react'

export default class RssItemsList extends React.Component {
  
  static get propTypes() {
    return {
      items: pt.object.isRequired
    }
  }
  
  render() {
    let items =  this.props.items,
      rows = Object.keys(items).map(item => {
        return <ItemRow key={item} id={item} data={items[item]} onDetail={this.props.onDetail} />
      });
    return (<div id="rss-list">{rows}</div>);
  }
}

const ItemRow = (obj) => {
  let element = obj.data;
  return (
  <div className="col-sm-12 rss-item">
    <h5>{element.title}</h5>
    <div><b>author:</b>{(element.author || '')}</div>
    <div><b>pubDate:</b>{element.pubDate}</div>
    <p className="text hidden">{element.content}</p>
    <bottom onClick={() => obj.onDetail(obj.id)} className="btn btn-default rss-item-stat">read</bottom>
    <a href={element.link} className="btn btn-success" target="_blank">full</a>
  </div>);
}