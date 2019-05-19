import React from 'react';
const ReactMarkdown = require('react-markdown')

export default class Apis extends React.Component {

  render() {
    return (
      <div>
        <ReactMarkdown source={this.props.content} />
      </div>
    )
  }

}
