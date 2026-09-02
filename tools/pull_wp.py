import json,urllib.request,ssl,re,html
ctx=ssl.create_default_context()
out=[]
for page in range(1,400):
    url=f"https://loveandlordship.com/wp-json/wp/v2/posts?per_page=100&page={page}&_fields=id,date,link,title,excerpt,content,categories,tags,featured_media"
    try:
        with urllib.request.urlopen(urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0"}),context=ctx,timeout=60) as r:
            data=json.loads(r.read().decode())
    except Exception as e:
        print("stop",page,e); break
    if not data: break
    for p in data:
        c=p["content"]["rendered"]
        yt=re.findall(r'(?:youtube\.com/(?:embed/|watch\?v=)|youtu\.be/)([\w-]{11})',c)
        vim=re.findall(r'vimeo\.com/(?:video/)?(\d+)',c)
        pb=re.findall(r'(https?://[^"\'\s]*podbean\.com[^"\'\s]*)',c)
        mp3=re.findall(r'(https?://[^"\'\s]+\.mp3)',c)
        text=html.unescape(re.sub(r'<[^>]+>',' ',c)); text=re.sub(r'\s+',' ',text).strip()
        out.append({"id":p["id"],"date":p["date"][:10],"url":p["link"],"title":html.unescape(p["title"]["rendered"]),
                    "excerpt":html.unescape(re.sub(r'<[^>]+>','',p["excerpt"]["rendered"])).strip(),
                    "text":text[:3000],"youtube":sorted(set(yt)),"vimeo":sorted(set(vim)),"podbean":sorted(set(pb)),"mp3":sorted(set(mp3)),"cats":p["categories"],"tags":p["tags"]})
    print("page",page,len(data))
json.dump(out,open("wp_posts.json","w",encoding="utf8"),indent=1,ensure_ascii=False)
print("TOTAL",len(out)); print("with yt",sum(1 for o in out if o["youtube"]),"vimeo",sum(1 for o in out if o["vimeo"]),"podbean",sum(1 for o in out if o["podbean"]),"mp3",sum(1 for o in out if o["mp3"]))
print("date range",min(o["date"] for o in out),max(o["date"] for o in out))
