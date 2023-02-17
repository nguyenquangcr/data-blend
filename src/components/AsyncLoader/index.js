import React from 'react';
import PageNotFound from './404page.js';
import './stylePageNotFound.scss';

const AsyncLoader = ({ children, noLoading }) => {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={noLoading ? '' : <span>loading...</span>}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <PageNotFound />;
    }

    return this.props.children;
  }
}

export default AsyncLoader;
