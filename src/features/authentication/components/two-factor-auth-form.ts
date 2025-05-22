import { LitElement, css, html } from 'lit';
import { consume } from '@lit/context';
import { customElement, query, queryAll, state } from 'lit/decorators.js';
import { resetStyles } from '../../../styles/reset-styles';
import { Router } from '@vaadin/router';
import { csrfContext } from '../contexts/csrf/csrf-context';

@customElement('two-factor-auth-form')
export class TwoFactorAuthForm extends LitElement {
  static styles = [
    resetStyles,
    css`
      form div {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
      }
      input[type='text'] {
        width: 3rem;
        height: 3rem;
        text-align: center;
      }
    `,
  ];

  @consume({ context: csrfContext, subscribe: true })
  @state() private token: string = '';

  @query('form') private form!: HTMLFormElement;

  @state() private tokenPartOne: string = '';
  @state() private tokenPartTwo: string = '';
  @state() private tokenPartThree: string = '';
  @state() private tokenPartFour: string = '';
  @state() private tokenPartFive: string = '';
  @state() private tokenPartSix: string = '';

  @query('#tokenPartOne') private firstInput!: HTMLInputElement;
  @queryAll('input') private inputFields!: HTMLInputElement[];

  @state() private formData: { twoFactorAuthToken: string; _csrf: string } = {
    twoFactorAuthToken: '',
    _csrf: '',
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.addPasteListener();
  }

  private addPasteListener(): void {
    this.updateComplete.then(() => {
      this.firstInput?.addEventListener('paste', (event: ClipboardEvent) => {
        event.preventDefault();
        const pasted = event.clipboardData?.getData('text') || '';
        const chars = pasted.trim().slice(0, 6).split('');
        this.inputFields.forEach((input, index) => {
          input.value = chars[index] || '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
    });
  }

  private joinTwoFactorAuthToken(): string {
    return (this.formData.twoFactorAuthToken = this.tokenPartOne.concat(
      this.tokenPartTwo,
      this.tokenPartThree,
      this.tokenPartFour,
      this.tokenPartFive,
      this.tokenPartSix
    ));
  }

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    switch (target.name) {
      case 'tokenPartOne':
        this.tokenPartOne = value;
        break;
      case 'tokenPartTwo':
        this.tokenPartTwo = value;
        break;
      case 'tokenPartThree':
        this.tokenPartThree = value;
        break;
      case 'tokenPartFour':
        this.tokenPartFour = value;
        break;
      case 'tokenPartFive':
        this.tokenPartFive = value;
        break;
      case 'tokenPartSix':
        this.tokenPartSix = value;
        break;
    }

    if (value.length === 1) {
      const index = Array.from(this.inputFields).findIndex(
        (input) => input === target
      );
      if (index >= 0 && index < this.inputFields.length - 1) {
        this.inputFields[index + 1].focus();
      }
    }
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const formData = this.formData;
    formData.twoFactorAuthToken = this.joinTwoFactorAuthToken();
    formData._csrf = this.token;
    try {
      const response = await fetch(
        'http://localhost:3000/api/v1/auth/two-factor-auth',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.success) {
        Router.go('/settings');
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return html`
      <div id="container">
        <form @submit=${this.handleSubmit}>
          <h1 class="logo">jatti</h1>
          <h3>Two Factor Authentication</h3>
          <div>
            <input
              type="text"
              id="tokenPartOne"
              name="tokenPartOne"
              .value="${this.tokenPartOne}"
              @input="${this.handleInput}"
              maxlength="1"
              autocomplete="off"
            />
            <input
              type="text"
              id="tokenPartTwo"
              name="tokenPartTwo"
              .value="${this.tokenPartTwo}"
              @input="${this.handleInput}"
              maxlength="1"
              autocomplete="off"
            />
            <input
              type="text"
              id="tokenPartThree"
              name="tokenPartThree"
              .value="${this.tokenPartThree}"
              @input="${this.handleInput}"
              maxlength="1"
              autocomplete="off"
            />
            <input
              type="text"
              id="tokenPartFour"
              name="tokenPartFour"
              .value="${this.tokenPartFour}"
              @input="${this.handleInput}"
              maxlength="1"
              autocomplete="off"
            />
            <input
              type="text"
              id="tokenPartFive"
              name="tokenPartFive"
              .value="${this.tokenPartFive}"
              @input="${this.handleInput}"
              maxlength="1"
              autocomplete="off"
            />
            <input
              type="text"
              id="tokenPartSix"
              name="tokenPartSix"
              .value="${this.tokenPartSix}"
              @input="${this.handleInput}"
              maxlength="1"
              autocomplete="off"
            />
          </div>
          <a>Didn't recieve code?</a>
          <button type="submit" class="primary">E-mail hitelesítése</button>
        </form>
      </div>
    `;
  }
}
