import json,urllib.request,ssl,collections,time
ctx=ssl.create_default_context()
H={"User-Agent":"Mozilla/5.0","Content-Type":"application/json"}
def post(body):
    req=urllib.request.Request("https://www.youtube.com/youtubei/v1/browse?prettyPrint=false",data=json.dumps(body).encode(),headers=H)
    return json.loads(urllib.request.urlopen(req,context=ctx,timeout=60).read().decode())
ctxb={"context":{"client":{"clientName":"WEB","clientVersion":"2.20250101.00.00"}}}
def walk(o):
    if isinstance(o,dict):
        yield o
        for v in o.values(): yield from walk(v)
    elif isinstance(o,list):
        for v in o: yield from walk(v)
def txt(x):
    if isinstance(x,dict): return x.get("simpleText") or "".join(r.get("text","") for r in x.get("runs",[])) or x.get("content","")
    return ""
vids={}
def harvest(d,kind):
    tok=None
    for o in walk(d):
        if "videoRenderer" in o:
            v=o["videoRenderer"]; vid=v.get("videoId")
            if vid and vid not in vids:
                vids[vid]={"id":vid,"kind":kind,"title":txt(v.get("title")),"published":txt(v.get("publishedTimeText")),"dur":txt(v.get("lengthText")),"views":txt(v.get("viewCountText")),"desc":"".join(txt(s.get("snippetText")) for s in v.get("detailedMetadataSnippets",[]))}
        if "lockupViewModel" in o and o["lockupViewModel"].get("contentType","").endswith("VIDEO"):
            v=o["lockupViewModel"]; vid=v.get("contentId")
            if vid and vid not in vids:
                md=v.get("metadata",{}).get("lockupMetadataViewModel",{})
                rows=[p.get("text",{}).get("content","") for r in md.get("metadata",{}).get("contentMetadataViewModel",{}).get("metadataRows",[]) for p in r.get("metadataParts",[])]
                dur=""
                for ov in v.get("contentImage",{}).get("thumbnailViewModel",{}).get("overlays",[]):
                    for b in ov.get("thumbnailBottomOverlayViewModel",{}).get("badges",[]):
                        dur=b.get("thumbnailBadgeViewModel",{}).get("text","") or dur
                vids[vid]={"id":vid,"kind":kind,"title":txt(md.get("title")),"published":next((r for r in rows if "ago" in r),""),"dur":dur,"views":next((r for r in rows if "view" in r),""),"desc":""}
        if "shortsLockupViewModel" in o:
            v=o["shortsLockupViewModel"]; vid=(v.get("onTap",{}).get("innertubeCommand",{}).get("reelWatchEndpoint",{}).get("videoId"))
            if vid and vid not in vids:
                vids[vid]={"id":vid,"kind":"short","title":txt(v.get("overlayMetadata",{}).get("primaryText")),"published":"","dur":"short","views":txt(v.get("overlayMetadata",{}).get("secondaryText")),"desc":""}
        if "reelItemRenderer" in o:
            v=o["reelItemRenderer"]; vid=v.get("videoId")
            if vid and vid not in vids:
                vids[vid]={"id":vid,"kind":"short","title":txt(v.get("headline")),"published":"","dur":"short","views":txt(v.get("viewCountText")),"desc":""}
        if "continuationItemRenderer" in o:
            t=o["continuationItemRenderer"].get("continuationEndpoint",{}).get("continuationCommand",{}).get("token")
            if t and tok is None: tok=t
    return tok
for kind,params in (("video","EgZ2aWRlb3PyBgQKAjoA"),("short","EgZzaG9ydHPyBgUKA5oBAA%3D%3D")):
    d=post({**ctxb,"browseId":"UCY9DJ9AIFc3eXXvmmWn-6AQ","params":params})
    if kind=="video":
        c=collections.Counter(k for o in walk(d) for k in o if k.endswith("Renderer") or k.endswith("ViewModel"))
        print("videos-tab renderers:",[x for x in c.most_common(12)])
    tok=harvest(d,kind); n=0
    while tok and n<300:
        before=len(vids); d=post({**ctxb,"continuation":tok}); tok=harvest(d,kind); n+=1
        if len(vids)==before: break
        time.sleep(0.2)
    print(kind,"done, total so far",len(vids),"pages",n+1)
out=list(vids.values())
json.dump(out,open("youtube.json","w",encoding="utf8"),indent=1,ensure_ascii=False)
print("videos",sum(1 for v in out if v["kind"]=="video"),"shorts",sum(1 for v in out if v["kind"]=="short"))
for o in out[:5]: print(o["published"],"|",o["dur"],"|",o["title"])
