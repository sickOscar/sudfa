import {Link as ThemeLink, withStyles} from "arwes";
import {withRouter} from "react-router";
import React from "react";

const CustomLink = withStyles({})(withRouter(class OhMyLink extends React.Component {
  goTo() {
    this.props.history.push(this.props.to);
  }
  render() {
    return (
      <ThemeLink onClick={this.goTo.bind(this)}>
        {this.props.children}
      </ThemeLink>
    )
  }
}))

export {CustomLink};
