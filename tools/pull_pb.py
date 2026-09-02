import json,urllib.request,ssl,re,html,time
ctx=ssl.create_default_context()
eps={}; 
for n in range(1,400):
    url="https://loveandlordship.podbean.com/" if n==1 else f"https://loveandlordship.podbean.com/page/{n}/"
    try:
        h=urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0"}),context=ctx,timeout=60).read().decode("utf8","ignore")
    except Exception as e:
        print("http stop at page",n,e); break
    m=re.search(r'<script type="application/ld\+json">(\[.*?\])</script>',h,re.S)
    new=0
    if m:
        for o in json.loads(m.group(1)):
            if o.get("@type")=="PodcastEpisode" and o["url"] not in eps:
                eps[o["url"]]={"url":"https://loveandlordship.podbean.com"+o["url"],"title":html.unescape(o["name"]),"date":o.get("datePublished"),"desc":html.unescape(o.get("description","")),"audio":o.get("associatedMedia",{}).get("contentUrl")}; new+=1
    if new==0: print("stop at page",n); break
    if n%10==0: print("page",n,len(eps)); time.sleep(0.2)
out=sorted(eps.values(),key=lambda e:e["date"],reverse=True)
json.dump(out,open("podbean_all.json","w",encoding="utf8"),indent=1,ensure_ascii=False)
print("episodes",len(out),out[-1]["date"],"->",out[0]["date"])
