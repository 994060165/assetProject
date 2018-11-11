(function(window){var svgSprite='<svg><symbol id="icon-yanzhengma" viewBox="0 0 1024 1024"><path d="M511.9 960c-140.1 0-400.8-200.8-400.8-390.7V206.8c0-8.8 7.6-15.9 17.1-16.1l22.7-0.4c0.9 0 89.8-1.7 181.6-36.7 94.2-35.8 154.8-76.9 155.5-77.4l13.4-9.1c3-2.1 6.7-3.2 10.4-3.2 3.6 0 7.3 1 10.3 3.1l13.6 9.2c0.6 0.4 61.4 41.6 155.5 77.4 91.8 34.9 180.8 36.7 181.7 36.7l22.5 0.4c9.5 0.2 17.1 7.3 17.1 16.1l0.2 362.5C912.8 759.2 652.2 960 511.9 960zM851 249c-34.5-2.5-106.9-11-182.2-39.7-77-29.3-133.5-62.1-156.8-76.6-23.2 14.5-79.9 47.4-156.8 76.6-75.2 28.6-147.5 37.1-182.4 39.7v320.3c0 148.9 227.1 331 339.1 331 43.4 0 128-33.9 211.2-108.3 80.2-71.7 128-155 128-222.7L851 249zM479.8 630.2c-6 5.9-13.9 8.8-21.8 8.8s-15.8-2.9-21.8-8.8l-92.5-89.5c-12-11.7-12-30.6 0-42.2 12.1-11.7 31.6-11.7 43.6 0L458 567l178.6-173c12.1-11.7 31.6-11.7 43.6 0 12.1 11.6 12.1 30.5 0 42.2l-200.4 194z" fill="#666666" ></path></symbol><symbol id="icon-mima" viewBox="0 0 1024 1024"><path d="M773.856875 405.9509375h-25.021875v-102.2296875c0-130.5853125-106.2496875-236.8359375-236.851875-236.8359375-130.569375 0-236.8190625 106.2496875-236.8190625 236.8359375v102.2296875h-25.021875c-56.7421875 0-102.9009375 46.1578125-102.9009375 102.9009375v345.36375c0 56.7421875 46.1578125 102.9009375 102.9009375 102.9009375h523.7146875c56.7421875 0 102.9009375-46.1578125 102.9009375-102.9009375v-345.36375c0.0009375-56.7421875-46.156875-102.9009375-102.9009375-102.9009375zM343.76375 303.719375c0-92.7684375 75.466875-168.23625 168.2184375-168.23625 92.7853125 0 168.2521875 75.466875 168.2521875 168.23625v102.2296875h-336.4696875v-102.2296875zM808.1571875 854.2146875c0 18.909375-15.375 34.3003125-34.3003125 34.3003125h-523.7146875c-18.9253125 0-34.3003125-15.391875-34.3003125-34.3003125v-345.36375c0-18.909375 15.375-34.3003125 34.3003125-34.3003125h523.7146875c18.9253125 0 34.3003125 15.391875 34.3003125 34.3003125v345.36375z"  ></path><path d="M436.844375 681.5365625c0 41.5059375 33.646875 75.15375 75.15375 75.15375 41.5059375 0 75.15375-33.646875 75.15375-75.15375 0-41.5059375-33.646875-75.15375-75.15375-75.15375-41.5059375 0-75.15375 33.646875-75.15375 75.15375z"  ></path></symbol><symbol id="icon-zhanghao" viewBox="0 0 1092 1024"><path d="M268.69151 451.733505a240.975871 240.975871 0 1 1 233.671503 0A385.697924 385.697924 0 0 1 770.917993 819.204642C770.986258 1032.123549 0 1032.123549 0 819.204642a385.697924 385.697924 0 0 1 268.69151-367.471137z m116.801619-18.021992a192.780697 192.780697 0 1 0 0-385.493129 192.780697 192.780697 0 0 0 0 385.493129z m337.297954 365.081858c0-175.031766-151.002444-316.886684-337.229689-316.886684-186.363776 0-337.36622 141.854918-337.36622 316.886684 0 174.963501 674.595909 174.963501 674.595909 0z m16.110569-413.277032h321.187386a32.084606 32.084606 0 0 1 0 64.237477h-321.187386a32.084606 32.084606 0 1 1 0-64.169212z m128.474954 192.780697h192.712432a32.084606 32.084606 0 0 1 0 64.169212h-192.712432a32.084606 32.084606 0 1 1 0-64.169212z m0 192.712432h192.712432a32.084606 32.084606 0 0 1 0 64.237477h-192.712432a32.084606 32.084606 0 1 1 0-64.169212z"  ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)