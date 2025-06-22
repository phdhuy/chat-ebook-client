export const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const mapSenderTypeToRole = (senderType: string): "user" | "bot" => {
  return senderType.toLowerCase() === "user" ? "user" : "bot";
};

export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const ALLOW_FILE_TYPES = ["application/pdf"];
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const MESSAGE_PER_PAGE = 10;
export const CONVERSATION_PER_PAGE = 15;

export const ADMIN_ROLE = "ROLE_ADMIN";
export const USER_ROLE = "ROLE_USER";

export const ALLOWED_DOMAINS = [
  "arxiv.org",
  "www.ncbi.nlm.nih.gov",
  "scholar.google.com",
  "doaj.org",
  "ndltd.org",
  "nap.nationalacademies.org",
  "www.base-search.net",
  "digital.library.upenn.edu",
  "library.harvard.edu",
  "digitalcollections.library.yale.edu",
  "lib.msu.edu",
  "earchives.lib.purdue.edu",
  "rucore.libraries.rutgers.edu",
  "library.osu.edu",
  "library.syracuse.edu",
  "library.brown.edu",
  "www.jsu.edu",
  "ota.ahds.ac.uk",
  "ocw.mit.edu",
  "digital.library.sydney.edu.au",
  "catalogue.curtin.edu.au",
  "www.ice.com",
  "www.nasdaq.com",
  "www.londonstockexchange.com",
  "www.tsx.com",
  "www.nasdaqomx.com",
  "www.euronext.com",
  "www.nsx.com.au",
  "www.six-group.com",
  "www.dbag.com",
  "www.deutsche-boerse.com",
  "www.sse.com.cn",
  "www.szse.cn",
  "www.bse.cn",
  "www.twse.com.tw",
  "www.bseindia.com",
  "www.nseindia.com",
  "global.krx.co.kr",
  "www.jpx.co.jp",
  "www.b3.com.br",
  "www.jse.co.za",
  "www.sec.gov",
  "www.uscourts.gov",
  "www.whitehouse.gov",
  "www.wto.org",
  "www.who.int",
  "www.un.org",
  "www.state.gov",
  "dodiac.dtic.mil",
  "curia.europa.eu",
  "docjax.com",
  "cnki.net",
  "pubmed.cn",
  "www.wanfangdata.com.cn",
  "so.hiqq.com.cn",
  "www.sciencedirect.com",
  "www.oalib.com",
  "www.highwirepress.com",
  "www.infox-med.com",
  "oalib.com",
  "www.researchgate.net",
  "link.springer.com",
  "onlinelibrary.wiley.com",
  "www.jstor.org",
  "pubmed.ncbi.nlm.nih.gov",
  "ieeexplore.ieee.org",
  "dl.acm.org",
  "ydzk.chineselaw.com",
  "www.buch-der-synergie.de",
  "plato.stanford.edu",
  "www.sergroup.com",
  "edisciplinas.usp.br",
  "psyarxiv.com",
  "support.castandcrew.com",
  "www.doxis.com",
  "www.biorxiv.org",
  "www.marxists.org",
  "www.tdcommons.org",
];

export const isValidDomain = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    return ALLOWED_DOMAINS.some((domain) => {
      const normalizedDomain = domain.toLowerCase();
      return (
        hostname === normalizedDomain ||
        hostname.endsWith("." + normalizedDomain.replace("www.", ""))
      );
    });
  } catch {
    return false;
  }
};
