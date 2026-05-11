import{A as e,B as t,C as n,E as r,T as i,g as a,j as o,l as s,r as c,t as l,v as u,y as d,z as f}from"./ModalController-CB7tMQEb.js";import{b as p,c as m,g as h,o as g,s as _,v}from"./wui-text-DD3aOHXg.js";import{t as y}from"./wui-loading-thumbnail-XP9BmLzi.js";import{t as b}from"./if-defined-vwBm-WaP.js";import"./w3m-onramp-providers-footer-T3RmiCkC.js";import"./wui-icon-pv6cpAFQ.js";import"./wui-link-BvEGu5k4.js";import"./wui-icon-box-CKOfFYtz.js";import{n as x}from"./index-BxUCW20K.js";import"./wui-image-C1g70g1K.js";var S=h`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:e})=>e[`ease-out-power-1`]}
      ${({durations:e})=>e.md};
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`,C=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},w=class extends v{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=x.state.paymentCurrency,this.currencies=x.state.paymentCurrencies,this.currencyImages=r.state.currencyImages,this.checked=y.state.isLegalCheckboxChecked,this.unsubscribe.push(x.subscribe(e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies}),r.subscribeKey(`currencyImages`,e=>this.currencyImages=e),y.subscribeKey(`isLegalCheckboxChecked`,e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=o.state,n=o.state.features?.legalCheckbox,r=!!(e||t)&&!!n&&!this.checked;return p`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${[`0`,`3`,`3`,`3`]}
        gap="2"
        class=${b(r?`disabled`:void 0)}
      >
        ${this.currenciesTemplate(r)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.currencies.map(t=>p`
        <wui-list-item
          imageSrc=${b(this.currencyImages?.[t.id])}
          @click=${()=>this.selectCurrency(t)}
          variant="image"
          tabIdx=${b(e?-1:void 0)}
        >
          <wui-text variant="md-medium" color="primary">${t.id}</wui-text>
        </wui-list-item>
      `)}selectCurrency(e){e&&(x.setPaymentCurrency(e),l.close())}};w.styles=S,C([g()],w.prototype,`selectedCurrency`,void 0),C([g()],w.prototype,`currencies`,void 0),C([g()],w.prototype,`currencyImages`,void 0),C([g()],w.prototype,`checked`,void 0),w=C([m(`w3m-onramp-fiat-select-view`)],w);var T=h`
  button {
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[4]};
    border: none;
    outline: none;
    background-color: ${({tokens:e})=>e.core.glass010};
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${({spacing:e})=>e[3]};
    transition: background-color ${({easings:e})=>e[`ease-out-power-1`]}
      ${({durations:e})=>e.md};
    will-change: background-color;
    cursor: pointer;
  }

  button:hover {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .provider-image {
    width: ${({spacing:e})=>e[10]};
    min-width: ${({spacing:e})=>e[10]};
    height: ${({spacing:e})=>e[10]};
    border-radius: calc(
      ${({borderRadius:e})=>e[4]} - calc(${({spacing:e})=>e[3]} / 2)
    );
    position: relative;
    overflow: hidden;
  }

  .network-icon {
    width: ${({spacing:e})=>e[3]};
    height: ${({spacing:e})=>e[3]};
    border-radius: calc(${({spacing:e})=>e[3]} / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px ${({tokens:e})=>e.theme.foregroundPrimary},
      0 0 0 3px ${({tokens:e})=>e.theme.backgroundPrimary};
    transition: box-shadow ${({easings:e})=>e[`ease-out-power-1`]}
      ${({durations:e})=>e.md};
    will-change: box-shadow;
  }

  button:hover .network-icon {
    box-shadow:
      0 0 0 3px ${({tokens:e})=>e.core.glass010},
      0 0 0 3px ${({tokens:e})=>e.theme.backgroundPrimary};
  }
`,E=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},D=class extends v{constructor(){super(...arguments),this.disabled=!1,this.color=`inherit`,this.label=``,this.feeRange=``,this.loading=!1,this.onClick=null}render(){return p`
      <button ?disabled=${this.disabled} @click=${this.onClick} ontouchstart>
        <wui-visual name=${b(this.name)} class="provider-image"></wui-visual>
        <wui-flex flexDirection="column" gap="01">
          <wui-text variant="md-regular" color="primary">${this.label}</wui-text>
          <wui-flex alignItems="center" justifyContent="flex-start" gap="4">
            <wui-text variant="sm-medium" color="primary">
              <wui-text variant="sm-regular" color="secondary">Fees</wui-text>
              ${this.feeRange}
            </wui-text>
            <wui-flex gap="2">
              <wui-icon name="bank" size="sm" color="default"></wui-icon>
              <wui-icon name="card" size="sm" color="default"></wui-icon>
            </wui-flex>
            ${this.networksTemplate()}
          </wui-flex>
        </wui-flex>
        ${this.loading?p`<wui-loading-spinner color="secondary" size="md"></wui-loading-spinner>`:p`<wui-icon name="chevronRight" color="default" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){return p`
      <wui-flex class="networks">
        ${(c.getAllRequestedCaipNetworks()?.filter(e=>e?.assets?.imageId)?.slice(0,5))?.map(e=>p`
            <wui-flex class="network-icon">
              <wui-image src=${b(i.getNetworkImage(e))}></wui-image>
            </wui-flex>
          `)}
      </wui-flex>
    `}};D.styles=[T],E([_({type:Boolean})],D.prototype,`disabled`,void 0),E([_()],D.prototype,`color`,void 0),E([_()],D.prototype,`name`,void 0),E([_()],D.prototype,`label`,void 0),E([_()],D.prototype,`feeRange`,void 0),E([_({type:Boolean})],D.prototype,`loading`,void 0),E([_()],D.prototype,`onClick`,void 0),D=E([m(`w3m-onramp-provider-item`)],D);var O=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},k=class extends v{constructor(){super(),this.unsubscribe=[],this.providers=x.state.providers,this.unsubscribe.push(x.subscribeKey(`providers`,e=>{this.providers=e}))}render(){return p`
      <wui-flex flexDirection="column" .padding=${[`0`,`3`,`3`,`3`]} gap="2">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
    `}onRampProvidersTemplate(){return this.providers.filter(e=>e.supportedChains.includes(c.state.activeChain??`eip155`)).map(e=>p`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
            data-testid=${`onramp-provider-${e.name}`}
          ></w3m-onramp-provider-item>
        `)}onClickProvider(e){x.setSelectedProvider(e),d.push(`BuyInProgress`),t.openHref(x.state.selectedProvider?.url||e.url,`popupWindow`,`width=600,height=800,scrollbars=yes`),n.sendEvent({type:`track`,event:`SELECT_BUY_PROVIDER`,properties:{provider:e.name,isSmartAccount:a(c.state.activeChain)===f.ACCOUNT_TYPES.SMART_ACCOUNT}})}};O([g()],k.prototype,`providers`,void 0),k=O([m(`w3m-onramp-providers-view`)],k);var A=h`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:e})=>e[`ease-out-power-1`]}
      ${({durations:e})=>e.md};
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`,j=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},M=class extends v{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=x.state.purchaseCurrencies,this.tokens=x.state.purchaseCurrencies,this.tokenImages=r.state.tokenImages,this.checked=y.state.isLegalCheckboxChecked,this.unsubscribe.push(x.subscribe(e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies}),r.subscribeKey(`tokenImages`,e=>this.tokenImages=e),y.subscribeKey(`isLegalCheckboxChecked`,e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=o.state,n=o.state.features?.legalCheckbox,r=!!(e||t)&&!!n&&!this.checked;return p`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${[`0`,`3`,`3`,`3`]}
        gap="2"
        class=${b(r?`disabled`:void 0)}
      >
        ${this.currenciesTemplate(r)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.tokens.map(t=>p`
        <wui-list-item
          imageSrc=${b(this.tokenImages?.[t.symbol])}
          @click=${()=>this.selectToken(t)}
          variant="image"
          tabIdx=${b(e?-1:void 0)}
        >
          <wui-flex gap="1" alignItems="center">
            <wui-text variant="md-medium" color="primary">${t.name}</wui-text>
            <wui-text variant="sm-regular" color="secondary">${t.symbol}</wui-text>
          </wui-flex>
        </wui-list-item>
      `)}selectToken(e){e&&(x.setPurchaseCurrency(e),l.close())}};M.styles=A,j([g()],M.prototype,`selectedCurrency`,void 0),j([g()],M.prototype,`tokens`,void 0),j([g()],M.prototype,`tokenImages`,void 0),j([g()],M.prototype,`checked`,void 0),M=j([m(`w3m-onramp-token-select-view`)],M);var N=h`
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

  wui-visual {
    border-radius: calc(
      ${({borderRadius:e})=>e[1]} * 9 - ${({borderRadius:e})=>e[3]}
    );
    position: relative;
    overflow: hidden;
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

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:e})=>e[`01`]} ${({spacing:e})=>e[2]};
  }
`,P=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},F=class extends v{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=x.state.selectedProvider,this.uri=s.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(x.subscribeKey(`selectedProvider`,e=>{this.selectedOnRampProvider=e}))}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e=`Continue in external window`;this.error?e=`Buy failed`:this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);let t=this.error?`Buy can be declined from your side or due to and error on the provider app`:`We’ll notify you once your Buy is processed`;return p`
      <wui-flex
        data-error=${b(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${[`10`,`5`,`5`,`5`]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-visual
            name=${b(this.selectedOnRampProvider?.name)}
            size="lg"
            class="provider-image"
          >
          </wui-visual>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${[`4`,`0`,`0`,`0`]}
        >
          <wui-text variant="md-medium" color=${this.error?`error`:`primary`}>
            ${e}
          </wui-text>
          <wui-text align="center" variant="sm-medium" color="secondary">${t}</wui-text>
        </wui-flex>

        ${this.error?this.tryAgainTemplate():null}
      </wui-flex>

      <wui-flex .padding=${[`0`,`5`,`5`,`5`]} justifyContent="center">
        <wui-link @click=${this.onCopyUri} color="secondary">
          <wui-icon size="sm" color="default" slot="iconLeft" name="copy"></wui-icon>
          Copy link
        </wui-link>
      </wui-flex>
    `}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,t.openHref(this.selectedOnRampProvider.url,`popupWindow`,`width=600,height=800,scrollbars=yes`))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?p`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){let e=u.state.themeVariables[`--w3m-border-radius-master`];return p`<wui-loading-thumbnail radius=${(e?parseInt(e.replace(`px`,``),10):4)*9}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url){e.showError(`No link found`),d.goBack();return}try{t.copyToClopboard(this.selectedOnRampProvider.url),e.showSuccess(`Link copied`)}catch{e.showError(`Failed to copy`)}}};F.styles=N,P([g()],F.prototype,`intervalId`,void 0),P([g()],F.prototype,`selectedOnRampProvider`,void 0),P([g()],F.prototype,`uri`,void 0),P([g()],F.prototype,`ready`,void 0),P([g()],F.prototype,`showRetry`,void 0),P([g()],F.prototype,`buffering`,void 0),P([g()],F.prototype,`error`,void 0),P([_({type:Boolean})],F.prototype,`isMobile`,void 0),P([_()],F.prototype,`onRetry`,void 0),F=P([m(`w3m-buy-in-progress-view`)],F);var I=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},L=class extends v{render(){return p`
      <wui-flex
        flexDirection="column"
        .padding=${[`6`,`10`,`5`,`10`]}
        alignItems="center"
        gap="5"
      >
        <wui-visual name="onrampCard"></wui-visual>
        <wui-flex flexDirection="column" gap="2" alignItems="center">
          <wui-text align="center" variant="md-medium" color="primary">
            Quickly and easily buy digital assets!
          </wui-text>
          <wui-text align="center" variant="sm-regular" color="secondary">
            Simply select your preferred onramp provider and add digital assets to your account
            using your credit card or bank transfer
          </wui-text>
        </wui-flex>
        <wui-button @click=${d.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};L=I([m(`w3m-what-is-a-buy-view`)],L);var R=h`
  :host {
    width: 100%;
  }

  wui-loading-spinner {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .currency-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[2]};
    height: 40px;
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[2]}
      ${({spacing:e})=>e[2]} ${({spacing:e})=>e[2]};
    min-width: 95px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    cursor: pointer;
  }

  .currency-container > wui-image {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
`,z=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},B=class extends v{constructor(){super(),this.unsubscribe=[],this.type=`Token`,this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=r.state.currencyImages,this.tokenImages=r.state.tokenImages,this.unsubscribe.push(x.subscribeKey(`purchaseCurrency`,e=>{!e||this.type===`Fiat`||(this.selectedCurrency=this.formatPurchaseCurrency(e))}),x.subscribeKey(`paymentCurrency`,e=>{!e||this.type===`Token`||(this.selectedCurrency=this.formatPaymentCurrency(e))}),x.subscribe(e=>{this.type===`Fiat`?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)}),r.subscribe(e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}}))}firstUpdated(){x.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.selectedCurrency?.symbol||``,t=this.currencyImages[e]||this.tokenImages[e];return p`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?p` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="1"
            @click=${()=>l.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${b(t)}></wui-image>
            <wui-text color="primary">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:p`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};B.styles=R,z([_({type:String})],B.prototype,`type`,void 0),z([_({type:Number})],B.prototype,`value`,void 0),z([g()],B.prototype,`currencies`,void 0),z([g()],B.prototype,`selectedCurrency`,void 0),z([g()],B.prototype,`currencyImages`,void 0),z([g()],B.prototype,`tokenImages`,void 0),B=z([m(`w3m-onramp-input`)],B);var V=h`
  :host > wui-flex {
    width: 100%;
    max-width: 360px;
  }

  :host > wui-flex > wui-flex {
    border-radius: ${({borderRadius:e})=>e[8]};
    width: 100%;
  }

  .amounts-container {
    width: 100%;
  }
`,H=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},U={USD:`$`,EUR:`€`,GBP:`£`},W=[100,250,500,1e3],G=class extends v{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=c.state.activeCaipAddress,this.loading=l.state.loading,this.paymentCurrency=x.state.paymentCurrency,this.paymentAmount=x.state.paymentAmount,this.purchaseAmount=x.state.purchaseAmount,this.quoteLoading=x.state.quotesLoading,this.unsubscribe.push(c.subscribeKey(`activeCaipAddress`,e=>this.caipAddress=e),l.subscribeKey(`loading`,e=>{this.loading=e}),x.subscribe(e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return p`
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center">
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <w3m-onramp-input
            type="Fiat"
            @inputChange=${this.onPaymentAmountChange.bind(this)}
            .value=${this.paymentAmount||0}
          ></w3m-onramp-input>
          <w3m-onramp-input
            type="Token"
            .value=${this.purchaseAmount||0}
            .loading=${this.quoteLoading}
          ></w3m-onramp-input>
          <wui-flex justifyContent="space-evenly" class="amounts-container" gap="2">
            ${W.map(e=>p`<wui-button
                  variant=${this.paymentAmount===e?`accent-secondary`:`neutral-secondary`}
                  size="md"
                  textVariant="md-medium"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${U[this.paymentCurrency?.id||`USD`]} ${e}`}</wui-button
                >`)}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?p`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="accent-primary"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:p`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||l.open({view:`OnRampProviders`})}openModal(){l.open({view:`Connect`})}async onPaymentAmountChange(e){x.setPaymentAmount(Number(e.detail)),await x.getQuote()}async selectPresetAmount(e){x.setPaymentAmount(e),await x.getQuote()}};G.styles=V,H([_({type:Boolean})],G.prototype,`disabled`,void 0),H([g()],G.prototype,`caipAddress`,void 0),H([g()],G.prototype,`loading`,void 0),H([g()],G.prototype,`paymentCurrency`,void 0),H([g()],G.prototype,`paymentAmount`,void 0),H([g()],G.prototype,`purchaseAmount`,void 0),H([g()],G.prototype,`quoteLoading`,void 0),G=H([m(`w3m-onramp-widget`)],G);export{F as W3mBuyInProgressView,k as W3mOnRampProvidersView,w as W3mOnrampFiatSelectView,M as W3mOnrampTokensView,G as W3mOnrampWidget,L as W3mWhatIsABuyView};