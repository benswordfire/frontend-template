import { consume, provide } from '@lit/context'
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { authContext } from '../../authentication/contexts/authentication/auth-context';
import { User } from '../../authentication/types/User';
import { chatContext } from './chat-context';
import { OutgoingCallOffer } from '../types/OutgoingCallOffer';
import { csrfContext } from '../../authentication/contexts/csrf/csrf-context';

@customElement('chat-provider')
export class ChatProvider extends LitElement {
  @provide({ context: chatContext })
  @state() public chatContext = {
    createCallOffer: this.createCallOffer.bind(this),
  }

  @consume({ context: authContext, subscribe: true })
  @state() private user: User | null = null;

  @consume({ context: csrfContext, subscribe: true })
  @state() private token: string | null = null;

  private lc: RTCPeerConnection | null = null;
  private config: object = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]};
  private offer: RTCSessionDescription | null = null;

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('user') || changedProperties.has('token')) {
      this.monitorChatTraffic();
    }
  }

  private async monitorChatTraffic() {
    if (!this.user) return;

    const stream = new EventSource(`http://localhost:3000/api/v1/calls/incoming/${this.user!.id}`);
    
    stream.onmessage = (event: MessageEvent) => {
      console.log('SSE Message:', event.data); 
    };
  }

private async createCallOffer(calleeId: string) {
  console.log('[1] Starting createCallOffer for:', calleeId);



  
  try {
    this.lc = new RTCPeerConnection(this.config);
    console.log('[2] PeerConnection created');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    stream.getTracks().forEach((track) => {
    this.lc!.addTrack(track, stream);
    });
    const offer = await this.lc.createOffer();
    console.log('[3] Offer created:', offer);

    await this.lc.setLocalDescription(offer);
    console.log('[4] Local description set');

    const lc = this.lc;
    
    await new Promise<void>((resolve, reject) => {
      console.log('[5] Waiting for ICE candidates');
      
      if (!lc) {
        console.error('[5a] PeerConnection is null');
        reject(new Error('RTCPeerConnection is null'));
        return;
      }

      lc.onicecandidate = (event) => {
        console.log('[6] ICE candidate event:', event.candidate);
        
        if (event.candidate === null) {
          console.log('[7] All ICE candidates gathered');
          this.offer = this.lc!.localDescription;
          console.log('[8] Final offer:', this.offer);
          resolve();
        }
      };

      // Add error handling
        lc.onicecandidateerror = (event) => {
        console.warn('[ICE candidate error]', event);
        // Only reject if serious
        if (event.errorCode >= 701) {
            reject(new Error(`Serious ICE candidate error: ${event.errorText}`));
        }
        };

        this.lc!.onicegatheringstatechange = () => {
        console.log('ICE Gathering State:', this.lc!.iceGatheringState);
        };


      
      // Add timeout as fallback
    setTimeout(() => {
    console.warn('[ICE Timeout] No candidates after 5 seconds');
    reject(new Error('ICE gathering timed out'));
    }, 5000);

    });

    console.log('[9] Creating outgoing offer payload');
    const outgoingCallOffer: OutgoingCallOffer = {
      callerId: this.user?.id!,
      calleeId: calleeId,
      offer: {
        type: 'offer',
        sdp: this.offer!.sdp
      }
    };

    console.log('[10] Sending offer to server');
    const response = await fetch('http://localhost:3000/api/v1/calls', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.token!,
      },
      body: JSON.stringify(outgoingCallOffer),
    });
    
    console.log('[11] Server response status:', response.status);
    const result = await response.json();
    console.log('[12] Server response:', result);

  } catch (error) {
    console.error('[ERROR] in createCallOffer:', error);
    throw error;
  }
}
  render() {
    return html`<slot></slot>`;
  }
}