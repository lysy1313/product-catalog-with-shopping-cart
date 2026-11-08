import { Button, Container } from "@/shared/ui";
import { Component, type ReactNode } from "react";
import styles from "./ErrorBoundary.module.scss";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: error,
    };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container>
          <section className={styles.errorMessage}>
            <div className={styles.errorBox}>
              <h2>⚠️ Something went wrong</h2>
              <p>An unexpected error occurred in the application.</p>
              <p>
                <strong>Error:</strong> {this.state.error?.message}
              </p>
              <div className={styles.boxBtn}>
                <Button
                  className={styles.errorBtn}
                  onClick={() => window.location.reload()}
                >
                  Reload page
                </Button>
              </div>
            </div>
          </section>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
