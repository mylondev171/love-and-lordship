"""One-shot content refresh: pull every source, rebuild everything that derives
from them, and leave the working tree changed only if there is new content.

Run from the repo root (the GitHub Action does exactly this):

    python tools/refresh.py

Safety: each pull runs in a scratch folder and only replaces the committed
snapshot (tools/*.json) if it succeeded AND returned at least 90% as many items
as the snapshot. When loveandlordship.com (WordPress) is retired, its pulls fail
and the last good snapshot keeps the 332 articles in the library instead of an
empty result wiping them out.

Exit code is non-zero only if a BUILD step fails; a failed pull is a warning.
"""
import json, os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, "tools")
PY = sys.executable

# (script, file it writes, path of that file relative to the scratch cwd)
PULLS = [
    ("pull_pb.py", "podbean_all.json", "podbean_all.json"),
    ("pull_yt.py", "youtube.json", "youtube.json"),
    ("pull_wp.py", "wp_posts.json", "wp_posts.json"),
    ("pull_wp_full.py", "wp_archive.json", os.path.join("tools", "wp_archive.json")),
]
MIN_RATIO = 0.9


def count(path):
    try:
        data = json.load(open(path, encoding="utf8"))
        return len(data) if isinstance(data, list) else len(data.get("posts", data))
    except Exception:
        return -1


def pull(script, name, rel):
    snap = os.path.join(TOOLS, name)
    before = count(snap)
    with tempfile.TemporaryDirectory() as tmp:
        os.makedirs(os.path.join(tmp, "tools"), exist_ok=True)
        r = subprocess.run([PY, os.path.join(TOOLS, script)], cwd=tmp,
                           capture_output=True, text=True, encoding="utf8", errors="replace", timeout=1800)
        out = os.path.join(tmp, rel)
        after = count(out) if os.path.exists(out) else -1
        ok = r.returncode == 0 and after > 0 and (before <= 0 or after >= before * MIN_RATIO)
        if ok:
            shutil.copyfile(out, snap)
            print(f"[pull] {script}: {before} -> {after} items")
        else:
            tail = (r.stdout + r.stderr).strip().splitlines()[-3:]
            print(f"::warning::[pull] {script} kept the snapshot ({before} items); got {after}, exit {r.returncode}: {' | '.join(tail)}")


def items_of(src):
    """The LL_LIBRARY array only, so a new build date alone doesn't count as a change."""
    start = src.index("window.LL_LIBRARY=")
    return src[start:src.index(";\n", start)]


def run(args, cwd):
    print("[build]", " ".join(os.path.basename(a) for a in args[1:]))
    subprocess.run(args, cwd=cwd, check=True)


def main():
    for p in PULLS:
        pull(*p)

    lib = os.path.join(ROOT, "data", "library.js")
    old_lib = open(lib, encoding="utf8").read()

    run([PY, os.path.join(TOOLS, "build_library.py")], TOOLS)
    run([PY, os.path.join(TOOLS, "build_articles.py")], ROOT)

    if items_of(open(lib, encoding="utf8").read()) == items_of(old_lib):
        # Nothing new: put the old file back so its build date (and the sitemap
        # dates derived from it) don't change and no commit is made.
        open(lib, "w", encoding="utf8", newline="\n").write(old_lib)
        print("[refresh] no new library items")
    else:
        print("[refresh] library changed")

    run([PY, os.path.join(TOOLS, "build_featured.py")], ROOT)
    run([PY, os.path.join(TOOLS, "build_sitemap.py")], ROOT)

    for scratch in ("library_items.json",):
        p = os.path.join(TOOLS, scratch)
        if os.path.exists(p):
            os.remove(p)


if __name__ == "__main__":
    main()
