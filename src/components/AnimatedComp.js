import React from "react";
import PropTypes from "prop-types";

import { animated } from "../core";
import { timeBasedExecMethods } from "../utils/methods";
import { getPropsFromMain } from "../utils/getProps";
import { defaultCommonProps, defaultPropTypes } from "../props";

export class Basic extends React.Component {
  // Animated instance
  ctrl = null;

  // Stores all the elements which will be animated
  elements = [];

  static defaultProps = {
    ...defaultCommonProps(),
    autoplay: true
  };

  static propTypes = {
    autoplay: PropTypes.bool,
    ...defaultPropTypes()
  };

  componentDidMount() {
    this.ctrl = animated({
      elements: this.elements,
      // Add all the user defined animation attributes
      ...this.props.attributes,
      // Our .start() methods overrides this and vice-versa
      autoplay: this.props.autoplay,
      // Append lifecycle hooks to the main instance
      ...this.props.lifecycle
    });

    timeBasedExecMethods(this.ctrl, this.props, getPropsFromMain(this.ctrl), {
      init: true
    });
  }

  componentDidUpdate() {
    // Invoke controls for time-based execution methods
    timeBasedExecMethods(this.ctrl, this.props, getPropsFromMain(this.ctrl), {
      init: false
    });
  }

  componentWillUnmount() {
    this.ctrl && this.ctrl.stop();
  }

  addElements = element => {
    this.elements = [...this.elements, element];
  };

  resolveChildren = () => {
    let { children } = this.props;

    if (!Array.isArray(children)) children = [children];

    return children.map((child, i) =>
      React.cloneElement(child, { key: i, ref: this.addElements })
    );
  };

  render() {
    return this.resolveChildren();
  }
}
