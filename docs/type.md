# Type

One family: **Archivo** (SIL OFL), cut for this site from the variable source in `google/fonts` (`ofl/archivo/Archivo[wdth,wght].ttf`), instanced to weight 250–600 at width 100 and subset to Latin, arrows and the maths the write-ups use: `app/fonts/archivo.woff2`. Large type (the opening sentence, project names and numbers, headlines) is set light, near 290; everything read is 400, with 500–600 for the few labels that need it.

Archivo has no Greek, so `app/fonts/serif-text.woff2` (Source Serif 4, below) stays as a backstop for γ, τ and ρ in the write-ups; the browser fetches it only on a page that prints one.

```bash
python3 -m fontTools.varLib.instancer "Archivo[wdth,wght].ttf" wght=250:600 wdth=100 -o t.ttf
pyftsubset t.ttf --unicodes="U+0020-007E,U+00A0-017F,U+0391-03A9,U+03B1-03C9,U+2013-2014,U+2018-201E,U+2020-2022,U+2026,U+2030,U+2032-2033,U+2039-203A,U+2070-209F,U+20AC,U+2190-2199,U+2206,U+2212,U+2215,U+221E,U+2229,U+2248,U+2260,U+2264-2265" \
  --layout-features="kern,liga,clig,calt,ccmp,locl,mark,mkmk,lnum,onum,tnum,pnum,case,ss01,ss02,zero,frac,sups" --flavor=woff2 --output-file=archivo.woff2
```

`serif-text.woff2` is Source Serif 4 (SIL OFL), instanced at weight 380–620, optical size 17, and subset to the same ranges plus Greek.
