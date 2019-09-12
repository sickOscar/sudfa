import React, {Component} from 'react';
import AceEditor from 'react-ace';
import EditorActions from './EditorActions'
import './Editor.scss';
import 'brace/mode/java';
import 'brace/theme/solarized_dark';


export class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {}

    this.saveTimeout = 0;
  }

  changeCode(code) {
    clearInterval(this.saveTimeout);
    this.saveTimeout = setInterval(() => {
      console.log('saving code');
      this.props.onChange(code)
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.saveTimeout);
  }

  render() {
    return (
      <div className="editor-container">
        <AceEditor
          width="100%"
          height="100%"
          style={{flex: 1}}
          value={this.props.code}
          mode="javascript"
          theme="solarized_dark"
          onChange={this.changeCode.bind(this)}
          name="the-editor"
          editorProps={{$blockScrolling: true}}
        />
        <EditorActions bots={this.props.bots}
                       bot={this.props.bot}
                       group={this.props.group}
                       loading={this.props.loading}
                       onTestCode={this.props.onTestCode}
                       onLevelChange={this.props.onLevelChange}
                       onChallengeTeamSelection={this.props.onChallengeTeamSelection}
                       challenge={this.props.challenge}
                       saveBot={this.props.saveBot}
                       enemyBot={this.props.enemyBot}
                       sendToLeague={this.props.sendToLeague}
          />
      </div>
    )
  }

}
