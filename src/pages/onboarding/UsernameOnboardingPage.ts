import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('username-onboarding-page')
export class UsernameOnboardingPage extends LitElement {

  render() {
    return html`
      <main style="
      height: 100dvh; 
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center;
      ">
        <progress-ring stepValue="25"></progress-ring>
        <username-onboarding-form style="width: 100%;"></username-onboarding-form>
      </main>
    `;
  }
}