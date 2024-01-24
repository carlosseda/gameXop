var y=Object.defineProperty;var w=(h,t,e)=>t in h?y(h,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):h[t]=e;var b=(h,t,e)=>(w(h,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=e(n);fetch(n.href,i)}})();class x extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){sessionStorage.getItem("accessToken")||(window.location.href="/login"),this.render(),window.onpopstate=()=>this.handleRouteChange()}handleRouteChange(){this.render()}render(){const t=window.location.pathname;this.getTemplate(t)}async getTemplate(t){const a={"/admin":"/pages/dashboard.html","/admin/usuarios":"/pages/users.html","/admin/faqs":"/pages/faqs.html"}[t]||"/pages/404.html";await this.loadPage(a)}async loadPage(t){const a=await(await fetch(t)).text();document.startViewTransition(()=>{this.shadowRoot.innerHTML=a,document.documentElement.scrollTop=0})}}customElements.define("page-component",x);class v extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"});const t=document.createElement("link");t.href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",t.rel="stylesheet",document.head.appendChild(t)}}customElements.define("font-loader-component",v);new v;class E extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){}connectedCallback(){this.render()}attributeChangedCallback(t,e,a){}render(){this.shadow.innerHTML=`
      <style>
          h2 {   
              color: hsl(0, 0%, 100%);
              font-family: 'Roboto', sans-serif;
              font-size: 2em;
              font-weight: 600;
              margin: 0;
              text-decoration: none;
          }
      </style>

      <h2>${this.getAttribute("title")}</h2>
      `}}customElements.define("logo-component",E);class L extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"}),document.addEventListener("showOverlayer",this.handleShowOverlayer.bind(this)),document.addEventListener("hideOverlayer",this.handleHideOverlayer.bind(this))}connectedCallback(){this.render()}handleShowOverlayer(t){this.shadow.querySelector(".overlayer").classList.add("active")}handleHideOverlayer(t){this.shadow.querySelector(".overlayer").classList.remove("active")}render(){this.shadow.innerHTML=`
        <style>
            .overlayer {
                background-color: rgba(0, 0, 0, 0.5);
                height: 100%;
                left: 0;
                opacity: 0;
                position: fixed;
                top: 0;
                transition: opacity 0.3s;
                width: 100%;
                z-index: -1;
            }

            .overlayer.active {
                opacity: 1;
                z-index: 1000;
            }
        </style>

        <div class="overlayer"></div>
        `,this.shadow.querySelector(".overlayer").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("hideOverlayer"))})}}customElements.define("overlayer-component",L);class S extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"}),this.menuItems=[]}connectedCallback(){this.loadData().then(()=>this.render())}async loadData(){const t=`http://127.0.0.1:8080/admin/menus/display/${this.getAttribute("menu")}`;try{const a=await(await fetch(t,{headers:{Authorization:"Bearer "+sessionStorage.getItem("accessToken")}})).json();this.menuItems=Object.values(a)}catch(e){console.log(e)}}render(){this.shadow.innerHTML=`
        <style>
            #menu-button{
                cursor:pointer;
                height: 2em;
                margin-left: auto;
                position: relative;
                width: 2em;
                z-index: 1200;
            }
            #menu-button button{
                background: none;
                border: none;
                color: inherit;
                cursor:pointer;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                outline: inherit;
                padding: 0;
            }

            #menu-button button:before, #menu-button button:after,
            #menu-button span:before, #menu-button span:after{
                background-color: hsl(0, 0%, 100%);
                border-radius: 15px;
                content: "";
                display: block;
                height: 0.2em;
                opacity: 1;
                position: absolute;
                transition: ease-in-out all 0.15s;
                width: 100%
            }

            span:before, span:after{
                top: 50%;
                transform: translateY(-50%);
            }

            #menu-button button:before{
                top: 0.5em;
            }

            #menu-button button:after{
                bottom: 0.5em;
            }

            #menu-button.active button:before, #menu-button.active button:after{
                display: none;
            }

            #menu-button.active span:before{
                background-color: hsl(207, 85%, 69%);
                transform: rotate(45deg);
            }

            #menu-button.active span:after{
                background-color: hsl(207, 85%, 69%);
                transform: rotate(-45deg)
            }

            #menu{
                background-color: hsl(0, 0%, 100%);
                height: 100vh;
                left: 0;
                position: fixed;
                transition: opacity 0.4s;
                top: 0;
                opacity: 0;
                padding: 5%;
                width: 100%;
                z-index: -1;
            }

            #menu.active{
                opacity: 1;
                z-index: 1000;
            }

            nav {
                display: flex;
                align-items: center;
                justify-content: left;
            }
              
            nav ul {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column; 
            }
              
            nav ul li {
                position: relative;
                width: max-content;
            }
              
            nav ul li a {
                display: block;
                font-family: 'Roboto', sans-serif;
                font-size: 1.5em;
                padding: 0.5rem;
                text-decoration: none;
                color: hsl(207, 85%, 69%);
            }

            nav ul li a:hover {
                color: hsl(19, 100%, 50%);
            }

            nav ul li .sub-menu {
                display: none;
            }
            
            nav ul li:hover .sub-menu {
                display: block;
            }
              
            nav ul li:hover > .sub-menu {
                visibility: visible;
                animation: slide-in 0.5s ease-in-out; /* animación de apertura */
            }
              
            .sub-menu {
                position: absolute;
                top: 0;
                left: 100%; 
                visibility: hidden;
                animation: slide-out 0.5s ease-in-out;
            }
        </style>

        <div id="menu-button">
            <button>
                <span></span>
            </button>
        </div>

        <div id="menu">
            <nav>
                <ul>
              
                </ul>
            </nav>
        </div>`;const t=this.shadow.querySelector("ul");this.menuItems.forEach(n=>{const i=document.createElement("li"),r=document.createElement("a");n.localeSeo.url&&r.setAttribute("href",`${n.localeSeo.url}`),n.customUrl&&r.setAttribute("href",`${n.customUrl}`),r.textContent=n.name,i.appendChild(r),this.createSubMenu(n,i),t.appendChild(i)}),this.shadow.querySelectorAll("a").forEach(n=>{n.addEventListener("click",i=>{i.preventDefault(),e.classList.toggle("active"),a.classList.toggle("active"),document.dispatchEvent(new CustomEvent("newUrl",{detail:{url:n.getAttribute("href"),title:n.textContent}}))})});const e=this.shadow.querySelector("#menu-button"),a=this.shadow.querySelector("#menu");e.addEventListener("click",n=>{e.classList.toggle("active"),a.classList.toggle("active")})}createSubMenu(t,e){if(t.children){const a=document.createElement("ul");a.classList.add("sub-menu"),e.append(a),Object.values(t.children).forEach(n=>{const i=document.createElement("li"),r=document.createElement("a");r.setAttribute("href",n.customUrl),r.textContent=n.name,i.appendChild(r),a.appendChild(i),this.createSubMenu(n,i)}),e.appendChild(a)}}}customElements.define("menu-component",S);class A extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){this.shadow.innerHTML=`
      <style>
        .crud {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          margin: 0 auto;
          width: 100%;
        }
        
        .crud-table {
          flex: 1;
        }
        
        .crud-form {
          flex: 2;
        }
      </style>

      <div class="crud">
        <div class="crud-table">
          <slot name="filter"></slot>
          <slot name="table"></slot>
        </div>

        <div class="crud-form">
          <slot name="form"></slot>
        </div>
      </div> 
    `}}customElements.define("crud-component",A);class q extends HTMLElement{constructor(){super();b(this,"handleShowElement",e=>{e.detail.url===this.getAttribute("url")&&this.showElement(e.detail.element)});b(this,"handleRefreshForm",e=>{e.detail.subtable===this.getAttribute("subtable")&&this.render()});b(this,"handleShowSubform",e=>{this.parentFormId=e.detail.parentFormId});b(this,"handleAttachImageToForm",e=>{this.attachImageToForm(e.detail.image)});b(this,"render",async()=>{this.shadow.innerHTML=`
        <style>
          .tabs-container-menu{
            background-color: hsl(100, 100%, 100%);
            display: flex;
            height: 2.5em;
            justify-content: space-between;
            width: 100%;
          }
          
          .tabs-container-menu ul{
            height: 2.5em;
            display: flex;
            margin: 0;
            padding: 0;
          }
          
          .tabs-container-menu li{
            color: hsl(236 55% 25%);
            cursor: pointer;
            font-family: 'Lato' , sans-serif;
            list-style: none;
            font-weight: 600;
            padding: 0.5em;
            text-align: center;
          }
          
          .tabs-container-menu li.active,
          .tabs-container-menu li.active:hover{
            background-color: hsl(272 40% 35%);
            color: white;
          }

          .childrens-container.dependant{
            display: none;
          }
          
          .tabs-container-buttons{
            display: flex;
            padding: 0 0.5em;
          }

          .tabs-container-buttons svg{
            cursor: pointer;
            height: 2.5rem;
            width: 2.5rem;
            fill: hsl(236 55% 25%);
          }

          .tabs-container-buttons svg:hover{
            fill: hsl(272 40% 35%);
          }

          .errors-container{
            background-color: hsl(0, 0%, 100%);
            display: none;
            flex-direction: column;
            gap: 1em;
            margin-top: 1em;
            padding: 1em;
          }

          .errors-container.active{
            display: flex;
          }

          .errors-container .error-container{
            width: 100%;
          }

          .errors-container .error-container span{
            color: hsl(0, 0%, 50%);
            font-family: 'Lato' , sans-serif;
            font-size: 1em;
            font-weight: 600;
          }
          
          .tab-panel{
            display: none;
          }
          
          .tab-panel.active{
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            padding: 1em 0;
          }

          .form-element{
            margin-bottom: 1em;
            width: 100%;
          }

          .form-element.full-width {
            flex: 0 0 100%;
          }

          .form-element.half-width {
            flex: 0 0 49%;
          }

          .form-element.one-third-width {
            flex: 0 0 32%;
          }

          .form-element.one-quarter-width {
            flex: 0 0 23.5%;
          }

          .form-element-label{
            display: flex;
            justify-content: space-between;
            margin-bottom: 1em;
            width: 100%;
          }
          
          .form-element-label label,
          .form-element-label span{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1em;
            transition: color 0.5s;
          }

          .form-element-label label.invalid::after{
            content: '*';
            color: hsl(0, 100%, 50%);
            font-size: 1.5em;
            margin-left: 0.2em;
          }

          .form-element-label,
          .form-element-input{
            width: 100%;
          }

          input[type="submit"]{
            background: none;
            color: inherit;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            outline: inherit;
          }
          
          .form-element-input input, 
          .form-element-input textarea,
          .form-element-input select {
            background-color:hsl(226deg 64% 66%);
            border: none;
            border-bottom: 0.1em solid hsl(0, 0%, 100%);
            border-radius: 0;
            box-sizing: border-box;
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-size: 1rem;
            font-weight: 600;
            padding: 0.5em;
            width: 100%;
          }

          .form-element-input input:focus,
          .form-element-input textarea:focus,
          .form-element-input select:focus{
            outline: none;
            border-bottom: 0.1em solid hsl(207, 85%, 69%);
          }

          .form-element-input input.invalid,
          .form-element-input textarea.invalid{
            border-bottom: 0.2em solid hsl(0, 100%, 50%);
          }

          .form-element-input textarea{
            height: 10em;
          }

          .form-element-input .checkbox-container,
          .form-element-input .radio-container{
            display: flex;
            align-items: center;
            gap: 0.5em;
          }

          .form-element-input .checkbox-container input,
          .form-element-input .radio-container input{
            width: 1em;
            height: 1em;
          }

          .form-element-input .checkbox-container label,
          .form-element-input .radio-container label{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1em;
          }

          .form-element-input .range-container{
            display: flex;
            align-items: center;
            gap: 0.5em;
          }

          .form-element-input .range-container input{
            width: 100%;
          }

          .form-element-input .range-container label{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1em;
          }

          .form-element-input .range-container .range-value{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1em;
          }

          .form-element-input .range-container input[type="range"]{
            -webkit-appearance: none;
            width: 100%;
            height: 0.5em;
            border-radius: 0.5em;
            background: hsl(0, 0%, 100%);
            outline: none;
            opacity: 0.7;
            -webkit-transition: .2s;
            transition: opacity .2s;
          }

          .form-element-input input[type="time"]::-webkit-calendar-picker-indicator,
          .form-element-input input[type="date"]::-webkit-calendar-picker-indicator{
            filter: invert(1);
          }

          .childrens-container{
            display: flex;
            justify-content: space-between;
            width: 100%;
          }

          .childrens-container div{
            width: 48%;
          }
        </style>
        
        <form autocomplete="off">
                                
            <input autocomplete="false" name="hidden" type="text" style="display:none;">

            <div class="tabs-container-menu">
                <div class="tabs-container-items">
                   <ul>
                   </ul>
                </div>

                <div class="tabs-container-buttons">
                    <div id="create-button"> 
                        <svg viewBox="0 0 24 24">
                            <path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" />
                        </svg>
                    </div>
                    <div id="store-button"> 
                        <label>
                            <input type="submit" value="">
                            <svg viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path class="crud__create-button-icon" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                            </svg>
                        </label> 
                    </div>
                </div>
            </div>

            <div class="errors-container">

            </div>

            <div class="tabs-container-content"></div>
        </form>
        <div class="childrens-container dependant"></div>
      `;const e=this.shadow.querySelector("form"),a=this.shadow.querySelector(".tabs-container-items ul"),n=this.shadow.querySelector(".tabs-container-content");for(const i in this.structure.tabs){const r=this.structure.tabs[i].name,m=document.createElement("li");m.classList.add("tab-item"),m.dataset.tab=i,m.innerHTML=this.structure.tabs[i].label,a.append(m);const d=document.createElement("div");d.dataset.tab=i,d.classList.add("tab-panel"),n.append(d);for(const c in this.structure.inputs[r].noLocale){const o=this.structure.inputs[r].noLocale[c],g=document.createElement("div");if(g.classList.add("form-element",o.width||"full-width"),o.label){const s=document.createElement("div");g.append(s),s.classList.add("form-element-label");const l=document.createElement("label");l.innerText=o.label,l.setAttribute("for",o.name),s.append(l)}const u=document.createElement("div");if(g.append(u),u.classList.add("form-element-input"),o.element==="input")switch(o.type){case"hidden":{const s=document.createElement("input");s.type=o.type,s.name=o.name,s.value=o.value||"",e.append(s);continue}case"checkbox":case"radio":{const s=document.createElement("div");s.classList.add(`${o.type}-container`),o.options.forEach(l=>{const p=document.createElement("input"),f=document.createElement("label");f.innerText=l.label,p.id=o.name,p.type=o.type,p.name=o.name,p.value=l.value||"",p.checked=l.checked||!1,p.disabled=l.disabled||!1,s.append(f),s.append(p)}),u.append(s);break}case"range":{const s=document.createElement("div");s.classList.add("range-container");const l=document.createElement("input");l.id=o.name,l.type=o.type,l.name=o.name,l.min=o.min||"",l.max=o.max||"",l.step=o.step||"",l.value=o.value||"",s.append(l);const p=document.createElement("span");p.classList.add("range-value"),p.innerText=o.value,s.append(p),l.addEventListener("input",()=>{p.innerText=l.value}),u.append(s);break}case"number":case"date":case"time":case"datetime-local":case"month":case"week":{const s=document.createElement("input");s.id=o.name,s.type=o.type,s.name=o.name,s.min=o.min||"",s.max=o.max||"",s.step=o.step||"",s.placeholder=o.placeholder||"",s.value=o.value||"",s.readOnly=o.readOnly||!1,s.dataset.validate=o.validate||"",u.append(s);break}case"file":{if(!this.shadow.querySelector("image-gallery-component")){const l=document.createElement("image-gallery-component");this.shadow.append(l)}const s=document.createElement("upload-image-button-component");s.id=o.name,s.setAttribute("name",o.name),s.setAttribute("languageAlias","es"),s.setAttribute("quantity",o.quantity),u.append(s);break}default:{const s=document.createElement("input");if(s.id=o.name,s.type=o.type,s.name=o.name,s.value=o.value||"",s.placeholder=o.placeholder||"",s.dataset.validate=o.validate||"",o.maxLength){s.maxLength=o.maxLength||"";const l=document.createElement("span");formElementLabel.append(l),s.addEventListener("input",()=>{s.value.length>0?l.textContent=s.value.length+" / "+s.maxLength:l.textContent=""})}u.append(s);break}}if(o.element==="textarea"){const s=document.createElement("textarea");if(s.id=c,s.name=c,s.disabled=o.disabled||!1,s.readOnly=o.readOnly||!1,s.value=o.value||"",s.cols=o.cols||"",s.rows=o.rows||"",s.wrap=o.wrap||"",s.placeholder=o.placeholder||"",s.dataset.validate=o.validate||"",o.maxLength){s.maxLength=o.maxLength||"";const l=document.createElement("span");formElementLabel.append(l),s.addEventListener("input",()=>{s.value.length>0?l.textContent=s.value.length+" / "+s.maxLength:l.textContent=""})}u.append(s)}if(o.element==="select"){const s=document.createElement("select");s.id=c,s.name=c,s.disabled=o.disabled||!1,s.required=o.required||!1,s.multiple=o.multiple||!1,o.options.forEach(l=>{const p=document.createElement("option");p.value=l.value,p.innerText=l.label,s.append(p)}),u.append(s)}if(o.element==="subform"){const s=document.createElement("div");s.classList.add("subform-container");const l=document.createElement("form-component");l.setAttribute("subform",o.name),l.setAttribute("url",o.url),s.append(l),this.shadow.querySelector(".childrens-container").append(s)}if(o.element==="subtable"){const s=document.createElement("div");s.classList.add("subtable-container");const l=document.createElement("table-component");l.setAttribute("subtable",o.name),l.setAttribute("url",o.url),s.append(l),this.shadow.querySelector(".childrens-container").append(s)}d.append(g)}}this.renderTabs(),this.renderSubmitForm(),this.renderCreateForm()});b(this,"renderTabs",()=>{this.shadow.querySelector(".tab-item").classList.add("active"),this.shadow.querySelector(".tab-panel").classList.add("active");const e=this.shadow.querySelector(".tabs-container-items ul"),a=this.shadow.querySelector(".tabs-container-content");this.shadow.querySelectorAll(".tab-item").forEach(i=>{i.addEventListener("click",()=>{e.querySelector(".active").classList.remove("active"),a.querySelector(".active").classList.remove("active"),i.classList.add("active"),a.querySelector(`[data-tab="${i.dataset.tab}"]`).classList.add("active")})})});b(this,"renderSubmitForm",()=>{this.shadow.querySelector("#store-button").addEventListener("click",async e=>{e.preventDefault();const a=this.shadow.querySelector("form");if(!this.validateForm(a.elements))return;const n=new FormData(a);this.shadow.querySelectorAll('input[type="checkbox"]').length>0&&this.shadow.querySelectorAll('input[type="checkbox"]').forEach(d=>{const c=[];this.shadow.querySelectorAll(`input[name="${d.name}"]:checked`).forEach(o=>{c.push(o.value)}),n.append(d.name,c)}),this.parentFormId&&n.append("parentFormId",this.parentFormId);const i=Object.fromEntries(n.entries()),r=i.id?`http://127.0.0.1:8080${this.getAttribute("url")}/${i.id}`:`http://127.0.0.1:8080${this.getAttribute("url")}`,m=i.id?"PUT":"POST";delete i.id,this.images&&(i.images=this.images);try{const d=await fetch(r,{method:m,headers:{"Content-Type":"application/json",Authorization:"Bearer "+sessionStorage.getItem("accessToken")},body:JSON.stringify(i)});if(d.status===500)throw d;if(d.status===200){const c=await d.json();document.dispatchEvent(new CustomEvent("message",{detail:{message:"Datos guardados correctamente",type:"success"}})),this.images=[],this.render(),document.dispatchEvent(new CustomEvent("refreshTable",{detail:{subtable:this.getAttribute("subtable")?this.getAttribute("subtable"):null,url:this.getAttribute("url"),data:c.rows?c.rows:null}}))}}catch(d){const c=await d.json();c.errors&&(c.errors.forEach(o=>{const g=document.createElement("div"),u=document.createElement("span");g.classList.add("error-container"),u.textContent=o.message,g.append(u),this.shadow.querySelector(".errors-container").append(g),this.shadow.querySelector(".errors-container").classList.add("active")}),document.dispatchEvent(new CustomEvent("message",{composed:!0,detail:{message:"Fallo al guardar los datos",type:"error"}}))),c.message&&document.dispatchEvent(new CustomEvent("message",{detail:{message:c.message||"Fallo al guardar los datos",type:"error"}}))}})});b(this,"renderCreateForm",()=>{this.shadow.querySelector("#create-button").addEventListener("click",()=>{this.images=[],this.render()})});b(this,"validateForm",e=>{let a=!0;const n={required:{regex:/\S/g,message:"El campo es obligatorio"},onlyLetters:{regex:/^[a-zA-Z\s]+$/g,message:"El campo sólo puede contener letras"},onlyNumbers:{regex:/\d/g,message:"El campo sólo puede contener números"},telephone:{regex:/^\d{9}$/g,message:"El campo debe contener 9 números"},email:{regex:/\w+@\w+\.\w+/g,message:"El campo debe contener un email válido"},password:{regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g,message:"El campo debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número"},date:{regex:/^\d{4}-\d{2}-\d{2}$/g,message:"El campo debe contener una fecha válida"},time:{regex:/^\d{2}:\d{2}$/g,message:"El campo debe contener una hora válida"},datetime:{regex:/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/g,message:"El campo debe contener una fecha y hora válida"},dni:{regex:/^\d{8}[a-zA-Z]$/g,message:"El campo debe contener un DNI válido"},nif:{regex:/^[a-zA-Z]\d{7}[a-zA-Z]$/g,message:"El campo debe contener un NIF válido"},cif:{regex:/^[a-zA-Z]\d{7}[a-zA-Z0-9]$/g,message:"El campo debe contener un CIF válido"},postalCode:{regex:/^\d{5}$/g,message:"El campo debe contener un código postal válido"},creditCard:{regex:/^\d{16}$/g,message:"El campo debe contener una tarjeta de crédito válida"},iban:{regex:/^[a-zA-Z]{2}\d{22}$/g,message:"El campo debe contener un IBAN válido"},url:{regex:/^(http|https):\/\/\w+\.\w+/g,message:"El campo debe contener una URL válida"},ip:{regex:/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/g,message:"El campo debe contener una IP válida"},mac:{regex:/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/g,message:"El campo debe contener una MAC válida"},image:{regex:/\.(gif|jpg|jpeg|tiff|png)$/g,message:"El campo debe contener una imagen válida"},video:{regex:/\.(avi|mp4|mov|wmv|flv|mkv)$/g,message:"El campo debe contener un vídeo válido"},audio:{regex:/\.(mp3|wav|ogg|flac|aac)$/g,message:"El campo debe contener un audio válido"},pdf:{regex:/\.(pdf)$/g,message:"El campo debe contener un PDF válido"},doc:{regex:/\.(doc|docx)$/g,message:"El campo debe contener un documento válido"},xls:{regex:/\.(xls|xlsx)$/g,message:"El campo debe contener una hoja de cálculo válida"},ppt:{regex:/\.(ppt|pptx)$/g,message:"El campo debe contener una presentación válida"},zip:{regex:/\.(zip|rar|7z|tar|gz)$/g,message:"El campo debe contener un archivo comprimido válido"}};for(let i=0;i<e.length;i++)e[i].dataset.validate&&e[i].dataset.validate.split(",").forEach(r=>{if(e[i].value.match(n[r].regex)==null){if(!e[i].classList.contains("invalid")){e[i].classList.add("invalid"),e[i].closest(".form-element").querySelector("label").classList.add("invalid");const m=document.createElement("div"),d=document.createElement("span");m.classList.add("error-container"),d.textContent=`${e[i].closest(".form-element").querySelector("label").textContent}: ${n[r].message}`,m.append(d),this.shadow.querySelector(".errors-container").append(m)}a=!1}else e[i].classList.remove("invalid"),e[i].closest(".form-element").querySelector("label").classList.remove("invalid")});return a||(this.shadow.querySelector(".errors-container").classList.add("active"),document.dispatchEvent(new CustomEvent("message",{detail:{message:"Los datos del formulario no son válidos",type:"error"}}))),a});b(this,"showElement",e=>{this.render(),this.images=[],this.shadow.querySelectorAll(".dependant").forEach(a=>a.classList.remove("dependant")),Object.entries(e).forEach(([a,n])=>{Array.isArray(n)&&(document.dispatchEvent(new CustomEvent("showSubtable",{detail:{subtable:a,data:n}})),document.dispatchEvent(new CustomEvent("showSubform",{detail:{parentFormId:e.id}}))),this.shadow.querySelector(`[name="${a}"]`)&&(typeof n=="object"&&(n=JSON.stringify(n,null,2)),this.shadow.querySelector(`[name="${a}"]`).value=n,this.shadow.querySelector(`[name="${a}"]`).tagName==="SELECT"&&this.shadow.querySelector(`[name="${a}"]`).querySelectorAll("option").forEach(r=>{r.value===n&&r.setAttribute("selected",!0)}),this.shadow.querySelector(`[name="${a}"]`).type==="radio"&&this.shadow.querySelector(`[name="${a}"]`).closest(".form-element").querySelectorAll('input[type="radio"]').forEach(r=>{r.value===n&&r.setAttribute("checked",!0)}),this.shadow.querySelector(`[name="${a}"]`).type==="checkbox"&&this.shadow.querySelectorAll(`[name="${a}"]`).forEach(r=>{r.value===n&&r.setAttribute("checked",!0)})),a==="images"&&document.dispatchEvent(new CustomEvent("showThumbnails",{detail:{images:n}}))})});b(this,"attachImageToForm",async e=>{const a=this.images.findIndex(n=>n.filename===e.previousImage&&n.languageAlias===e.languageAlias&&n.name===e.name);a===-1?this.images.push(e):(e.delete&&e.create&&this.images.splice(a,1),e.update&&e.create?(this.images.splice(a,1),this.images[a]=e,delete e.update):(this.images.splice(a,1),this.images[a]=e))});this.shadow=this.attachShadow({mode:"open"}),this.eventsAdded=new Set,this.images=[],this.structure=JSON.parse(this.getAttribute("structure").replaceAll("'",'"'))}connectedCallback(){this.eventsAdded.has("showElement")||(document.addEventListener("showElement",this.handleShowElement.bind(this)),this.eventsAdded.add("showElement")),this.eventsAdded.has("refreshForm")||(document.addEventListener("refreshForm",this.handleRefreshForm.bind(this)),this.eventsAdded.add("refreshForm")),this.eventsAdded.has("showSubform")||(document.addEventListener("showSubform",this.handleShowSubform.bind(this)),this.eventsAdded.add("showSubform")),this.eventsAdded.has("attachImageToForm")||(document.addEventListener("attachImageToForm",this.handleAttachImageToForm.bind(this)),this.eventsAdded.add("attachImageToForm")),this.render()}}customElements.define("form-component",q);class k extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"}),this.eventsAdded=new Set,this.data=[],this.structure=JSON.parse(this.getAttribute("structure").replaceAll("'",'"')),this.eventsAdded.has("refreshTable")||(document.addEventListener("refreshTable",this.handleRefreshTable.bind(this)),this.eventsAdded.add("refreshTable")),this.eventsAdded.has("newFilter")||(document.addEventListener("newFilter",this.handleNewFilter.bind(this)),this.eventsAdded.add("newFilter")),this.eventsAdded.has("showSubtable")||(document.addEventListener("showSubtable",this.handleShowSubtable.bind(this)),this.eventsAdded.add("showSubtable"))}async connectedCallback(){this.loadData().then(()=>this.render())}async handleRefreshTable(t){t.detail.url===this.getAttribute("url")&&this.loadData(t.detail.data).then(()=>this.render())}async handleNewFilter(t){t.detail.url===this.getAttribute("url")&&(this.data=t.detail.rows,this.total=t.detail.total,this.currentPage=t.detail.currentPage,this.lastPage=t.detail.lastPage,this.queryString=t.detail.queryString,this.render())}async handleShowSubtable(t){t.detail.subtable===this.getAttribute("subtable")&&(this.tableStructure=await this.setTableStructure(),this.loadData(t.detail.data).then(()=>this.render()))}async loadData(t=null){if(t){this.data=t;return}const e=`http://127.0.0.1:8080${this.getAttribute("url")}`;try{const a=await fetch(e,{headers:{Authorization:"Bearer "+sessionStorage.getItem("accessToken")}});if(a.status===200){const n=await a.json();this.data=n.rows,this.total=n.meta.total,this.currentPage=n.meta.currentPage,this.lastPage=n.meta.pages}else if(a.status===500)throw a}catch(a){console.log(a)}}async render(){if(this.shadow.innerHTML=`
      <style>

        button {
          background-color: transparent;
          border: none;
          cursor: pointer;
        }

        .table {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 1.5rem;
        }

        .table-buttons {
          background-color: hsl(0, 0%, 100%);
          box-shadow: 5px 10px 19px -7px rgba(0,0,0,0.75);
          display: flex;
          padding: 0 0.5rem;
        }

        .table-button{
          align-items: center;
          display: flex;
          padding: 0.2rem;
        }

        .table-button svg {
          width: 1.7rem;
        }

        .table-button svg path {
          fill: hsl(236 55% 25%);
        }

        .table-button:hover svg path {
          fill: hsl(272 40% 35%);
        }

        .table-records{
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 1rem;
          min-height: 70vh;
          max-height: 70vh;
          padding: 1rem 10%;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .table-records::-webkit-scrollbar{
          width: 0.7rem; 
        }

        .table-records::-webkit-scrollbar-thumb{
          background-color: $secondary-color;
        }

        .table-records::-webkit-scrollbar-thumb:hover{
          background-color: $hover-color;
        }

        .table-record-buttons {
          background-color: hsl(0, 0%, 100%);
          display: flex;
          justify-content: flex-end;
        }

        .table-record-buttons button svg{
          width: 2rem;
        }

        .table-record-buttons svg path{
          fill: hsl(236 55% 25%);
        }

        .table-record-buttons button:hover svg path{
          fill: hsl(272 40% 35%);
        }

        .table-no-records {
          background-color: hsl(272 40% 35%);
          padding: 0.5rem;
        }

        .table-no-records p {
          color: hsl(0, 0%, 100%);
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          margin: 0;
          text-align: center;
        }

        .table-data{
          background-color: hsl(0, 0%, 0%);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0.5rem;
        }

        .table-data li{
          color: hsl(0, 0%, 100%);
          font-family: 'Lato', sans-serif;
          font-weight: 400;
        }

        .table-data li span {   
          color: hsl(0, 0%, 100%);
          font-family: 'Lato', sans-serif;  
          font-weight: 400;
        }

        .table-data li span::after {
          content: ":";
          margin-right: 0.5rem;
        }

        .table-pagination{
          background-color: hsl(0, 0%, 100%);
          box-shadow: 5px 10px 19px -7px rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }

        .table-pagination-info{
          display: flex;
          justify-content: space-between;
        }

        .table-pagination-info span{
          color: hsl(0, 0%, 0%);
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }

        .table-pagination-pages{
          display: flex;
          gap: 0.5rem;
        }

        .table-pagination-page button{
          color: $secondary-color;
          font-family: sans-serif;
          font-weight: 700;
        }

        .table-pagination-page.active button{
          color: $hover-color;
        }

        .table-pagination-page:hover button{
          color: $hover-color;
        }

        .table-pagination-page.inactive button{
          color: hsl(0, 0%, 69%);
          cursor: not-allowed;
        }


      </style>

      <section class="table-buttons"></section>
      <div class="table"></div>
    `,this.structure.tableButtons){const t=this.shadow.querySelector(".table-buttons");Object.keys(this.structure.tableButtons).forEach(e=>{const a=document.createElement("button");a.classList.add("table-button"),console.log(this.structure.tableButtons[e]),this.structure.tableButtons[e]==="filterButton"&&(a.classList.add("table-filter-button"),a.innerHTML=`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" /></svg>
          `),t.appendChild(a)})}this.getAttribute("subtable")||(this.shadow.innerHTML+=`
        <div class="table-pagination">
          <div class="table-pagination-info">
            <div class="table-pagination-total">      
              <span>${this.total} registro en total</span>
            </div>
            <div class="table-pagination-pages">
              <div class="table-pagination-page" data-pagination="">
                <button><<</button>
              </div>

              <div class="table-pagination-page active" data-pagination="">
                <button>1</button>
              </div>

              <div class="table-pagination-ellipsis">
                <span>...</span>
              </div>

              <div class="table-pagination-page active">
                <button>3</button>
              </div>

              <div class="table-pagination-ellipsis">
                <span>...</span>
              </div>

              <div class="table-pagination-page">
                <button>5</button>
              </div>

              <div class="table-pagination-page" data-pagination="">
                <button>>></button>
              </div>
            </div>
          </div>
        </div>
      `),await this.getTableData(),await this.renderTableButtons(),await this.renderPaginationButtons()}async getTableData(){const t=this.shadow.querySelector(".table"),e=document.createElement("div");if(e.classList.add("table-records"),t.appendChild(e),this.data.length===0){const a=document.createElement("div");a.classList.add("table-no-records");const n=document.createElement("p");n.innerHTML="No hay registros",a.appendChild(n),e.appendChild(a);return}this.data.forEach(a=>{const n=document.createElement("div");n.classList.add("table-row");const i=document.createElement("div");i.classList.add("table-record-buttons"),n.appendChild(i);const r=document.createElement("ul");r.classList.add("table-data"),n.appendChild(r);const m=this.structure.headers,d=this.structure.recordButtons;Object.keys(m).forEach(c=>{const o=document.createElement("li"),g=document.createElement("span");g.classList.add("table-data-header"),g.innerHTML=m[c].label,o.appendChild(g),a[m[c].field]&&(o.innerHTML+=a[m[c].field]),r.appendChild(o)}),Object.keys(d).forEach(c=>{const o=document.createElement("button");o.classList.add("table-button"),d[c]==="edit"&&(o.classList.add("edit-button"),o.dataset.id=a.id,o.innerHTML=`
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                        </svg>`),d[c]==="remove"&&(o.classList.add("remove-button"),o.dataset.id=a.id,o.innerHTML=`
                        <svg viewBox="0 0 24 24">
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>`),i.appendChild(o)}),e.appendChild(n)})}async renderTableButtons(){const t=this.shadow.querySelectorAll(".edit-button"),e=this.shadow.querySelectorAll(".remove-button");t.forEach(a=>{a.addEventListener("click",async()=>{const n="http://127.0.0.1:8080"+this.getAttribute("url")+"/"+a.dataset.id;try{const i=await fetch(n,{method:"GET",headers:{Authorization:"Bearer "+sessionStorage.getItem("accessToken")}});if(i.status===500||i.status===404)throw i;if(i.status===200){const r=await i.json();document.dispatchEvent(new CustomEvent("showElement",{detail:{url:this.getAttribute("url"),element:r}}))}}catch(i){const r=await i.json();document.dispatchEvent(new CustomEvent("message",{detail:{message:r.message||"Fallo al cargar el elemento",type:"error"}}))}})}),e.forEach(a=>{a.addEventListener("click",()=>{const n="http://127.0.0.1:8080"+this.getAttribute("url")+"/"+a.dataset.id;document.dispatchEvent(new CustomEvent("showOverlayer")),document.dispatchEvent(new CustomEvent("showDeleteModal",{detail:{endPoint:n,url:this.getAttribute("url"),subtable:this.getAttribute("subtable")?this.getAttribute("subtable"):null}}))})})}async renderPaginationButtons(){this.shadow.querySelectorAll(".table-pagination-button").forEach(e=>{e.addEventListener("click",async()=>{let a;switch(e.id){case"firstPageUrl":a=1;break;case"previousPageUrl":if(this.currentPage===1)return;a=parseInt(this.currentPage)-1;break;case"nextPageUrl":if(this.currentPage===this.lastPage)return;a=parseInt(this.currentPage)+1;break;case"lastPageUrl":a=this.lastPage;break}const n=this.queryString?`http://127.0.0.1:8080${this.getAttribute("url")}?page=${a}&${this.queryString}`:`http://127.0.0.1:8080${this.getAttribute("url")}?page=${a}`;try{const i=await fetch(n,{headers:{Authorization:"Bearer "+sessionStorage.getItem("accessToken")}});if(i.status===500)throw i;if(i.status===200){const r=await i.json();this.data=r.rows,this.total=r.meta.total,this.currentPage=r.meta.currentPage,this.lastPage=r.meta.pages,this.render()}}catch(i){const r=await i.json();document.dispatchEvent(new CustomEvent("message",{detail:{message:r.message||"Fallo al cargar los datos",type:"error"}}))}})})}}customElements.define("table-component",k);class T extends HTMLElement{constructor(){super();b(this,"renderTabs",()=>{const e=this.shadow.querySelector(".tabs-container-items ul"),a=this.shadow.querySelector(".tabs-container-content");this.shadow.querySelectorAll(".tab-item").forEach(i=>{i.addEventListener("click",()=>{e.querySelector(".active").classList.remove("active"),a.querySelector(".active").classList.remove("active"),i.classList.add("active"),a.querySelector(`[data-tab="${i.dataset.tab}"]`).classList.add("active")})})});this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){this.shadow.innerHTML=`
      <style>
        .table-filter{
          height: max-content;
          margin-bottom: 2em;
          position: relative;
          width: 100%;
        }

        .table-filter.active .table-filter-container{
          max-height: 70vh;
        }

        .table-filter-container{
          max-height: 0;
          margin: 0 auto;
          overflow: hidden;
          transition: max-height 0.5s;
          width: 100%;
        }

        .table-filter-container form{
          background-color: transparent;
        }

        .table-filter-buttons{
          width: 100%;
        }

        .table-filter-buttons .table-filter-button{
          cursor: pointer;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s;
          width: 100%;
          text-align: center;
        }

        .table-filter-buttons .table-filter-button:hover{
          svg path{
              fill: hsl(19, 100%, 50%);
          }
        }

        .table-filter-buttons .table-filter-button.active{
          max-height: 2.5rem;
        }

        .table-filter-buttons .table-filter-button.open-filter{
          background-color: hsl(0, 0%, 100%);
        }

        .table-filter-buttons .table-filter-button.apply-filter{
          background-color: hsl(160, 51%, 33%);
        }

        .table-filter-buttons .table-filter-button svg{
          height: 1.5em;
          padding: 0.5em;
          width: 1.5em;
        }

        .table-filter-buttons .table-filter-button.open-filter svg path{
          fill: hsl(207, 85%, 69%);
        }

        .table-filter-buttons .table-filter-button.open-filter svg:hover path{
          fill: hsl(19, 100%, 50%);
        }

        .table-filter-buttons .table-filter-button.apply-filter svg path{
          fill: hsl(0, 0%, 100%);
        }

        .table-filter-buttons .table-filter-button.apply-filter svg:hover path{
          fill: hsl(19, 100%, 50%);
        }

        .tabs-container-menu{
          background-color: hsl(100, 100%, 100%);
          display: flex;
          height: 2.5em;
          justify-content: space-between;
          width: 100%;
        }
        
        .tabs-container-menu ul{
          height: 2.5em;
          display: flex;
          margin: 0;
          padding: 0;
        }
        
        .tabs-container-menu li{
            color: hsl(0, 0%, 50%);
            cursor: pointer;
            font-family: 'Roboto' , sans-serif;
            list-style: none;
            font-weight: 600;
            padding: 0.5em;
            text-align: center;
        }
        
        .tabs-container-menu li.active,
        .tabs-container-menu li.active:hover{
            background-color:hsl(207, 85%, 69%);
            color: white;
        }
        
        .tabs-container-buttons{
            display: flex;
            padding: 0 0.5em;
        }

        .tabs-container-buttons svg{
            cursor: pointer;
            height: 2.5rem;
            width: 2.5rem;
            fill: hsl(207, 85%, 69%);
        }

        .tabs-container-buttons svg:hover{
            fill: hsl(19, 100%, 50%);
        }

        .errors-container{
            background-color: hsl(0, 0%, 100%);
            display: none;
            flex-direction: column;
            gap: 1em;
            margin-top: 1em;
            padding: 1em;
        }

        .errors-container.active{
            display: flex;
        }

        .errors-container .error-container{
            width: 100%;
        }

        .errors-container .error-container span{
            color: hsl(0, 0%, 50%);
            font-family: 'Ubuntu';
            font-size: 0.8em;
            font-weight: 600;
        }
        
        .tab-panel{
            display: none;
        }
        
        .tab-panel.active{
            display: block;
            padding: 0.5em 0;
        }
        
        .row {
            display: flex;
            justify-content: space-between;
            gap: 2em;
        }

        .form-element{
            margin: 1em 0;
            width: 100%;
        }
        
        .form-element-label{
            display: flex;
            justify-content: space-between;
            margin-bottom: 1em;
            width: 100%;
        }
        
        .form-element-label label,
        .form-element-label span{
            color: hsl(0, 0%, 100%);
            font-family: 'Roboto', sans-serif;
            font-weight: 600;
            font-size: 1em;
            transition: color 0.5s;
        }

        .form-element-label label.invalid{
            color: hsl(351deg 88% 64%);
        }

        .form-element-label,
        .form-element-input{
            width: 100%;
        }

        input[type="submit"]{
            background: none;
            color: inherit;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            outline: inherit;
        }
        
        .form-element-input input, 
        .form-element-input textarea,
        .form-element-input select {
            background-color:hsl(226deg 64% 66%);
            border: none;
            border-bottom: 0.1em solid  hsl(0, 0%, 100%);
            box-sizing: border-box;
            color: hsl(0, 0%, 100%);
            font-family: 'Roboto', sans-serif;
            font-weight: 600;
            padding: 0.5em;
            width: 100%;
        }

        .form-element-input input:focus,
        .form-element-input textarea:focus,
        .form-element-input select:focus{
            outline: none;
            border-bottom: 0.1em solid hsl(207, 85%, 69%);
        }

        .form-element-input input.invalid,
        .form-element-input textarea.invalid{
            border-bottom: 0.1em solid hsl(0, 100%, 50%);
        }

        .form-element-input textarea{
            height: 10em;
        }

        .form-element-input .checkbox-container,
        .form-element-input .radio-container{
            display: flex;
            align-items: center;
            gap: 0.5em;
        }

        .form-element-input .checkbox-container input,
        .form-element-input .radio-container input{
            width: 1em;
            height: 1em;
        }

        .form-element-input .checkbox-container label,
        .form-element-input .radio-container label{
            color: hsl(0, 0%, 100%);
            font-family: 'Roboto', sans-serif;
            font-weight: 600;
            font-size: 1em;
        }

        .form-element-input .range-container{
            display: flex;
            align-items: center;
            gap: 0.5em;
        }

        .form-element-input .range-container input{
            width: 100%;
        }

        .form-element-input .range-container label{
            color: hsl(0, 0%, 100%);
            font-family: 'Roboto', sans-serif;
            font-weight: 600;
            font-size: 1em;
        }

        .form-element-input .range-container .range-value{
            color: hsl(0, 0%, 100%);
            font-family: 'Roboto', sans-serif;
            font-weight: 600;
            font-size: 1em;
        }

        .form-element-input .range-container input[type="range"]{
            -webkit-appearance: none;
            width: 100%;
            height: 0.5em;
            border-radius: 0.5em;
            background: hsl(0, 0%, 100%);
            outline: none;
            opacity: 0.7;
            -webkit-transition: .2s;
            transition: opacity .2s;
        }

        .form-element-input input[type="time"]::-webkit-calendar-picker-indicator,
        .form-element-input input[type="date"]::-webkit-calendar-picker-indicator{
            filter: invert(1);
        }
    </style>
      
    <div class="table-filter" id="table-filter">
        <div class="table-filter-container">
            <form autocomplete="off">
                                    
                <input autocomplete="false" name="hidden" type="text" style="display:none;">

                <div class="tabs-container-menu">
                    <div class="tabs-container-items">
                        <ul></ul>
                    </div>
                </div>

                <div class="tabs-container-content"></div>
            </form>
        </div>
    </div>`,this.shadow.querySelector(".tabs-container-items ul"),this.shadow.querySelector(".tabs-container-content"),JSON.parse(this.getAttribute("tabs").replaceAll("'",'"')),this.renderTabs(),this.renderButtons()}renderButtons(){const e=this.shadow.getElementById("open-filter"),a=this.shadow.getElementById("apply-filter"),n=this.shadow.getElementById("table-filter");e.addEventListener("click",()=>{e.classList.remove("active"),a.classList.add("active"),n.classList.add("active")}),a.addEventListener("click",async()=>{const i=this.shadow.querySelector("form"),r=new FormData(i),m=Object.fromEntries(r.entries()),d=new URLSearchParams(r).toString(),c=m.prompt?"POST":"GET",o=m.prompt?`http://127.0.0.1:8080${this.getAttribute("url")}/openai-filter`:`http://127.0.0.1:8080${this.getAttribute("url")}?${d}`,g={method:c,headers:{"Content-Type":"application/json",Authorization:"Bearer "+sessionStorage.getItem("accessToken")}};c==="POST"&&(g.body=JSON.stringify(m));try{const u=await fetch(o,g);if(u.status===500)throw await u.json();u.status===200&&(this.data=await u.json(),e.classList.add("active"),a.classList.remove("active"),n.classList.remove("active"),i.reset(),document.dispatchEvent(new CustomEvent("newFilter",{detail:{url:this.getAttribute("url"),queryString:d,rows:this.data.rows,total:this.data.meta.total,currentPage:this.data.meta.currentPage,lastPage:this.data.meta.pages}})))}catch(u){document.dispatchEvent(new CustomEvent("message",{detail:{message:u.message||"Fallo al filtrar los datos",type:"error"}}))}})}}customElements.define("table-filter",T);class C extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"}),document.addEventListener("message",this.handleMessage.bind(this))}static get observedAttributes(){return["message","type"]}connectedCallback(){this.render()}attributeChangedCallback(t,e,a){if(t==="message"){const n=this.shadow.querySelector("#alert-message");n.classList.add("active"),this.shadow.querySelector("p").textContent=a,setTimeout(function(){n.classList.remove("active")},7e3)}t==="type"&&this.shadow.querySelector("#alert-message").classList.add(a)}handleMessage(t){this.setAttribute("message",t.detail.message),this.setAttribute("type",t.detail.type)}render(){this.shadow.innerHTML=`
        <style>
            #alert-message{
                background-color: hsl(0, 0%, 100%);
                bottom: 3vh;
                opacity: 0;
                padding: 0 1em;
                position: fixed;
                transition: opacity 0.3s;
                right: 5%;
                width: max-content;
                z-index: -1;
            }

            #alert-message.success{
                border-bottom: 0.2em solid hsl(207, 85%, 69%);
            }

            #alert-message.error{
                border-bottom: 0.2em solid hsl(0, 100%, 50%);
            }

            #alert-message.active{
                opacity: 1;
                z-index: 1;
            }

            p{
                font-family: 'Roboto', sans-serif;
                font-size: 1.2em;
            }
        </style>

        <div id="alert-message">
            <p></p>
            <div id="alert-color"></div>
        </div>`}}customElements.define("alert-message-component",C);class $ extends HTMLElement{constructor(){super();b(this,"handleShowThumbnails",e=>{this.showThumbnails(e.detail.images)});b(this,"handleCreateThumbnail",e=>{e.detail.image.name===this.getAttribute("name")&&e.detail.image.languageAlias===this.getAttribute("languageAlias")&&this.createThumbnail(e.detail.image)});b(this,"handleUpdateThumbnail",e=>{e.detail.image.name===this.getAttribute("name")&&e.detail.image.languageAlias===this.getAttribute("languageAlias")&&this.updateThumbnail(e.detail.image,e.detail.previousImage)});b(this,"handleDeleteThumbnails",e=>{this.deleteThumbnails()});this.shadow=this.attachShadow({mode:"open"}),this.name=this.getAttribute("name"),this.languageAlias=this.getAttribute("languageAlias")||"es",this.quantity=this.getAttribute("quantity")||"single",document.addEventListener("showThumbnails",this.handleShowThumbnails.bind(this)),document.addEventListener("createThumbnail",this.handleCreateThumbnail.bind(this)),document.addEventListener("updateThumbnail",this.handleUpdateThumbnail.bind(this)),document.addEventListener("deleteThumbnails",this.handleDeleteThumbnails.bind(this))}connectedCallback(){this.render()}render(){this.shadow.innerHTML=`
        <style>
            .square-button {
                width: 135px;
                height: 135px;
                border: none;
                background-color: hsl(207, 85%, 69%);
                color: white;
                text-align: center;
                display: inline-block;
                font-size: 16px;
                cursor: pointer;
            }

            .square-button:hover {
                border: 0.2rem solid hsl(19, 100%, 50%);
                cursor: pointer;
            }
          
            .icon {
                fill: white;
                width: 24px;
                height: 24px;
            }

            .upload-image-container {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                justify-content: left;
            }

            .upload-image{
                background-color: hsl(100, 100%, 100%);
                cursor: pointer;
                height: 135px;
                position: relative;
                width: 135px;
            }

            .upload-image-overlay {
                background-color: hsla(0, 0%, 0%, 0.5);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 2000;
            }

            .upload-image:hover .upload-image-overlay {
                opacity: 1;
            }

            .delete-button {
                position: absolute;
                top: 0.2rem;
                right: 0.2rem;
                background-color: hsl(0, 100%, 50%);
                color: white;
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 2001;
            }

            .upload-image:hover .delete-button {
                opacity: 1;
            }

            .delete-button:hover {
                background-color: hsl(0, 100%, 30%);
            }
        </style>

        <div class="upload-image-container">
            <button class="square-button">
                <svg class="icon" viewBox="0 0 24 24">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
            </button>
        </div>
        `,this.shadow.querySelector(".square-button").addEventListener("click",()=>{const e={name:this.getAttribute("name"),languageAlias:this.languageAlias,filename:"",title:"",alt:""};document.dispatchEvent(new CustomEvent("openGallery",{detail:{image:e}}))})}async showThumbnails(e){this.shadow.querySelectorAll(".upload-image").forEach(a=>{a.remove()}),e.forEach(a=>{a.show=!0,document.dispatchEvent(new CustomEvent("createThumbnail",{detail:{image:a}}))})}async createThumbnail(e){if(this.shadow.querySelector(`.upload-image[data-filename="${e.filename}"]`))return;this.getAttribute("quantity")==="single"&&(this.shadow.querySelector(".upload-image-container").innerHTML="");const a=document.createElement("div");a.classList.add("upload-image"),a.dataset.filename=e.filename;const n=document.createElement("div");n.classList.add("upload-image-overlay");const i=document.createElement("img");i.src=`http://127.0.0.1:8080/api/admin/image-gallery/${e.filename}`;const r=document.createElement("button");r.classList.add("delete-button"),r.innerHTML="X",a.appendChild(r),a.appendChild(n),a.appendChild(i),this.shadow.querySelector(".upload-image-container").appendChild(a),e.show||(e.create=!0),document.dispatchEvent(new CustomEvent("attachImageToForm",{detail:{image:e}})),n.addEventListener("click",()=>{e.filename=a.dataset.filename,document.dispatchEvent(new CustomEvent("openGallery",{detail:{image:e}}))}),r.addEventListener("click",async()=>{a.remove(),e.previousImage=a.dataset.filename,e.delete=!0,document.dispatchEvent(new CustomEvent("attachImageToForm",{detail:{image:e}}))})}async updateThumbnail(e,a){if(!this.shadow.querySelector(`.upload-image[data-filename="${e.filename}"]`)&&this.shadow.querySelector(`.upload-image[data-filename="${a}"]`)){const n=this.shadow.querySelector(`.upload-image[data-filename="${a}"]`);n.querySelector("img").src=`http://127.0.0.1:8080/api/admin/image-gallery/${e.filename}`,n.dataset.filename=e.filename,e.previousImage=a,e.update=!0,document.dispatchEvent(new CustomEvent("attachImageToForm",{detail:{image:e}}))}}async deleteThumbnails(){this.shadow.querySelectorAll(".upload-image").forEach(e=>{e.remove()})}}customElements.define("upload-image-button-component",$);class z extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"}),this.name="",this.languageAlias="",document.addEventListener("openGallery",this.handleopenGallery.bind(this)),document.addEventListener("hideOverlayer",this.handleHideOverlayer.bind(this))}connectedCallback(){this.render()}handleopenGallery(t){this.openGallery(t.detail.image)}handleHideOverlayer(t){this.shadow.querySelector(".modal").classList.contains("active")&&this.shadow.querySelector(".modal").classList.remove("active")}disconnectedCallback(){document.removeEventListener("openGallery",this.openGalleryHandler),document.removeEventListener("hideOverlayer",this.closeGalleryHandler)}async render(){this.shadow.innerHTML=`
        <style>
            .modal {
                bottom: 30px;
                left: 30px;
                position: fixed;
                opacity: 0;
                top: 30px;
                right: 30px;
                z-index: -1;
                visibility: hidden;
            }

            .modal.active {
                opacity: 1;
                visibility: visible;
                z-index: 50000;
            }

            .modal-content {
                background-color: white;
                border: 1px solid #888;
                border-radius: 5px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                position: relative;
                width: 100%;
            }

            .modal-header {
                align-items: center;
                display: flex;
                height: 5%;
                justify-content: space-between;
                padding: 1%;
                width: 98%;
            }

            .modal-header h2 {
                font-family: 'Roboto', sans-serif;
                margin: 0;
            }

            .modal-header .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
            }

            .modal-header .close:hover,
            .modal-header .close:focus {
                color: black;
                text-decoration: none;
                cursor: pointer;
            }

            .modal-body {
                display: flex;
                flex-direction: column;
                height: 85%;
            }

            .tabs-container-menu {
                display: flex;
                flex-direction: column;
            }

            .tabs-container-menu .tabs-container-items {
                align-items: center;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding: 0 1%;
            }

            .tabs-container-menu .tabs-container-items ul {
                display: flex;
                flex-direction: row;
                list-style-type: none;
                margin: 0;
                padding: 0;
            }

            .tabs-container-menu .tabs-container-items ul li {
                cursor: pointer;
                font-family: 'Roboto', sans-serif;
                padding: 0.5rem 1rem;
            }

            .tabs-container-menu .tabs-container-items ul li:hover {
                color: #555;
            }

            .tabs-container-menu .tabs-container-items ul li.active {
                background-color: hsl(207, 85%, 69%);
                color: white;
            }

            .tabs-container-content {
                display: flex;
                flex-direction: column;
                height: 95%;
            }

            .tabs-container-content .tab {
                display: none;
                height: 100%;
            }

            .tabs-container-content .tab.active {
                display: block;
            }

            .tabs-container-content .tab.active#gallery-content {
                border-bottom: 1px solid #dcdcde;
                border-top: 1px solid #dcdcde;
                display: flex;
            }

            .image-gallery {
                align-content: flex-start;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                height: 96%;
                overflow: scroll;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 1%;
                width: 80%;
            }

            .image-gallery-loader {
                background-color: #f1f1f1;
                height: 100%;
                overflow: scroll;
                overflow-y: auto;
                overflow-x: hidden;
                width: 20%;
            }

            .image-gallery .image {
                border: 1px solid #ccc;
                border-radius: 5px;
                box-sizing: border-box;
                cursor: pointer;
                height: 135px;
                margin: 5px;
                overflow: hidden;
                padding: 5px;
                position: relative;
                width: 135px;
            }

            .image-gallery .image:hover {
                border: 1px solid #aaa;
            }

            .image-gallery .image img {
                height: 100%;
                width: 100%;
            }

            .image-gallery .image.selected {
                border: 0.2rem solid #4CAF50;
            }

            .image-gallery-loader-form{
                margin: 1rem;
            }

            .image-gallery-loader-form label {
                font-family: 'Roboto', sans-serif;
                margin: 0.5rem 5%;
                width: 90%;
            }   

            .image-gallery-loader-form input {
                border: 1px solid #ccc;
                box-sizing: border-box;
                margin: 5%;
                padding: 0.2rem;
                position: relative;
                width: 90%;
            }

            .tabs-container-content .tab.active#upload-content {
                border-bottom: 1px solid #dcdcde;
                border-top: 1px solid #dcdcde;
            }

            .upload-image {
                display: flex;
                flex-direction: column;
                height: 100%;
                justify-content: center;
                align-items: center;
            }

            .upload-image input[type="file"] {
                display: none;
            }

            .upload-image label {
                background-color: hsl(207, 85%, 69%);
                border: none;
                border-radius: 5px;
                color: white;
                cursor: pointer;
                font-family: 'Roboto', sans-serif;
                font-size: 16px;
                padding: 12px 24px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                margin: 4px 2px;
                transition-duration: 0.4s;
            }

            .upload-image label:hover {
                background-color: #45a049;
            }

            .modal-footer {
                display: flex;
                justify-content: flex-end;
                padding: 1rem;
            }

            .modal-footer button {
                background-color: #ccc;
                border: none;
                border-radius: 5px;
                color: white;
                font-size: 16px;
                padding: 12px 24px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                margin: 4px 2px;
                transition-duration: 0.4s;
            }

            .modal-footer button.active {
                background-color: hsl(207, 85%, 69%);
                cursor: pointer;
            }
        </style>


        <div class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Imagen destacada</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="tabs-container-menu">
                        <div class="tabs-container-items">
                            <ul>
                                <li id="gallery-content" class="active">Galería</li>
                                <li id="upload-content">Subir imagen</li>
                            </ul>
                        </div>
                    </div>
                    <div class="tabs-container-content">
                        <div class="tab active" id="gallery-content">
                            <div class="image-gallery">
                            </div>
                            <div class="image-gallery-loader">
                                <div class="image-gallery-information">
                                    <div class="image-gallery-loader-form">
                                        <label for="title">Título</label>
                                        <input type="text" name="title" />
                                    </div>
                                    <div class="image-gallery-loader-form">
                                        <label for="description">Texto alternativo</label>
                                        <input type="text" name="alt" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab" id="upload-content">
                            <div class="upload-image">
                                <label for="file">Subir imagen</label>
                                <input type="file" id="file" name="file" accept="image/*" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary">Elegir imagen</button>
                </div>
            </div>
        </div>
        `,await this.getThumbnails(),this.shadow.querySelector(".close").addEventListener("click",()=>{this.closeGallery()}),this.shadow.querySelectorAll(".tabs-container-menu li").forEach(t=>{t.addEventListener("click",()=>{this.changeTab(t)})}),this.shadow.querySelectorAll(".image").forEach(t=>{t.addEventListener("click",()=>{this.selectImage(t)})}),this.shadow.querySelector('input[type="file"]').addEventListener("change",async t=>{this.uploadImage(t.target.files[0])}),this.shadow.querySelector(".modal-footer button").addEventListener("click",t=>{t.target.classList.contains("active")&&this.sendDataToForm()})}async openGallery(t){document.dispatchEvent(new CustomEvent("showOverlayer")),this.shadow.querySelector(".modal").classList.add("active"),this.setAttribute("name",t.name),this.setAttribute("languageAlias",t.languageAlias),this.shadow.querySelector('input[name="title"]').value=t.title,this.shadow.querySelector('input[name="alt"]').value=t.alt;const e=this.shadow.querySelector(`.image[data-filename="${t.filename}"]`);e&&(e.classList.add("selected"),this.shadow.querySelector(".modal-footer button").classList.add("active"),this.updateFile=t.filename)}async changeTab(t){this.shadow.querySelectorAll(".tabs-container-menu li").forEach(e=>{e.classList.remove("active")}),t.classList.add("active"),this.shadow.querySelectorAll(".tabs-container-content .tab").forEach(e=>{e.classList.remove("active")}),this.shadow.querySelector(`.tabs-container-content .tab#${t.id}`).classList.add("active")}async getThumbnails(){try{const e=await(await fetch("http://127.0.0.1:8080/admin/image-gallery",{headers:{Authorization:"Bearer "+sessionStorage.getItem("accessToken")}})).json();let a="";e.filenames.forEach(n=>{a+=`
                    <div class="image" data-filename="${n}">
                        <img src="http://127.0.0.1:8080/api/admin/image-gallery/${n}" />
                    </div>
                `}),this.shadow.querySelector(".image-gallery").innerHTML=a}catch(t){console.log(t)}}async uploadImage(t){const e=new FormData;e.append("file",t);const n=await(await fetch("http://127.0.0.1:8080/api/admin/image-gallery",{method:"POST",headers:{Authorization:"Bearer "+sessionStorage.getItem("accessToken")},body:e})).json();this.shadow.querySelectorAll(".image").forEach(i=>{i.classList.remove("selected")}),n.forEach(i=>{const r=document.createElement("div"),m=document.createElement("img");r.classList.add("image","selected"),r.setAttribute("data-filename",i),m.src=`http://127.0.0.1:8080/api/admin/image-gallery/${i}`,r.addEventListener("click",()=>{this.shadow.querySelectorAll(".image").forEach(d=>{d.classList.remove("selected")}),r.classList.add("selected")}),r.appendChild(m),this.shadow.querySelector(".image-gallery").prepend(r)}),this.shadow.querySelectorAll(".tabs-container-menu li").forEach(i=>{i.classList.remove("active")}),this.shadow.querySelector("li#gallery-content").classList.add("active"),this.shadow.querySelectorAll(".tab").forEach(i=>{i.classList.remove("active")}),this.shadow.querySelector(".tab#gallery-content").classList.add("active"),this.shadow.querySelector(".modal-footer button").classList.add("active"),this.shadow.querySelector('input[name="alt"]').value="",this.shadow.querySelector('input[name="title"]').value=""}async selectImage(t){this.shadow.querySelectorAll(".image").forEach(e=>{e.classList.remove("selected")}),t.classList.add("selected"),this.shadow.querySelector(".modal-footer button").classList.add("active")}async sendDataToForm(){const t={};t.name=this.getAttribute("name"),t.alt=this.shadow.querySelector('input[name="alt"]').value,t.title=this.shadow.querySelector('input[name="title"]').value,t.languageAlias=this.getAttribute("languageAlias"),t.filename=this.shadow.querySelector(".image.selected").getAttribute("data-filename"),this.updateFile?document.dispatchEvent(new CustomEvent("updateThumbnail",{detail:{previousImage:this.updateFile,image:t}})):document.dispatchEvent(new CustomEvent("createThumbnail",{detail:{image:t}})),document.dispatchEvent(new CustomEvent("hideOverlayer")),this.updateFile=null,this.closeGallery()}async closeGallery(){document.dispatchEvent(new CustomEvent("hideOverlayer")),this.shadow.querySelector(".modal-footer button").classList.remove("active"),this.shadow.querySelectorAll(".image").forEach(t=>{t.classList.remove("selected")}),this.shadow.querySelector(".modal").classList.remove("active")}}customElements.define("image-gallery-component",z);class F extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"}),document.addEventListener("showDeleteModal",this.handleShowDeleteModal.bind(this)),document.addEventListener("hideOverlayer",this.handleHideOverlayer.bind(this))}connectedCallback(){this.render()}handleShowDeleteModal(t){this.endPoint=t.detail.endPoint,this.url=t.detail.url,this.subtable=t.detail.subtable,this.shadow.querySelector(".modal-delete").classList.add("active")}handleHideOverlayer(t){this.shadow.querySelector(".modal-delete").classList.contains("active")&&this.shadow.querySelector(".modal-delete").classList.remove("active")}render(){this.shadow.innerHTML=`
      <style>
          .modal-delete{
              background-color: hsl(0, 0%, 100%);
              position: fixed;
              left: 0;
              right: 0;
              margin-left: auto;
              margin-right: auto;
              opacity: 0;
              top: 30%;
              transition: opacity 0.3s ease;
              width: 40%;
              z-index: -1;
          }

          .modal-delete.active{
              opacity: 1;
              z-index: 3000;
          }
          
          .modal-delete-header{
              background-color: $grey;
              border-bottom: 1px solid #e9ecef;
              padding: 0.5em 1em;
              text-align: center;
          }

          .modal-delete-header h4{
              font-size: 1.2em;
              font-family: 'Roboto', sans-serif;
              margin: 0;
          }
          
          .modal-delete-footer{
              display: flex;
          }

          .modal-delete-option{
              color: hsl(0, 0%, 100%);
              cursor: pointer;
              font-weight: 600;
              font-family: 'Roboto', sans-serif;
              text-align: center;
              width: 50%;
          }

          .modal-delete-option#delete-cancel{
              background-color: hsl(183, 98%, 35%);;
          }

          .modal-delete-option#delete-confirm{
              background-color: hsl(0, 65%, 55%);
          }
      </style>

      <div class="modal-delete">
          <div class="modal-delete-content">

              <div class="modal-delete-header">
                  <h4>¿Quiere eliminar este registro?</h4>
              </div>

              <div class="modal-delete-footer">
                  <div class="modal-delete-option" id="delete-confirm">
                      <h4>Sí</h4>
                  </div>
                  <div class="modal-delete-option " id="delete-cancel">
                      <h4>No</h4>
                  </div>
              </div>
          </div>
      </div>
      `,this.shadow.querySelector("#delete-confirm").addEventListener("click",()=>{fetch(this.endPoint,{method:"DELETE",headers:{Authorization:"Bearer "+sessionStorage.getItem("accessToken")}}).then(t=>t.json()).then(t=>{this.subtable&&document.dispatchEvent(new CustomEvent("refreshTable",{detail:{url:this.url,data:t.result.rows?t.result.rows:null}})),document.dispatchEvent(new CustomEvent("refreshForm",{detail:{url:this.url}})),document.dispatchEvent(new CustomEvent("message",{detail:{message:t.message,type:"success"}})),document.dispatchEvent(new CustomEvent("hideOverlayer")),this.shadow.querySelector(".modal-delete").classList.remove("active")}).catch(t=>{document.dispatchEvent(new CustomEvent("message",{detail:{message:t.message,type:"error"}}))})}),this.shadow.querySelector("#delete-cancel").addEventListener("click",()=>{document.dispatchEvent(new CustomEvent("hideOverlayer")),this.shadow.querySelector(".modal-delete").classList.remove("active")})}}customElements.define("delete-element-modal-component",F);
