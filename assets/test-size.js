import P,{useState as l,useCallback as b}from"react";import J from"react-dom/client";var D={exports:{}},C={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var V=P,Z=Symbol.for("react.element"),X=Symbol.for("react.fragment"),ee=Object.prototype.hasOwnProperty,se=V.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,te={key:!0,ref:!0,__self:!0,__source:!0};function G(r,a,s){var n,o={},i=null,u=null;s!==void 0&&(i=""+s),a.key!==void 0&&(i=""+a.key),a.ref!==void 0&&(u=a.ref);for(n in a)ee.call(a,n)&&!te.hasOwnProperty(n)&&(o[n]=a[n]);if(r&&r.defaultProps)for(n in a=r.defaultProps,a)o[n]===void 0&&(o[n]=a[n]);return{$$typeof:Z,type:r,key:i,ref:u,props:o,_owner:se.current}}C.Fragment=X;C.jsx=G;C.jsxs=G;D.exports=C;var e=D.exports;function g(r,a,s="sine"){try{const n=new(window.AudioContext||window.webkitAudioContext),o=n.createOscillator(),i=n.createGain();o.type=s,o.frequency.value=r,i.gain.setValueAtTime(.25,n.currentTime),i.gain.exponentialRampToValueAtTime(.001,n.currentTime+a),o.connect(i),i.connect(n.destination),o.start(),o.stop(n.currentTime+a)}catch{}}function ne(){g(880,.18),setTimeout(()=>g(1100,.2),120)}function ae(){g(220,.3,"sawtooth")}function N(){g(660,.05)}function O(){[523,659,784,1047].forEach((r,a)=>setTimeout(()=>g(r,.2),a*100))}function re(){const r=["#FF6B9D","#FFD93D","#6BCB77","#4D96FF","#FF8C42","#A66CFF"];for(let a=0;a<60;a++){const s=document.createElement("div");s.style.cssText=`
      position: fixed; left: ${Math.random()*100}vw; top: -20px;
      width: ${6+Math.random()*8}px; height: ${6+Math.floor(Math.random()*r.length)]};
      background: ${r[Math.floor(Math.random()*r.length)]};
      border-radius: ${Math.random()>.5?"50%":"2px"};
      z-index: 9999; pointer-events: none;
      transition: transform ${1.5+Math.random()}s ease-out, opacity ${1.5+Math.random()}s;
    `,document.body.appendChild(s);const n=(Math.floor(Math.random()-.5)*300,o=400+Math.floor(Math.random()*300,c=Math.random()*720;return{s.style.transform=`translate(${tn}px,${o}px) rotate(${i}deg)`,s.style.opacity="0"}),setTimeout(()=>s.remove(),2500)}}