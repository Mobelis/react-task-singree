import React from 'react';
import ReactDom from 'react-dom';
import Store from './db/store'
import RssChannel from './components/RssChannel';

ReactDom.render(
  <RssChannel store={new Store('rss-list')} />,
  document.getElementById('app')
);