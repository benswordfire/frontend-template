import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ErrorContext, errorContext } from './error-context';
import { provide } from '@lit/context';
import { AppError } from './types/AppError';
import { v4 as uuidv4 } from 'uuid';

@customElement('error-provider')
export class ErrorProvider extends LitElement {
  @provide({ context: errorContext })
  @state()
    errorContext: ErrorContext = {
    errors: [],
    reportError: (error) => this.addError(error),
    clearErrors: () => this.clearErrors()
  };

  private async addError(error: Omit<AppError, 'id' | 'timestamp'>): Promise<void> {
    const newError: AppError = {
      ...error,
      id: uuidv4(),
      timestamp: new Date(),
    };

    this.errorContext.errors = [
      ...this.errorContext.errors, 
      newError
    ];
    console.error(error);
    
  };
  
  private async clearErrors(): Promise<void> {
    this.errorContext.errors = [];
  };

  render() {
    return html`<slot></slot>`;
  }


}