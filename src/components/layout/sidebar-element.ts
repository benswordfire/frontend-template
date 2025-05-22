import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { resetStyles } from '../../styles/reset-styles';
import { classMap } from 'lit/directives/class-map.js';


@customElement('sidebar-element')
export class SidebarElement extends LitElement {
  static styles = [resetStyles, 
    css `
      #sidebar {
        box-sizing: border-box;
        height: 100vh;
        width: 250px;
        padding: 5px 1em;
        background-color: white;
        border-right: 1px solid black;
        position: sticky;
        top: 0;
        align-self: start;
        transition: 300ms ease-in-out;
        overflow: hidden;
      }
      #sidebar.close {
        padding: 5px;
        width: 60px;
      }
      #sidebar ul {
        list-style: none;
      }
      #sidebar > ul > li:first-child {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 16px;
        .logo {
          font-weight: 600;
        }
      }
      #sidebar ul li.active a {
        color: blue;
        svg {
          fill: blue;
        }
      }
      #sidebar a, 
      #sidebar .dropdown-btn, 
      #sidebar.logo {
        border-radius: 0.5rem;
        padding: 0.5rem;
        text-decoration: none;
        color: black;
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .dropdown-btn {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        font: inherit;
        cursor: pointer;
      }
      #sidebar svg {
        flex-shrink: 0;
        fill: black;
      }
      #sidebar a span,
      #sidebar .dropdown-btn span {
        flex-grow: 1; 
      }
      #sidebar a:hover, #sidebar .dropdown-btn:hover {
        background-color: gray;
      }
      #sidebar .sub-menu {
        display: grid;
        grid-template-rows: 0fr;
        transition: 300ms ease-in-out;

        > div {
          overflow: hidden;
        }  
      }
      #sidebar .sub-menu.show {
        grid-template-rows: 1fr;
      }
      .dropdown-btn svg {
        transition: 200ms ease
      }
      .rotate svg:last-child {
        rotate: 180deg;
      }
      #sidebar .sub-menu a {
        padding-left: 2em;
      }
      #toggle-btn {
        margin-left: auto;
        padding: 1rem;
        border: none;
        border-radius: 0.5rem;
        background: none;
        cursor: pointer;
      }
      #toggle-btn:hover {
        background-color: red;
      }
  `];

  @property({type: Boolean})
  show = true;

  @property({type: Boolean})
  rotate = true;

  @property({type: Boolean})
  close = false;

  render() {
    const display = {
      show: this.show,
    };
    const rotation = {
      rotate: this.rotate
    };
    const closure = {
      close: this.close
    }
    return html`
      <nav id="sidebar" class="${classMap(closure)}">
        <ul>
          <li>
            <span class="logo">kommuniti</span>
            <button id="toggle-btn" @click="${this.toggleSidebar}">
              <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
              </svg>
            </button>
          </li>
          <li class="active">
            <a href="/settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a href="/messenger">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-square-text-fill" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z"/>
              </svg>
              <span>Messenger</span>
            </a>
          </li>
          <li>
            <button class="dropdown-btn ${classMap(rotation)}" @click="${this.toggleSubMenu}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
              <span>Settings</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
              </svg>
            </button>
            <ul class="sub-menu ${classMap(display)}">
              <div>
                <li><a href="#">User</a></li>
                <li><a href="#">Security</a></li>
              </div>
            </ul>
          </li>
        </ul>
      </nav>
    `;
  }

  private toggleSubMenu() {
    this.show = !this.show;
    this.rotate = !this.rotate;
  }

  private toggleSidebar() {
    this.close = !this.close
  }
}
