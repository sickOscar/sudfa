import React from 'react';
import './Apis.scss';
import {Header, Heading} from "arwes";


const ReactMarkdown = require('react-markdown');

export default class Apis extends React.Component {

  render() {
    return (
      <div className="api-container">
        {/*<h2 className="apis-title">API</h2>*/}

        <Header animate className="mb-2">
          <Heading node="h4">API</Heading>
        </Header>

          <ReactMarkdown className="api-content"
                         source={this.props.content}
          />

      </div>
    )
  }

}
