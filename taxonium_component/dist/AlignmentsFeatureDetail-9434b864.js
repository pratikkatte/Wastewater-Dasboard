import e, { useState as g } from "react";
import { t as w, Y as l, T as R, a0 as k, Z as y, F as P, s as T, C as F, q as M, o as O, V as x, P as A, y as B } from "./index-76f6c0d4.js";
import "react-dom";
function Q(n, t) {
  var a;
  return ((a = t.tags) === null || a === void 0 ? void 0 : a[n]) || t[n];
}
async function b(n, t) {
  const a = w.getSession(t), { view: r } = t;
  try {
    if (r)
      await r.navToLocString(n);
    else
      throw new Error("No view associated with this view anymore");
  } catch (i) {
    console.error(i), a.notify(`${i}`);
  }
}
function L(n) {
  const { tag: t, model: a } = n;
  return e.createElement(
    l.BaseCard,
    { ...n, title: "Supplementary alignments" },
    e.createElement(R, null, "List of supplementary alignment locations"),
    e.createElement("ul", null, t.split(";").filter((r) => !!r).map((r, i) => {
      const [o, s, c, C] = r.split(","), d = k(C), m = Math.floor(d / 5), u = +s, p = +s + d, f = `${o}:${Math.max(1, u - m)}-${p + m}`, S = u.toLocaleString("en-US"), q = p.toLocaleString("en-US"), E = `${o}:${S}-${q} (${c}) [${d}bp]`;
      return e.createElement(
        "li",
        { key: `${f}-${i}` },
        e.createElement(y, { onClick: async (v) => {
          v.preventDefault(), b(f, a);
        }, href: "#" }, E)
      );
    }))
  );
}
const $ = M()({
  compact: {
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0
  }
}), N = [
  "read paired",
  "read mapped in proper pair",
  "read unmapped",
  "mate unmapped",
  "read reverse strand",
  "mate reverse strand",
  "first in pair",
  "second in pair",
  "not primary alignment",
  "read fails platform/vendor quality checks",
  "read is PCR or optical duplicate",
  "supplementary alignment"
];
function D(n) {
  const { classes: t } = $(), { feature: a } = n, { flags: r } = a;
  return e.createElement(
    l.BaseCard,
    { ...n, title: "Flags" },
    e.createElement(l.SimpleValue, { name: "Flag", value: r }),
    e.createElement(P, null, N.map((i, o) => {
      const s = r & 1 << o, c = `${i}_${s}`;
      return e.createElement(T, { key: c, control: e.createElement(F, { className: t.compact, checked: !!s, name: i, readOnly: !0 }), label: i });
    }))
  );
}
const G = ["clipPos", "flags"], h = {
  AM: "The smallest template-independent mapping quality in the template",
  AS: "Alignment score generated by aligner",
  BC: "Barcode sequence identifying the sample",
  BQ: "Offset to base alignment quality (BAQ)",
  BZ: "Phred quality of the unique molecular barcode bases in the {OX} tag",
  CB: "Cell identifier",
  CC: "Reference name of the next hit",
  CM: "Edit distance between the color sequence and the color reference (see also {NM})",
  CO: "Free-text comments",
  CP: "Leftmost coordinate of the next hit",
  CQ: "Color read base qualities",
  CR: "Cellular barcode sequence bases (uncorrected)",
  CS: "Color read sequence",
  CT: "Complete read annotation tag, used for consensus annotation dummy features",
  CY: "Phred quality of the cellular barcode sequence in the {CR} tag",
  E2: "The 2nd most likely base calls",
  FI: "The index of segment in the template",
  FS: "Segment suffix",
  FZ: "Flow signal intensities",
  GC: "Reserved for backwards compatibility reasons",
  GQ: "Reserved for backwards compatibility reasons",
  GS: "Reserved for backwards compatibility reasons",
  H0: "Number of perfect hits",
  H1: "Number of 1-difference hits (see also {NM})",
  H2: "Number of 2-difference hits",
  HI: "Query hit index",
  IH: "Query hit total count",
  LB: "Library",
  MC: "CIGAR string for mate/next segment",
  MD: "String encoding mismatched and deleted reference bases",
  MF: "Reserved for backwards compatibility reasons",
  MI: "Molecular identifier; a string that uniquely identifies the molecule from which the record was derived",
  ML: "Base modification probabilities",
  MM: "Base modifications / methylation ",
  MQ: "Mapping quality of the mate/next segment",
  NH: "Number of reported alignments that contain the query in the current record",
  NM: "Edit distance to the reference",
  OA: "Original alignment",
  OC: "Original CIGAR (deprecated; use {OA} instead)",
  OP: "Original mapping position (deprecated; use {OA} instead)",
  OQ: "Original base quality",
  OX: "Original unique molecular barcode bases",
  PG: "Program",
  PQ: "Phred likelihood of the template",
  PT: "Read annotations for parts of the padded read sequence",
  PU: "Platform unit",
  Q2: "Phred quality of the mate/next segment sequence in the {R2} tag",
  QT: "Phred quality of the sample barcode sequence in the {BC} tag",
  QX: "Quality score of the unique molecular identifier in the {RX} tag",
  R2: "Sequence of the mate/next segment in the template",
  RG: "Read group",
  RT: "Reserved for backwards compatibility reasons",
  RX: "Sequence bases of the (possibly corrected) unique molecular identifier",
  S2: "Reserved for backwards compatibility reasons",
  SA: "Other canonical alignments in a chimeric alignment",
  SM: "Template-independent mapping quality",
  SQ: "Reserved for backwards compatibility reasons",
  TC: "The number of segments in the template",
  TS: "Transcript strand",
  U2: "Phred probability of the 2nd call being wrong conditional on the best being wrong",
  UQ: "Phred likelihood of the segment, conditional on the mapping being correct"
};
function H({ value: n }) {
  const [t, a] = g(!1), [r, i] = g(!1), o = String(n);
  return o.length > 100 ? e.createElement(
    e.Fragment,
    null,
    e.createElement("button", { type: "button", onClick: () => {
      B(o), i(!0), setTimeout(() => i(!1), 700);
    } }, r ? "Copied to clipboard" : "Copy"),
    e.createElement("button", { type: "button", onClick: () => a((s) => !s) }, t ? "Show less" : "Show more"),
    e.createElement("div", null, t ? o : `${o.slice(0, 100)}...`)
  ) : e.createElement("div", null, o);
}
function I({ locString: n, model: t }) {
  return e.createElement(y, { onClick: (a) => {
    a.preventDefault(), b(n, t);
  }, href: "#" }, n);
}
const Z = O(function(t) {
  const { model: a } = t, r = x(a.featureData), i = Q("SA", r);
  return e.createElement(
    A,
    { "data-testid": "alignment-side-drawer" },
    e.createElement(l.FeatureDetails, {
      ...t,
      omit: G,
      // @ts-expect-error
      descriptions: { ...h, tags: h },
      feature: r,
      formatter: (o, s) => s === "next_segment_position" ? e.createElement(I, { model: a, locString: o }) : e.createElement(H, { value: o })
    }),
    i ? e.createElement(L, { model: a, tag: i }) : null,
    r.flags !== void 0 ? e.createElement(D, { feature: r, ...t }) : null
  );
});
export {
  Z as default
};