import { html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { consume, provide } from '@lit/context';
import { callContext } from './call-context';
import { authContext } from '../../authentication/contexts/authentication/auth-context';
import { User } from '../../authentication/types/User';
import { IncomingCallOffer } from '../types/IncomingCallOffer';
import { OutgoingCallOffer } from '../types/OutgoingCallOffer';
import { csrfContext } from '../../authentication/contexts/csrf/csrf-context';

@customElement('call-provider')
export class CallProvider extends LitElement {
  @provide({ context: callContext })
  @state() public callContext = {
    incomingCallOffer: null as IncomingCallOffer | null,
    outgoingCallOffer: null as OutgoingCallOffer | null,
    incomingCallAnswer: null as RTCSessionDescriptionInit | null,
    localStream: null as MediaStream | null,
    remoteStream: null as MediaStream | null,
    createCallOffer: this.createCallOffer.bind(this),
    createCallAnswer: this.createCallAnswer.bind(this),
  }

  @consume({ context: authContext, subscribe: true })
  @state() private user: User | null = null;

  @consume({ context: csrfContext, subscribe: true })
  @state() private token: string | null = null;

  private lc: RTCPeerConnection | null = null;
  private rc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private config: object = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]};
  private offer: RTCSessionDescription | null = null;
  private answer: RTCSessionDescription | null = null;


  @state() incomingCall: boolean = false;
  @state() outgoingCall: boolean = false;
  @state() callInProgress: boolean = false;
  @query('#localVideo') private localVideo: HTMLVideoElement;

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('user') || changedProperties.has('token')) {
      this.monitorCallTraffic();
    }
  }

  private async monitorCallTraffic() {
    if (!this.user) return;

    const stream = new EventSource(`http://localhost:3000/api/v1/calls/incoming/${this.user!.id}`);
    
    stream.addEventListener('offer', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log('INCOMING CALL:', data)
      this.callContext.incomingCallOffer = data;
      if (this.callContext.incomingCallOffer) {
        this.incomingCall = true;
      }
    });

    stream.addEventListener('answer', async (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.callContext.incomingCallAnswer = data;
      console.log('ANSWER ARRIVED:', this.callContext.incomingCallAnswer)
      if (this.callContext.incomingCallAnswer) {
        console.log('PARSED:', this.callContext.incomingCallAnswer)
        await this.lc?.setRemoteDescription(this.callContext.incomingCallAnswer.answer)
        this.callInProgress = true; // ✅ Add this
        this.outgoingCall = false;  // ✅ Hide the "calling" UI
        console.log('CALLEE CONNTECTED! CALL IS LIVE!')
      }
    });

    stream.onmessage = (event: MessageEvent) => {
      console.log('SSE Message:', event.data); 
    };
  }

  private async createCallAnswer(incomingCallOffer: IncomingCallOffer) {
    this.rc = new RTCPeerConnection(this.config);

    // Get callee's media stream
    this.callContext.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Add media tracks to the peer connection
    this.callContext.localStream.getTracks().forEach((track) => {
      this.rc!.addTrack(track, this.callContext.localStream!);
    });

    this.rc.ondatachannel = (event) => {
      this.dc = event.channel;
      this.dc.onopen = () => console.log('Receiver: Connection open!');
    };

    // Receive and display remote stream
    this.rc.ontrack = (event) => {
      if (!this.callContext.remoteStream) {
        this.callContext.remoteStream = new MediaStream();
      }
      this.callContext.remoteStream.addTrack(event.track);
    };

    await this.rc.setRemoteDescription(incomingCallOffer.offer);
    const answer = await this.rc.createAnswer();
    await this.rc.setLocalDescription(answer);
    this.callInProgress = true; // ✅ Add this
    this.incomingCall = false;

    await new Promise<void>((resolve) => {
      this.rc!.onicecandidate = (event) => {
        if (event.candidate === null) {
          this.answer = this.rc!.localDescription;
          console.log('ANSWER SDP:', this.answer);
          resolve();
        }
      };
    });

    const callAnswer: object = {
      callerId: incomingCallOffer.callerId,
      answer: this.answer
    };

    try {
      const response = await fetch('http://localhost:3000/api/v1/call/answer', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.token!,
        },
        body: JSON.stringify(callAnswer),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log('Failed to answer call:', error);
    }
  }


  // INITIATE A CALL

  private async createCallOffer(calleeId: string) {
    // INITALIZE LOCAL PEER CONNECTION
    this.lc = new RTCPeerConnection(this.config);

    // ENABLE LOCAL VIDEO AND AUDIO FOR STREAMING
    this.callContext.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // ADD VIDEO AND AUDIO TRACKS TO LOCAL STREAM
    this.callContext.localStream.getTracks().forEach((track) => {
      this.lc!.addTrack(track, this.callContext.localStream!)
    });

    // HANDLE INCOMING VIDEO AND AUDIO TRACKS AND POPULATE REMOTE STREAM
    this.lc.ontrack = (event) => {
      if (!this.callContext.remoteStream) {
        this.callContext.remoteStream = new MediaStream();
      }
      this.callContext.remoteStream.addTrack(event.track);
    };

    const offer = await this.lc.createOffer();
    await this.lc.setLocalDescription(offer);

    await new Promise<void>(resolve => {
      this.lc!.onicecandidate = (event) => {
        if (event.candidate === null) { 
          this.offer = this.lc!.localDescription;
          console.log('OFFER SDP:', this.offer)
          resolve();
        }
      };
    });

    if (!this.offer) {
      throw new Error('Failed to create offer');
    }

    const outgoingCallOffer: OutgoingCallOffer = {
      callerId: this.user?.id!,
      calleeId: calleeId,
      offer: {
        type: 'offer',
        sdp: this.offer.sdp
      }
    };

    try {
      const response = await fetch('http://localhost:3000/api/v1/calls', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.token!,
        },
        body: JSON.stringify(outgoingCallOffer),
      });
      const result = await response.json();
      this.outgoingCall = true;

      console.log(result)
    } catch (error) {
      console.log(error);
    } 
  }



render() {
  if (this.callInProgress && this.callContext.localStream) {
    return html`<video-chat 
      .localStream=${this.callContext.localStream}
      .remoteStream=${this.callContext.remoteStream}>
    </video-chat>`;
  }

  if (this.incomingCall && this.callContext.incomingCallOffer) {
    return html`<call-alert .incomingCallOffer=${this.callContext.incomingCallOffer}></call-alert>`;
  }

  if (this.outgoingCall && this.callContext.localStream) {
    return html`<video-chat 
      .localStream=${this.callContext.localStream}
      .remoteStream=${this.callContext.remoteStream}>
    </video-chat>`;
  }

  return html`<slot></slot>`;
}


}

