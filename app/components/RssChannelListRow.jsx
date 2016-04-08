import React, {PropTypes as pt} from 'react'

export default class RssChannelListRow extends React.Component {

  static get propTypes() {
    return {
      text: pt.string.isRequired,
      onDelete: pt.func.isRequired,
      onClick: pt.func.isRequired
    }
  }

  verifyAndDelete(id,text) {
    const result = window.confirm(`Are you sure you want to delete "${text}"?`)
    if (result) {
      this.props.onDelete(id)
    }
  }

  render()
  {
    return (
      <tr>
        <td className={this.props.activeLink==this.props.id?'active':''}>
          <span onClick={() => this.props.onClick(this.props.id)} className="load-rss btn btn-default btn-xs">{this.props.text}</span>
          <button onClick={() => this.verifyAndDelete(this.props.id,this.props.text)} type="button" className="btn btn-danger btn-xs pull-right delete">
            <span className="glyphicon glyphicon glyphicon-remove"></span>
          </button>
        </td>
      </tr>
    );
  }
}