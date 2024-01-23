(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(t){if(t.ep)return;t.ep=!0;const o=n(t);fetch(t.href,o)}})();class l extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),window.onpopstate=()=>this.handleRouteChange()}handleRouteChange(){this.render()}render(){const e=window.location.pathname;this.getTemplate(e)}async getTemplate(e){const s={"/":"/pages/login.html"}[e]||"/pages/404.html";await this.loadPage(s)}async loadPage(e){const s=await(await fetch(e)).text();document.startViewTransition(()=>{this.shadowRoot.innerHTML=s,document.documentElement.scrollTop=0})}}customElements.define("auth-page-component",l);class a extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"});const e=document.createElement("link");e.href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",e.rel="stylesheet",document.head.appendChild(e)}}customElements.define("font-loader-component",a);new a;class c extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){}connectedCallback(){this.render()}attributeChangedCallback(e,n,s){}render(){this.shadow.innerHTML=`
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
      `}}customElements.define("logo-component",c);class d extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){this.shadow.innerHTML=`
        <style>

          :host{
            display: block;
            width: 300px;
          }

          h2{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
          }

          form{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .form-element{
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .form-element-label label{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1rem;
            transition: color 0.5s;
          }

          .form-element-input{
            width: 100%;
          }

          .form-element-input input{
            background-color:hsl(226, 63%, 45%);
            border: none;
            border-bottom: 0.1rem solid  hsl(0, 0%, 100%);
            box-sizing: border-box;
            color: hsl(0, 0%, 100%);
            font-family: 'Roboto' , sans-serif;
            font-weight: 600;
            outline: none;
            padding: 0.5rem;
            width: 100%;
          }

          .form-submit{
            background-color: hsl(272 40% 35%);
            border: none;
            border-radius: 0.5rem;
            color: hsl(0, 0%, 100%);
            cursor: pointer;
            font-family: 'Lato', sans-serif;
            font-size: 1rem;      
            margin-top: 1rem;      
            padding: 0.5rem 1rem;
          }

          .form-submit:hover {
            filter: brightness(1.2);
          }
        </style>

        <h2>${this.getAttribute("title")}</h2>

        <form class="form">
          <div class="form-element">
            <div class="form-element-label">
              <label for="email">Email</label>
            </div>
            <div class="form-element-input">
              <input type="email" name="email" id="email" required>
            </div>
          </div>
          <div class="form-element">
            <div class="form-element-label">
              <label for="password">Password</label>
            </div>
            <div class="form-element-input">
              <input type="password" name="password" id="password" required>
            </div>
          </div>
          <button type="submit" class="form-submit">Enviar</button>
        </form>
        `;const e=this.shadow.querySelector("form");e.addEventListener("submit",n=>{n.preventDefault(),this.submitForm(e)})}async submitForm(e){const n="http://127.0.0.1:8080/api/auth/users/signin",s=new FormData(e),t=Object.fromEntries(s.entries());try{const o=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(o.ok){const r=await o.json();sessionStorage.setItem("accessToken",r.accessToken),window.location.href="/admin"}else{const r=await o.json();console.log(r.message)}}catch(o){console.log(o)}}}customElements.define("login-form-component",d);
