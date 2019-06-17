import React from 'react';
import './Apis.scss';


const ReactMarkdown = require('react-markdown');

export default class Apis extends React.Component {

  render() {
    return (
      <div className="api-container">

        <h2 className="apis-title">API</h2>



        <ReactMarkdown className="api-content"
                       source={this.props.content}
        />
      </div>
    )
  }

}
