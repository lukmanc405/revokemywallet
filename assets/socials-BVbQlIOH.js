import{A as e,B as t,C as n,H as r,S as i,V as a,_ as o,j as s,l as c,r as l,t as u,v as d,y as f}from"./ModalController-CB7tMQEb.js";import{b as p,c as m,g as h,o as g,s as _,v}from"./wui-text-DD3aOHXg.js";import{n as y,r as b,t as x}from"./wui-list-social-lDIvr59I.js";import{t as S}from"./AlertController-DZZY7SSE.js";import{t as C}from"./wui-loading-thumbnail-XP9BmLzi.js";import{t as w}from"./if-defined-vwBm-WaP.js";import"./wui-icon-pv6cpAFQ.js";import{t as T}from"./ConstantsUtil-DqF0P55S.js";import"./wui-icon-box-CKOfFYtz.js";import"./index-BxUCW20K.js";var E=h`
  :host {
    margin-top: ${({spacing:e})=>e[1]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1)
      ${({spacing:e})=>e[2]} calc(${({spacing:e})=>e[3]} * -1);
    width: calc(100% + ${({spacing:e})=>e[3]} * 2);
  }
`,D=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},O=class extends v{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=o.state.connectors,this.authConnector=this.connectors.find(e=>e.type===`AUTH`),this.remoteFeatures=s.state.remoteFeatures,this.isPwaLoading=!1,this.hasExceededUsageLimit=i.state.plan.hasExceededUsageLimit,this.unsubscribe.push(o.subscribeKey(`connectors`,e=>{this.connectors=e,this.authConnector=this.connectors.find(e=>e.type===`AUTH`)}),s.subscribeKey(`remoteFeatures`,e=>this.remoteFeatures=e))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.remoteFeatures?.socials||[],t=!!this.authConnector,n=e?.length,i=f.state.view===`ConnectSocials`;return(!t||!n)&&!i?null:(i&&!n&&(e=r.DEFAULT_SOCIALS),p` <wui-flex flexDirection="column" gap="2">
      ${e.map(e=>p`<wui-list-social
            @click=${()=>{this.onSocialClick(e)}}
            data-testid=${`social-selector-${e}`}
            name=${e}
            logo=${e}
            ?disabled=${this.isPwaLoading}
          ></wui-list-social>`)}
    </wui-flex>`)}async onSocialClick(e){if(this.hasExceededUsageLimit){f.push(`UsageExceeded`);return}e&&await x(e)}async handlePwaFrameLoad(){if(t.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof b&&await this.authConnector.provider.init()}catch(e){S.open({displayMessage:`Error loading embedded wallet in PWA`,debugMessage:e.message},`error`)}finally{this.isPwaLoading=!1}}}};O.styles=E,D([_()],O.prototype,`tabIdx`,void 0),D([g()],O.prototype,`connectors`,void 0),D([g()],O.prototype,`authConnector`,void 0),D([g()],O.prototype,`remoteFeatures`,void 0),D([g()],O.prototype,`isPwaLoading`,void 0),D([g()],O.prototype,`hasExceededUsageLimit`,void 0),O=D([m(`w3m-social-login-list`)],O);var k=h`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity ${({durations:e})=>e.md}
      ${({easings:e})=>e[`ease-out-power-1`]};
    will-change: opacity;
  }

  wui-flex::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`,A=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},j=class extends v{constructor(){super(),this.unsubscribe=[],this.checked=C.state.isLegalCheckboxChecked,this.unsubscribe.push(C.subscribeKey(`isLegalCheckboxChecked`,e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=s.state,n=s.state.features?.legalCheckbox,r=!!(e||t)&&!!n&&!this.checked,i=r?-1:void 0;return p`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${[`0`,`3`,`3`,`3`]}
        gap="01"
        class=${w(r?`disabled`:void 0)}
      >
        <w3m-social-login-list tabIdx=${w(i)}></w3m-social-login-list>
      </wui-flex>
    `}};j.styles=k,A([g()],j.prototype,`checked`,void 0),j=A([m(`w3m-connect-socials-view`)],j);var M=h`
  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: ${({borderRadius:e})=>e[8]};
  }
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }
  wui-flex:first-child:not(:only-child) {
    position: relative;
  }
  wui-loading-thumbnail {
    position: absolute;
  }
  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e[1]} * -1);
    bottom: calc(${({spacing:e})=>e[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all ${({easings:e})=>e[`ease-out-power-2`]}
      ${({durations:e})=>e.lg};
  }
  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e[4]};
  }
  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }
  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e[`ease-out-power-2`]} both;
  }
  .capitalize {
    text-transform: capitalize;
  }
`,N=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},P=class extends v{constructor(){super(),this.unsubscribe=[],this.socialProvider=l.getAccountData()?.socialProvider,this.socialWindow=l.getAccountData()?.socialWindow,this.error=!1,this.connecting=!1,this.message=`Connect in the provider window`,this.remoteFeatures=s.state.remoteFeatures,this.address=l.getAccountData()?.address,this.connectionsByNamespace=c.getConnections(l.state.activeChain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.authConnector=o.getAuthConnector(),this.handleSocialConnection=async r=>{if(r.data?.resultUri)if(r.origin===T.SECURE_SITE_ORIGIN){window.removeEventListener(`message`,this.handleSocialConnection,!1);try{if(this.authConnector&&!this.connecting){this.connecting=!0;let e=this.parseURLError(r.data.resultUri);if(e){this.handleSocialError(e);return}this.closeSocialWindow(),this.updateMessage();let t=r.data.resultUri;this.socialProvider&&n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_REQUEST_USER_DATA`,properties:{provider:this.socialProvider}}),await c.connectExternal({id:this.authConnector.id,type:this.authConnector.type,socialUri:t},this.authConnector.chain),this.socialProvider&&(a.setConnectedSocialProvider(this.socialProvider),n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_SUCCESS`,properties:{provider:this.socialProvider}}))}}catch(e){this.error=!0,this.updateMessage(),this.socialProvider&&n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_ERROR`,properties:{provider:this.socialProvider,message:t.parseError(e)}})}}else f.goBack(),e.showError(`Untrusted Origin`),this.socialProvider&&n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_ERROR`,properties:{provider:this.socialProvider,message:`Untrusted Origin`}})},y.EmbeddedWalletAbortController.signal.addEventListener(`abort`,()=>{this.closeSocialWindow()}),this.unsubscribe.push(l.subscribeChainProp(`accountState`,t=>{if(t&&(this.socialProvider=t.socialProvider,t.socialWindow&&(this.socialWindow=t.socialWindow),t.address)){let n=this.remoteFeatures?.multiWallet;t.address!==this.address&&(this.hasMultipleConnections&&n?(f.replace(`ProfileWallets`),e.showSuccess(`New Wallet Added`),this.address=t.address):(u.state.open||s.state.enableEmbedded)&&u.close())}}),s.subscribeKey(`remoteFeatures`,e=>{this.remoteFeatures=e})),this.authConnector&&this.connectSocial()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),window.removeEventListener(`message`,this.handleSocialConnection,!1),!l.state.activeCaipAddress&&this.socialProvider&&!this.connecting&&n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_CANCELED`,properties:{provider:this.socialProvider}}),this.closeSocialWindow()}render(){return p`
      <wui-flex
        data-error=${w(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${[`10`,`5`,`5`,`5`]}
        gap="6"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${w(this.socialProvider)}></wui-logo>
          ${this.error?null:this.loaderTemplate()}
          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="lg-medium" color="primary"
            >Log in with
            <span class="capitalize">${this.socialProvider??`Social`}</span></wui-text
          >
          <wui-text align="center" variant="lg-regular" color=${this.error?`error`:`secondary`}
            >${this.message}</wui-text
          ></wui-flex
        >
      </wui-flex>
    `}loaderTemplate(){let e=d.state.themeVariables[`--w3m-border-radius-master`];return p`<wui-loading-thumbnail radius=${(e?parseInt(e.replace(`px`,``),10):4)*9}></wui-loading-thumbnail>`}parseURLError(e){try{let t=e.indexOf(`error=`);return t===-1?null:e.substring(t+6)}catch{return null}}connectSocial(){let e=setInterval(()=>{this.socialWindow?.closed&&(!this.connecting&&f.state.view===`ConnectingSocial`&&f.goBack(),clearInterval(e))},1e3);window.addEventListener(`message`,this.handleSocialConnection,!1)}updateMessage(){this.error?this.message=`Something went wrong`:this.connecting?this.message=`Retrieving user data`:this.message=`Connect in the provider window`}handleSocialError(e){this.error=!0,this.updateMessage(),this.socialProvider&&n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_ERROR`,properties:{provider:this.socialProvider,message:e}}),this.closeSocialWindow()}closeSocialWindow(){this.socialWindow&&(this.socialWindow.close(),l.setAccountProp(`socialWindow`,void 0,l.state.activeChain))}};P.styles=M,N([g()],P.prototype,`socialProvider`,void 0),N([g()],P.prototype,`socialWindow`,void 0),N([g()],P.prototype,`error`,void 0),N([g()],P.prototype,`connecting`,void 0),N([g()],P.prototype,`message`,void 0),N([g()],P.prototype,`remoteFeatures`,void 0),P=N([m(`w3m-connecting-social-view`)],P);var F=h`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e[`ease-out-power-2`]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: ${({borderRadius:e})=>e[8]};
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e[1]} * -1);
    bottom: calc(${({spacing:e})=>e[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e[`ease-out-power-2`]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: opacity, transform;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`,I=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},L=class extends v{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.socialProvider=l.getAccountData()?.socialProvider,this.uri=l.getAccountData()?.farcasterUrl,this.ready=!1,this.loading=!1,this.remoteFeatures=s.state.remoteFeatures,this.authConnector=o.getAuthConnector(),this.forceUpdate=()=>{this.requestUpdate()},this.unsubscribe.push(l.subscribeChainProp(`accountState`,e=>{this.socialProvider=e?.socialProvider,this.uri=e?.farcasterUrl,this.connectFarcaster()}),s.subscribeKey(`remoteFeatures`,e=>{this.remoteFeatures=e})),window.addEventListener(`resize`,this.forceUpdate)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timeout),window.removeEventListener(`resize`,this.forceUpdate),!l.state.activeCaipAddress&&this.socialProvider&&(this.uri||this.loading)&&n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_CANCELED`,properties:{provider:this.socialProvider}})}render(){return this.onRenderProxy(),p`${this.platformTemplate()}`}platformTemplate(){return t.isMobile()?p`${this.mobileTemplate()}`:p`${this.desktopTemplate()}`}desktopTemplate(){return this.loading?p`${this.loadingTemplate()}`:p`${this.qrTemplate()}`}qrTemplate(){return p` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${[`0`,`5`,`5`,`5`]}
      gap="5"
    >
      <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

      <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
      ${this.copyTemplate()}
    </wui-flex>`}loadingTemplate(){return p`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${[`5`,`5`,`5`,`5`]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo="farcaster"></wui-logo>
          ${this.loaderTemplate()}
          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="md-medium" color="primary">
            Loading user data
          </wui-text>
          <wui-text align="center" variant="sm-regular" color="secondary">
            Please wait a moment while we load your data.
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}mobileTemplate(){return p` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${[`10`,`5`,`5`,`5`]}
      gap="5"
    >
      <wui-flex justifyContent="center" alignItems="center">
        <wui-logo logo="farcaster"></wui-logo>
        ${this.loaderTemplate()}
        <wui-icon-box
          color="error"
          icon="close"
          size="sm"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="2">
        <wui-text align="center" variant="md-medium" color="primary"
          >Continue in Farcaster</span></wui-text
        >
        <wui-text align="center" variant="sm-regular" color="secondary"
          >Accept connection request in the app</wui-text
        ></wui-flex
      >
      ${this.mobileLinkTemplate()}
    </wui-flex>`}loaderTemplate(){let e=d.state.themeVariables[`--w3m-border-radius-master`];return p`<wui-loading-thumbnail radius=${(e?parseInt(e.replace(`px`,``),10):4)*9}></wui-loading-thumbnail>`}async connectFarcaster(){if(this.authConnector)try{await this.authConnector?.provider.connectFarcaster(),this.socialProvider&&(a.setConnectedSocialProvider(this.socialProvider),n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_REQUEST_USER_DATA`,properties:{provider:this.socialProvider}})),this.loading=!0;let t=c.getConnections(this.authConnector.chain).length>0;await c.connectExternal(this.authConnector,this.authConnector.chain);let r=this.remoteFeatures?.multiWallet;this.socialProvider&&n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_SUCCESS`,properties:{provider:this.socialProvider}}),this.loading=!1,t&&r?(f.replace(`ProfileWallets`),e.showSuccess(`New Wallet Added`)):u.close()}catch(r){this.socialProvider&&n.sendEvent({type:`track`,event:`SOCIAL_LOGIN_ERROR`,properties:{provider:this.socialProvider,message:t.parseError(r)}}),f.goBack(),e.showError(r)}}mobileLinkTemplate(){return p`<wui-button
      size="md"
      ?loading=${this.loading}
      ?disabled=${!this.uri||this.loading}
      @click=${()=>{this.uri&&t.openHref(this.uri,`_blank`)}}
    >
      Open farcaster</wui-button
    >`}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.getBoundingClientRect().width-40,t=d.state.themeVariables[`--apkt-qr-color`]??d.state.themeVariables[`--w3m-qr-color`];return p` <wui-qr-code
      size=${e}
      theme=${d.state.themeMode}
      uri=${this.uri}
      ?farcaster=${!0}
      data-testid="wui-qr-code"
      color=${w(t)}
    ></wui-qr-code>`}copyTemplate(){return p`<wui-button
      .disabled=${!this.uri||!this.ready}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="sm" color="default" slot="iconRight" name="copy"></wui-icon>
      Copy link
    </wui-button>`}onCopyUri(){try{this.uri&&(t.copyToClopboard(this.uri),e.showSuccess(`Link copied`))}catch{e.showError(`Failed to copy`)}}};L.styles=F,I([g()],L.prototype,`socialProvider`,void 0),I([g()],L.prototype,`uri`,void 0),I([g()],L.prototype,`ready`,void 0),I([g()],L.prototype,`loading`,void 0),I([g()],L.prototype,`remoteFeatures`,void 0),L=I([m(`w3m-connecting-farcaster-view`)],L);export{j as W3mConnectSocialsView,L as W3mConnectingFarcasterView,P as W3mConnectingSocialView};