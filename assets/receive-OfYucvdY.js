import{A as e,B as t,T as n,g as r,r as i,v as a,y as o,z as s}from"./ModalController-CB7tMQEb.js";import{b as c,c as l,d as u,g as d,o as f,p,s as m,u as h,v as g}from"./wui-text-DD3aOHXg.js";import{t as _}from"./if-defined-vwBm-WaP.js";import"./wui-image-BVFNYhyh.js";import"./index-BxUCW20K.js";var v=d`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[4]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[3]};
    border: none;
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e[`ease-out-power-2`]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:active:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-text {
    flex: 1;
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-flex {
    width: auto;
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e[`01`]};
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  .network-icon {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[4]};
    overflow: hidden;
    margin-left: -8px;
  }

  .network-icon:first-child {
    margin-left: 0px;
  }

  .network-icon:after {
    position: absolute;
    inset: 0;
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }
`,y=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},b=class extends g{constructor(){super(...arguments),this.networkImages=[``],this.text=``}render(){return c`
      <button>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
        <wui-flex>
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="inherit"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){return c` <wui-flex class="networks">
      ${this.networkImages.slice(0,5)?.map(e=>c` <wui-flex class="network-icon"> <wui-image src=${e}></wui-image> </wui-flex>`)}
    </wui-flex>`}};b.styles=[p,u,v],y([m({type:Array})],b.prototype,`networkImages`,void 0),y([m()],b.prototype,`text`,void 0),b=y([l(`wui-compatible-network`)],b);var x=d`
  wui-compatible-network {
    margin-top: ${({spacing:e})=>e[4]};
    width: 100%;
  }

  wui-qr-code {
    width: unset !important;
    height: unset !important;
  }

  wui-icon {
    align-items: normal;
  }
`,S=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},C=class extends g{constructor(){super(),this.unsubscribe=[],this.address=i.getAccountData()?.address,this.profileName=i.getAccountData()?.profileName,this.network=i.state.activeCaipNetwork,this.unsubscribe.push(i.subscribeChainProp(`accountState`,t=>{t?(this.address=t.address,this.profileName=t.profileName):e.showError(`Account not found`)}),i.subscribeKey(`activeCaipNetwork`,e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw Error(`w3m-wallet-receive-view: No account provided`);let e=n.getNetworkImage(this.network);return c` <wui-flex
      flexDirection="column"
      .padding=${[`0`,`4`,`4`,`4`]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${h.getTruncateString({string:this.profileName||this.address||``,charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?`end`:`middle`})}
        icon="copy"
        size="sm"
        imageSrc=${e||``}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${[`4`,`0`,`0`,`0`]}
        alignItems="center"
        gap="4"
      >
        <wui-qr-code
          size=${232}
          theme=${a.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${_(a.state.themeVariables[`--apkt-qr-color`]??a.state.themeVariables[`--w3m-qr-color`])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="lg-regular" color="primary" align="center">
          Copy your address or scan this QR code
        </wui-text>
        <wui-button @click=${this.onCopyClick.bind(this)} size="sm" variant="neutral-secondary">
          <wui-icon slot="iconLeft" size="sm" color="inherit" name="copy"></wui-icon>
          <wui-text variant="md-regular" color="inherit">Copy address</wui-text>
        </wui-button>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=i.getAllRequestedCaipNetworks(),t=i.checkIfSmartAccountEnabled(),a=i.state.activeCaipNetwork,o=e.filter(e=>e?.chainNamespace===a?.chainNamespace);if(r(a?.chainNamespace)===s.ACCOUNT_TYPES.SMART_ACCOUNT&&t)return a?c`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[n.getNetworkImage(a)??``]}
      ></wui-compatible-network>`:null;let l=(o?.filter(e=>e?.assets?.imageId)?.slice(0,5)).map(n.getNetworkImage).filter(Boolean);return c`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${l}
    ></wui-compatible-network>`}onReceiveClick(){o.push(`WalletCompatibleNetworks`)}onCopyClick(){try{this.address&&(t.copyToClopboard(this.address),e.showSuccess(`Address copied`))}catch{e.showError(`Failed to copy`)}}};C.styles=x,S([f()],C.prototype,`address`,void 0),S([f()],C.prototype,`profileName`,void 0),S([f()],C.prototype,`network`,void 0),C=S([l(`w3m-wallet-receive-view`)],C);export{C as W3mWalletReceiveView};