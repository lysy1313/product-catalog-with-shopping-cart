import { Component, type ErrorInfo, type ReactNode } from "react";
import { Container } from "../Container/Container";
import styles from "./ErrorBoundary.module.scss";
import { Button } from "../Button/Button";

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
              <h2>⚠️ Что-то пошло не так</h2>
              <p>Произошла ошибка в приложении.</p>
              <p>
                <strong>Ошибка:</strong> {this.state.error?.message}
              </p>
              <div className={styles.boxBtn}>
                <Button
                  className={styles.errorBtn}
                  onClick={() => window.location.reload()}
                >
                  Обновить страницу
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
