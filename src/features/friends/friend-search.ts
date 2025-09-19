import { CSSResultGroup, LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { consume } from '@lit/context';
import { fetchContext, FetchContext } from '../../contexts/fetch/fetch-context';
import { FriendSearchResult } from './types/FriendSearchResult';

@customElement('friend-search')
export class FriendSearch extends LitElement {
  static styles?: CSSResultGroup | undefined = [resetStyles];

  @state() private query: string = '';
  @state() private users: Array<FriendSearchResult> = [];
  
  @consume({ context: fetchContext, subscribe: true })
  @state() fetchContext!: FetchContext;

  private async _handleSearch () {
    try {
      this.users = [];
      if (!this.query.trim()) {
        return;
      }
      const result = await this.fetchContext.requestWithAuth('GET', `/user/search?username=${this.query}`);
      console.log(result)
      this.users = result.data.users;
    } catch (error) {

    }
  }

  updated(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has('query')) {
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
          {JSON.stringify(target)}
          this.query = target.value;
        }}
      />
      <ul style="display: flex; flex-direction: column; gap: 1rem;">
        ${this.users.map((user) => 
        html `
          <friends-search-result-element username=${user.username} friendId=${user.id}></friends-search-result-element>
          `
        )}
      </ul>
    `
  }
}