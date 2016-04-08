import React, {PropTypes as pt} from 'react'
import Error from './Error'
import Store from '../db/store'
import Superagent from 'superagent'

import RssChannelList from './RssChannelList'
import RssStatChanel from './RssStatChanel'
import RssItemsList from './RssItemsList'
import RssDetail from './RssDetail'
import ShowLoader from './ShowLoader'

var uuid = require('node-uuid');

class RssChannel extends React.Component {
  static get propTypes() {
    return {
      store: pt.instanceOf(Store).isRequired
    }
  }

  constructor() {
    super();
    this.state = {
      itemsRss: null,
      itemsRssLink: {},
      chanelStat: null,
      text: '',
      errorMessage: '',
      itemDetail: null,
      activeLink: null,
      loader: false
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
    this._onDeleteRssItem = this._onDeleteRssItem.bind(this)
    this._onLoadRssItem = this._onLoadRssItem.bind(this)
    this._onDetail = this._onDetail.bind(this)
  }

  componentWillMount() {
    this.setState({itemsRssLink:this.props.store.get()})
  }

  _onDeleteRssItem(id){
    let nextItems = this.state.itemsRssLink;
    delete nextItems[id];
    this.props.store.set(nextItems);
    this.setState({itemsRssLink: nextItems});
    this.cleanPrevState();
  }
  _onLoadRssItem(id){
    let url = this.state.itemsRssLink[id];
    this.cleanPrevState();
    this.setState({loader: true});
    Superagent
      .get('/rss')
      .set('Accept', 'application/json')
      .type('json')
      .query({ url: url })
      .end((err, res) => {
        this.setState({loader: false});
        if(err || !res){
          console.error('end err',err.toString());
          this.setState({errorMessage: err.toString()});
          return;
        }
        this.setState({itemsRss: res.body.items,chanelStat: res.body.stat,itemDetail: null,activeLink:id});
      });
  }

  cleanPrevState() {
    this.setState({itemsRss: null,itemDetail: null,chanelStat: null,errorMessage: null,activeLink: null});
  }

  handleOnChange(e) {
    this.setState({text: e.target.value})
  }
  handleOnSubmit(e) {
    e.preventDefault();
    let value = this.state.text.trim()
    let nextText = '';
    if(value.length>=5) {
      let nextItems = this.state.itemsRssLink;
      nextItems[uuid()] = this.state.text;
      this.props.store.set(nextItems);
      this.setState({itemsRssLink: nextItems, text: nextText});
    }
    else
      this.setState({errorMessage: 'link empty or length < 5'});
  }

  _onDetail(id) {
    let curentItem = this.state.itemsRss[id];
    this.setState({itemDetail: curentItem});
  }
  
  render() {
    return (
      <div className="row">
        <Error message={this.state.errorMessage} />
        <div className="col-sm-6">
          <form className="form-inline" onSubmit={this.handleOnSubmit}>
            <div className="form-group">
              <label htmlFor="input-link">rss link</label>
              <input className="form-control" classID="input-link" onChange={this.handleOnChange} value={this.state.text} />
            </div>
            <button className="btn btn-primary">{'Add rss #' + (Object.keys(this.state.itemsRssLink).length + 1)}</button>
          </form>
          <br />
          <RssChannelList items={this.state.itemsRssLink}
                          activeLink={this.state.activeLink}
                          onDeleteRssItem={this._onDeleteRssItem}
                          onLoadRssItem={this._onLoadRssItem}
          />
          <br />
          {this.state.itemDetail?<RssDetail item={this.state.itemDetail}/>:''}
        </div>
        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-12">
              {this.state.chanelStat? <RssStatChanel stat={this.state.chanelStat} /> : ''}
            </div>
            <div className="col-sm-12" id="rss-wrapper">
              {this.state.itemsRss? <RssItemsList items={this.state.itemsRss} onDetail={this._onDetail} /> : ''}
            </div>
          </div>
        </div>
        <ShowLoader load={this.state.loader} />
      </div>
    );
  }
}

export default RssChannel;
