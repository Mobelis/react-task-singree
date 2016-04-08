var uuid = require('node-uuid');
const storage = window.localStorage

class Store {
  constructor(storeId) {
    this.storeId = storeId || 'rss-list'
    const initialState = this.get()
    if (!initialState) {
      let data = {}
      data[uuid()] = 'http://www.sti.nasa.gov/scan/rss99-01.xml';
      data[uuid()] = 'https://habrahabr.ru/rss/interesting/';
      this.set(data)
    }
    this.count = 0;
  }

  set(data) {
    storage.setItem(this.storeId, JSON.stringify(data))
  }

  get() {
    const rawData = storage.getItem(this.storeId)
    const data = JSON.parse(rawData)
    if(data !== null)
      this.count = Object.keys(data).length;
    return data
  }

}

export default Store
