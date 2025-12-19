( () => {
    var e, t, n = {
        6691: (e, t, n) => {
            "use strict";
            const s = e => new Promise((t => {
                setTimeout(( () => t()), e)
            }
            ))
              , a = "rubika-assets";
            async function r(e) {
                const t = await o((async () => {
                    const t = await self.caches.open(a)
                      , n = await t.match(e.request);
                    return {
                        cache: t,
                        cached: n
                    }
                }
                ), 3e3)
                  , {cache: n, cached: s} = t || {};
                if (n && s) {
                    if (s.ok)
                        return s;
                    await n.delete(e.request)
                }
                const r = await fetch(e.request);
                return r.ok && n && n.put(e.request, r.clone()),
                r
            }
            async function o(e, t) {
                let n = !1;
                try {
                    return await Promise.race([s(t).then(( () => n ? void 0 : Promise.reject(new Error("TIMEOUT")))), e()])
                } catch (e) {
                    return void console.error(e)
                } finally {
                    n = !0
                }
            }
            var i = n(21396)
              , c = n.n(i);
            const f = (( () => {
                let e = "";
                for (let t = 0; t < 32; t++)
                    e += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(26 * Math.random()))
            }
            )(),
            (e, t, n) => e.substr(0, t) + n + e.substr(t + n.length))
              , l = (e, t) => {
                if (!t)
                    return e;
                const n = (e => {
                    const t = e.substring(0, 8)
                      , n = e.substring(8, 16);
                    let s = e.substring(16, 24) + t + e.substring(24, 32) + n;
                    for (let e = 0; e < s.length; e++) {
                        const t = s.charAt(e);
                        if (t >= "0" && t <= "9") {
                            const n = String.fromCharCode((t.charCodeAt(0) - "0".charCodeAt(0) + 5) % 10 + "0".charCodeAt(0));
                            s = f(s, e, n)
                        } else {
                            const n = String.fromCharCode((t.charCodeAt(0) - "a".charCodeAt(0) + 9) % 26 + "a".charCodeAt(0));
                            s = f(s, e, n)
                        }
                    }
                    return s
                }
                )(t)
                  , s = c().enc.Utf8.parse(n)
                  , a = c().enc.Base64.parse(e);
                return c().AES.decrypt({
                    ciphertext: a,
                    iv: c().enc.Hex.parse("0000000000000000"),
                    key: s,
                    salt: ""
                }, s, {
                    mode: c().mode.CBC,
                    padding: c().pad.Pkcs7,
                    iv: c().enc.Hex.parse("0000000000000000")
                }).toString(c().enc.Utf8)
            }
              , u = "default-db"
              , d = "default-store";
            let p, h;
            new Promise((e => {
                p = indexedDB.open(u, 1),
                p.onupgradeneeded = () => {
                    h = p.result,
                    h.objectStoreNames.contains(d) || h.createObjectStore(d)
                }
                ,
                p.onsuccess = () => {
                    h = p.result,
                    e(!0)
                }
                ,
                p.onerror = () => {
                    e(!1)
                }
            }
            )),
            new Set;
            const g = {};
            async function m() {
                const e = new URL(self.registration.scope).origin;
                return (await self.clients.matchAll({
                    type: "window"
                })).filter((t => new URL(t.url).origin === e))
            }
            async function w(e) {
                const t = (await m())[0];
                t && t.postMessage({
                    type: "playNotificationSound",
                    payload: {
                        id: e
                    }
                })
            }
            async function y(e) {
                const t = await async function(e) {
                    const t = e?.fcmMessageId || Date?.now()?.toString();
                    try {
                        const n = await new Promise(( (e, t) => {
                            p = indexedDB.open(u, 1),
                            p.onsuccess = () => {
                                h = p.result;
                                const t = h.transaction(d, "readwrite").objectStore(d).getAll();
                                t.onsuccess = () => {
                                    e(t.result)
                                }
                            }
                            ,
                            p.onerror = e => {
                                t(e)
                            }
                            ,
                            p.onblocked = e => {
                                t(e)
                            }
                        }
                        ))
                          , s = n?.[0]
                          , a = e?.data?.data_enc ? JSON.parse(l(e?.data?.data_enc, s)) : {};
                        return {
                            type: e.data.type,
                            messenger: {
                                ...a
                            },
                            id: t
                        }
                    } catch (e) {
                        return
                    }
                }(e);
                if (t) {
                    if (t?.messenger?.show_notifications) {
                        const e = t?.messenger?.show_notifications?.[0]?.title || "Rubika"
                          , n = ""
                          , s = {
                            body: t?.messenger?.show_notifications?.[0]?.text || "",
                            data: t,
                            icon: n || "/assets/icons/icon-192x192.png",
                            badge: "/assets/icons/icon-192x192.png",
                            tag: t.id,
                            vibrate: [200, 100, 200]
                        };
                        return Promise.all([w(t.id), self.registration.showNotification(e, s)])
                    }
                    if (t?.messenger?.remove_notifications) {
                        const e = t?.messenger?.remove_notifications?.[0]?.remove_one_data?.notification_id;
                        (await self.registration.getNotifications()).forEach((t => {
                            t.data?.messenger?.show_notifications?.[0]?.notification_id === e && t.close()
                        }
                        ))
                    }
                }
            }
            async function b(e, t) {
                if (t && (e.postMessage({
                    type: "focusMessage",
                    payload: t
                }),
                !e.focused))
                    try {
                        await e.focus()
                    } catch (e) {
                        console.warn("[SW] ", e)
                    }
            }
            const v = 524288
              , S = "media-stream"
              , P = new Map;
            async function C(e) {
                const t = e.request.headers.get("range")
                  , n = new URL(e.request.url)
                  , s = n.pathname + n.search;
                if (!await self.clients.get(e.clientId))
                    return;
                const a = /^bytes=(\d+)-(\d+)?$/g.exec(t || "")
                  , r = Number(a?.[1])
                  , o = Number(a?.[2]);
                let i = o;
                if ((!i || i - r + 1 > v) && (i = r + v - 1),
                0 === r && 1 === i) {
                    const e = s.match(/fileSize=(\d+)&mimeType=([\w/]+)/)
                      , t = e && Number(e[1])
                      , n = e?.[2];
                    if (t && n)
                        return new Response(new Uint8Array(2).buffer,{
                            status: 206,
                            statusText: "Partial Content",
                            headers: [["Content-Range", `bytes 0-1/${t}`], ["Accept-Ranges", "bytes"], ["Content-Length", "2"], ["Content-Type", n]]
                        })
                }
                const c = `${s}?start=${r}&end=${i}`
                  , f = await async function(e) {
                    const t = await self.caches.open(S);
                    return Promise.all([t.match(`${e}&type=arrayBuffer`).then((e => e ? e.arrayBuffer() : void 0)), t.match(`${e}&type=headers`).then((e => e ? e.json() : void 0))])
                }(c);
                if (console.log(`FETCH PROGRESSIVE ${c} (request: ${r}-${o}) CACHED: ${Boolean(f[0])}`),
                f[0])
                    return new Response(f[0],{
                        status: 206,
                        statusText: "Partial Content",
                        headers: f[1]
                    });
                let l;
                try {
                    l = await async function(e, t) {
                        if (!e.clientId)
                            return;
                        const n = await self.clients.get(e.clientId);
                        if (!n)
                            return;
                        const s = function(e) {
                            let t;
                            do {
                                t = String(Math.random()).replace("0.", "id")
                            } while (e.hasOwnProperty(t));
                            return t
                        }(P)
                          , a = {}
                          , r = Promise.race([new Promise((e => {
                            setTimeout(( () => e()), 6e4)
                        }
                        )).then(( () => Promise.reject(new Error("ERROR_PART_TIMEOUT")))), new Promise(( (e, t) => {
                            Object.assign(a, {
                                resolve: e,
                                reject: t
                            })
                        }
                        ))]);
                        return P.set(s, a),
                        r.catch(( () => {}
                        )).finally(( () => {
                            P.delete(s)
                        }
                        )),
                        n.postMessage({
                            type: "requestPart",
                            messageId: s,
                            params: t
                        }),
                        r
                    }(e, {
                        url: s,
                        start: r,
                        end: i
                    })
                } catch (e) {
                    console.error("FETCH PROGRESSIVE", e)
                }
                if (!l)
                    return new Response("",{
                        status: 500,
                        statusText: "Failed to fetch progressive part"
                    });
                const u = Math.min(i - r + 1, l.arrayBuffer.byteLength);
                i = r + u - 1;
                const d = l.arrayBuffer.slice(0, u)
                  , p = [["Content-Range", `bytes ${r}-${i}/${l.fullSize}`], ["Accept-Ranges", "bytes"], ["Content-Length", String(u)], ["Content-Type", "audio/mp3"]];
                return u <= 524288 && i < 2097151 && async function(e, t, n) {
                    const s = await self.caches.open(S);
                    Promise.all([s.put(new Request(`${e}&type=arrayBuffer`), new Response(t)), s.put(new Request(`${e}&type=headers`), new Response(JSON.stringify(n)))])
                }(c, d, p),
                new Response(d,{
                    status: 206,
                    statusText: "Partial Content",
                    headers: p
                })
            }
            self.addEventListener("message", (e => {
                const t = e.data;
                if ("partResponse" === t.type) {
                    const e = P.get(t.messageId);
                    e && e.resolve(t.result)
                }
            }
            ));
            var R = n(20663);
            (0,
            n(70223).Wp)({
                apiKey: "AIzaSyAqt9fZW6HVPGm_NOKrHnhkdCBf18wo3FY",
                authDomain: "medu-fc947.firebaseapp.com",
                projectId: "medu-fc947",
                storageBucket: "medu-fc947.firebasestorage.app",
                messagingSenderId: "959178038744",
                appId: "1:959178038744:web:83f958ab8ef0988f1226ad",
                measurementId: "G-SG1R5WGSG4"
            });
            const k = (0,
            R.dG)()
              , I = /\.(wasm|html)$/
              , x = /[\da-f]{20}.*\.(js|css|woff2?|svg|png|jpg|jpeg|tgs|json|wasm)$/;
            self.addEventListener("install", (e => {
                e.waitUntil(self.skipWaiting())
            }
            )),
            self.addEventListener("activate", (e => {
                e.waitUntil(Promise.race([s(3e3), Promise.all([self.caches.delete(a), self.clients.claim()])]))
            }
            )),
            self.addEventListener("fetch", (e => {
                const {url: t} = e.request
                  , n = self.registration.scope;
                if (!t.startsWith(n))
                    return !1;
                const {pathname: s, protocol: i} = new URL(t)
                  , {pathname: c} = new URL(n);
                if (s.includes("/stream/"))
                    return e.respondWith(C(e)),
                    !0;
                if ("http:" === i || "https:" === i) {
                    if (s === c || s.match(I))
                        return e.respondWith(async function(e) {
                            const t = await o(( () => fetch(e.request)), 3e3);
                            if (!t?.ok)
                                return r(e);
                            const n = t.clone();
                            return self.caches.open(a).then((t => t?.put(e.request, n))),
                            t
                        }(e)),
                        !0;
                    if (s.match(x))
                        return e.respondWith(r(e)),
                        !0
                }
                return !1
            }
            )),
            self.addEventListener("install", (e => {
                e.waitUntil(self.skipWaiting())
            }
            )),
            self.addEventListener("message", (e => {
                e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting(),
                function(e) {
                    if (!e.data)
                        return;
                    const t = e.source;
                    switch (e.data.type) {
                    case "SKIP_WAITING":
                        return void self.skipWaiting();
                    case "showMessageNotification":
                        return void y(e.data.payload);
                    case "clientReady":
                        const n = g[t.id] || g[0];
                        n && (delete g[t.id],
                        delete g[0],
                        e.waitUntil(b(t, n)))
                    }
                }(e)
            }
            )),
            (0,
            R.DA)(k, (e => {
                y({
                    data: e.data,
                    fcmMessageId: e.messageId
                })
            }
            )),
            self.addEventListener("notificationclick", (async function(e) {
                const t = self.registration.scope;
                e.notification.close();
                const {data: n} = e.notification;
                e.waitUntil((async () => {
                    if (!n)
                        return;
                    const e = await m();
                    if (await Promise.all(e.map((e => b(e, n)))),
                    self.clients.openWindow && !(e.length > 0)) {
                        g[0] = n;
                        try {
                            const e = await self.clients.openWindow(t);
                            e && (g[e.id] = n)
                        } catch (e) {
                            console.warn("[SW] ", e)
                        }
                    }
                }
                )())
            }
            ))
        }
        ,
        50477: () => {}
    }, s = {};
    function a(e) {
        var t = s[e];
        if (void 0 !== t)
            return t.exports;
        var r = s[e] = {
            exports: {}
        };
        return n[e].call(r.exports, r, r.exports, a),
        r.exports
    }
    a.m = n,
    a.x = () => {
        var e = a.O(void 0, [7316], ( () => a(6691)));
        return a.O(e)
    }
    ,
    e = [],
    a.O = (t, n, s, r) => {
        if (!n) {
            var o = 1 / 0;
            for (l = 0; l < e.length; l++) {
                n = e[l][0],
                s = e[l][1],
                r = e[l][2];
                for (var i = !0, c = 0; c < n.length; c++)
                    (!1 & r || o >= r) && Object.keys(a.O).every((e => a.O[e](n[c]))) ? n.splice(c--, 1) : (i = !1,
                    r < o && (o = r));
                if (i) {
                    e.splice(l--, 1);
                    var f = s();
                    void 0 !== f && (t = f)
                }
            }
            return t
        }
        r = r || 0;
        for (var l = e.length; l > 0 && e[l - 1][2] > r; l--)
            e[l] = e[l - 1];
        e[l] = [n, s, r]
    }
    ,
    a.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return a.d(t, {
            a: t
        }),
        t
    }
    ,
    a.d = (e, t) => {
        for (var n in t)
            a.o(t, n) && !a.o(e, n) && Object.defineProperty(e, n, {
                enumerable: !0,
                get: t[n]
            })
    }
    ,
    a.f = {},
    a.e = e => Promise.all(Object.keys(a.f).reduce(( (t, n) => (a.f[n](e, t),
    t)), [])),
    a.u = e => e + ".dabd3632304b3a32f281.js",
    a.miniCssF = e => {}
    ,
    a.g = function() {
        if ("object" == typeof globalThis)
            return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window)
                return window
        }
    }(),
    a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t),
    ( () => {
        var e;
        a.g.importScripts && (e = a.g.location + "");
        var t = a.g.document;
        if (!e && t && (t.currentScript && "SCRIPT" === t.currentScript.tagName.toUpperCase() && (e = t.currentScript.src),
        !e)) {
            var n = t.getElementsByTagName("script");
            if (n.length)
                for (var s = n.length - 1; s > -1 && (!e || !/^http(s?):/.test(e)); )
                    e = n[s--].src
        }
        if (!e)
            throw new Error("Automatic publicPath is not supported in this browser");
        e = e.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/"),
        a.p = e
    }
    )(),
    ( () => {
        var e = {
            9087: 1
        };
        a.f.i = (t, n) => {
            e[t] || importScripts(a.p + a.u(t))
        }
        ;
        var t = self.webpackChunkrubika_pwa = self.webpackChunkrubika_pwa || []
          , n = t.push.bind(t);
        t.push = t => {
            var s = t[0]
              , r = t[1]
              , o = t[2];
            for (var i in r)
                a.o(r, i) && (a.m[i] = r[i]);
            for (o && o(a); s.length; )
                e[s.pop()] = 1;
            n(t)
        }
    }
    )(),
    t = a.x,
    a.x = () => a.e(7316).then(t),
    a.x()
}
)();
