import { consume, provide } from '@lit/context'
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { User } from '../../authentication/types/User';
import { chatContext } from './chat-context';
import { csrfContext } from '../../authentication/contexts/csrf/csrf-context';
import { profileContext } from '../../profile/context/profile-context';
import { IncomingCallOffer } from '../types/IncomingCallOffer';
import { IncomingCallAnswer } from '../types/IncomingCallAnswer';

@customElement('chat-provider')
export class ChatProvider extends LitElement {

  private readonly API_URL = import.meta.env.VITE_BASE_URL;

  @provide({ context: chatContext })
  @state() public chatContext = {
    createCallOffer: this.createCallOffer.bind(this),
    createCallAnswer: this.createCallAnswer.bind(this),
    disableLocalMicrophone: this.disableLocalMicrophone.bind(this),
    disableLocalCamera: this.disableLocalCamera.bind(this),
    hangupCall: this.hangupCall.bind(this),
    localStream: null as MediaStream | null,
    remoteStream: null as MediaStream | null,
  }

  @consume({ context: profileContext, subscribe: true })
  @state() private profile: User | null = null;

  @consume({ context: csrfContext, subscribe: true })
  @state() private token: string | null = null;

  private config: object = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]};
  private lc: RTCPeerConnection | null = null;
  private rc: RTCPeerConnection | null = null;
  public offer: RTCSessionDescription | null = null;
  public answer: RTCSessionDescription | null = null;
  private incomingCallOffer: IncomingCallOffer | null = null;
  private incomingCallAnswer: IncomingCallAnswer | null = null;
  @state() incomingCall: boolean = false;
  @state() outgoingCall: boolean = false;
  @state() callInProgress: boolean = false;

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('profile') || changedProperties.has('token')) {
      this.monitorCallTraffic();
    }
  }
  
  private readonly monitorCallTraffic = () => {
    if (!this.profile) return;
    try {
      const stream = new EventSource(`${this.API_URL}/calls/${this.profile?.id}`);

      stream.addEventListener('offer', (event: MessageEvent) => {
        this.incomingCall = true;
        console.log(this.incomingCall)
        const data = JSON.parse(event.data);
        console.log('INCOMING CALL:', data);
        this.incomingCallOffer = data;
      });

      stream.addEventListener('answer', async (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        console.log('INCOMING ANSWER:', data);
        this.incomingCallAnswer = data;
        if (this.incomingCallAnswer) {
          await this.lc?.setRemoteDescription(this.incomingCallAnswer.sdp);
          console.log('BESZETTELI', this.incomingCallAnswer.sdp)
          this.callInProgress = true;
          this.outgoingCall = false;
        }
      });

      stream.addEventListener('heartbeat', (event) => {
        console.log('Heartbeat:', event.data)
      });

      stream.onmessage = (event: MessageEvent) => {
        console.log('SSE Message:', event.data); 
      };
    } catch (error) {

    }
  }

  public async createCallOffer (calleeId: string) {
    this.lc = new RTCPeerConnection(this.config);

    this.chatContext.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    this.chatContext.localStream.getTracks().forEach((track) => {
      if (this.chatContext.localStream) {
        this.lc?.addTrack(track, this.chatContext.localStream);
      }
    });

    this.lc.ontrack = (event) => {
      if (!this.chatContext.remoteStream) {
        this.chatContext.remoteStream = new MediaStream();
      }
      this.chatContext.remoteStream.addTrack(event.track);
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

    const callOffer: { 
      callerId: string, 
      calleeId: string, 
      sdp: { type: 'offer', sdp: string }
    } = {
      callerId: this.profile?.id!,
      calleeId: calleeId,
      sdp: { type: 'offer', sdp: this.offer.sdp }
    }

    try {
      const response = await fetch(`${this.API_URL}/calls/offer`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.token!
        },
        body: JSON.stringify(callOffer)
      });
      const result = await response.json();
      this.outgoingCall = true;
      console.log(result)
      console.log(`Calling user ${callOffer.calleeId}`);
    } catch (error) {
      console.log(error)
    }
  }
  
  public async createCallAnswer (incomingCallOffer: IncomingCallOffer) {
    
    this.rc = new RTCPeerConnection(this.config);

    this.chatContext.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    this.chatContext.localStream.getTracks().forEach((track) => {
      if (this.chatContext.localStream) {
        this.rc?.addTrack(track, this.chatContext.localStream);
      }
    });

    this.rc.ontrack = (event) => {
      if (!this.chatContext.remoteStream) {
        this.chatContext.remoteStream = new MediaStream();
      }
      this.chatContext.remoteStream.addTrack(event.track);
    };

    await this.rc.setRemoteDescription(incomingCallOffer.sdp);

    const answer = await this.rc.createAnswer();
    await this.rc.setLocalDescription(answer);


    this.callInProgress = true;
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

    const callAnswer : { 
      callerId: string, 
      sdp: { type: 'answer', sdp: string }
    } = {
      callerId: incomingCallOffer.callerId,
      sdp: { type: 'answer', sdp: this.answer!.sdp }
    };

    try {
      const response = await fetch(`${this.API_URL}/calls/answer`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.token!
        },
        body: JSON.stringify(callAnswer)
      });
      console.log(callAnswer);
      const result = await response.json();
      console.log(result)
      console.log(`Answering call from user ${incomingCallOffer.callerName}`);
    } catch (error) {
      console.log(error)
    }
  }

  public async hangupCall () {
    if (this.lc) {
      this.lc.close();
    }

    if (this.chatContext.localStream) {
      this.chatContext.localStream.getTracks().forEach(track => track.stop());
    }

    if (this.chatContext.remoteStream) {
      this.chatContext.remoteStream.getTracks().forEach(track => track.stop());
    }

    this.callInProgress = false;
    this.incomingCall = false;
    this.outgoingCall = false;
  }

  public async disableLocalMicrophone(disable: boolean) {
    if (this.chatContext.localStream) {
      this.chatContext.localStream.getAudioTracks().forEach(track => {
        track.enabled = !disable;
      });
    }
  }

  public async disableLocalCamera(disable: boolean) {
    if (this.chatContext.localStream) {
      this.chatContext.localStream.getVideoTracks().forEach(track => {
        track.enabled = !disable;
      });
    }
  }

  protected render(): unknown {
    if (this.incomingCall) {
      return html`<call-alert .incomingCallOffer=${this.incomingCallOffer}></call-alert>`;
    }

    if (this.callInProgress && this.chatContext.localStream) {
      return html`<video-chat 
        .localStream=${this.chatContext.localStream}
        .remoteStream=${this.chatContext.remoteStream}>
      </video-chat>`;
    }

    if (this.outgoingCall && this.chatContext.localStream) {
      return html`<video-chat 
        .localStream=${this.chatContext.localStream}
        .remoteStream=${this.chatContext.remoteStream}>
      </video-chat>`;
    }

    return html `
      <slot></slot>
    `;
  };
}