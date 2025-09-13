import { CSSResultGroup, LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { fetchContext, FetchContext } from '../../contexts/fetch/fetch-context';

@customElement('friend-search')
export class FriendSearch extends LitElement {
  static styles?: CSSResultGroup | undefined = [resetStyles];

  @state() private query: string = '';
  @state() private users: object = {};
  
  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  private async _handleSearch () {
    try {
      this.users = {};
      const result = await this.fetchContext.requestWithAuth('GET', `/user/search?username=${this.query}`);
      console.log(result)
      this.users = result;
    } catch (error) {

    }
  }

  updated(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has('query') && this.query) {
      this._handleSearch();
    }
  }

  render() {
    return html `
      <input 
        type="text" 
        id="search" 
        name="search" 
        autocomplete="off" 
        @input=${(e: Event) => { 
          const target = e.target as HTMLInputElement;
          this.query = target.value;
        }}
      />
      ${JSON.stringify(this.query)}
      ${JSON.stringify(this.users)}
    `
  }
}