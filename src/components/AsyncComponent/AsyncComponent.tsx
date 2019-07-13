import React, { Component } from "react";

const asyncComponent = (
  importComponent: () => Promise<{ default: React.ElementType }>
) => {
  class AsyncComponent extends Component<
    any,
    { component?: React.ElementType }
  > {
    constructor(props: any) {
      super(props);
      this.state = {};
    }

    async componentDidMount() {
      const { default: component } = await importComponent();
      this.setState({
        component: component
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
};

export { asyncComponent };
