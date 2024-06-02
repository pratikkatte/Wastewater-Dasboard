import { B as h, f as u } from "./util-21224fb3.js";
import { aV as f, aZ as c, aW as g } from "./index-76f6c0d4.js";
import { T as p } from "./tabixIndexedFile-dd7f61f0.js";
import "./long-0451f434.js";
import "react";
import "react-dom";
import "./index-3b54d2c8.js";
class b extends f.BaseFeatureDataAdapter {
  constructor(t, a, e) {
    super(t, a, e);
    const s = this.getConf("bedGzLocation"), n = this.getConf(["index", "indexType"]), o = this.getConf(["index", "location"]), r = this.getConf("autoSql"), i = this.pluginManager;
    this.bed = new p({
      filehandle: c.openLocation(s, i),
      csiFilehandle: n === "CSI" ? c.openLocation(o, i) : void 0,
      tbiFilehandle: n !== "CSI" ? c.openLocation(o, i) : void 0,
      chunkCacheSize: 50 * 2 ** 20
    }), this.columnNames = this.getConf("columnNames"), this.scoreColumn = this.getConf("scoreColumn"), this.parser = new h({ autoSql: r });
  }
  async getRefNames(t = {}) {
    return this.bed.getReferenceSequenceNames(t);
  }
  async getHeader() {
    return this.bed.getHeader();
  }
  async getNames() {
    if (this.columnNames.length)
      return this.columnNames;
    const a = (await this.bed.getHeader()).split(/\n|\r\n|\r/).filter((s) => !!s), e = a[a.length - 1];
    return e != null && e.includes("	") ? e.slice(1).split("	").map((s) => s.trim()) : void 0;
  }
  getFeatures(t, a = {}) {
    return g(async (e) => {
      const s = await this.bed.getMetadata(), { columnNumbers: n } = s, o = n.ref - 1, r = n.start - 1, i = n.end - 1, l = await this.getNames();
      await this.bed.getLines(t.refName, t.start, t.end, {
        lineCallback: (d, m) => {
          e.next(u(d, o, r, i, this.scoreColumn, this.parser, `${this.id}-${m}`, l));
        },
        signal: a.signal
      }), e.complete();
    }, a.signal);
  }
  freeResources() {
  }
}
b.capabilities = ["getFeatures", "getRefNames"];
export {
  b as default
};
