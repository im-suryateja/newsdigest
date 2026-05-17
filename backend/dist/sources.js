// ── Source Configuration ────────────────────────────────────────────────────
// Edit this file to add, remove, or change trusted news sources.
// No other code changes are needed — the rest of the app reads from here.
// ── REGIONS ──────────────────────────────────────────────────────────────────
export const REGIONS = {
    us: {
        label: 'United States',
        flag: '🇺🇸',
        sources: [
            'the-washington-post',
            'the-new-york-times',
            'reuters',
            'associated-press',
            'npr',
            'bloomberg',
            'the-wall-street-journal',
        ],
        domains: [
            'washingtonpost.com',
            'nytimes.com',
            'reuters.com',
            'apnews.com',
            'npr.org',
            'bloomberg.com',
            'wsj.com',
        ],
        searchKeywords: ['United States', 'US', 'America', 'Washington DC'],
        stockSymbols: [
            'AAPL', // Apple
            'MSFT', // Microsoft
            'NVDA', // Nvidia
            'GOOGL', // Alphabet
            'AMZN', // Amazon
            'META', // Meta
            'TSLA', // Tesla
            'BRK-B', // Berkshire Hathaway
            'JPM', // JPMorgan Chase
            'V', // Visa
        ],
    },
    india: {
        label: 'India',
        flag: '🇮🇳',
        sources: [],
        domains: [
            'timesofindia.indiatimes.com',
            'thehindu.com',
            'hindustantimes.com',
            'ndtv.com',
            'livemint.com',
            'business-standard.com',
        ],
        searchKeywords: ['India', 'Indian', 'Mumbai', 'Delhi', 'Bangalore'],
        stockSymbols: [
            'RELIANCE.NS', // Reliance Industries
            'TCS.NS', // Tata Consultancy Services
            'HDFCBANK.NS', // HDFC Bank
            'INFY.NS', // Infosys
            'ICICIBANK.NS', // ICICI Bank
            'HINDUNILVR.NS', // Hindustan Unilever
            'SBIN.NS', // State Bank of India
            'BHARTIARTL.NS', // Bharti Airtel
            'KOTAKBANK.NS', // Kotak Mahindra Bank
            'ITC.NS', // ITC
        ],
    },
    china: {
        label: 'China',
        flag: '🇨🇳',
        sources: [],
        domains: [
            'scmp.com',
            'reuters.com',
            'bloomberg.com',
            'bbc.com',
        ],
        searchKeywords: ['China', 'Chinese', 'Beijing', 'Shanghai', 'Shenzhen'],
        stockSymbols: [
            '0700.HK', // Tencent
            'BABA', // Alibaba
            '9988.HK', // Alibaba HK
            'PDD', // PDD Holdings
            'BIDU', // Baidu
            'NIO', // NIO
            '0939.HK', // China Construction Bank
            '1398.HK', // ICBC
            'JD', // JD.com
            'XPEV', // XPeng
        ],
    },
    europe: {
        label: 'Europe',
        flag: '🇪🇺',
        sources: [
            'bbc-news',
            'the-guardian-uk',
            'reuters',
            'the-economist',
            'financial-times',
        ],
        domains: [
            'bbc.com',
            'theguardian.com',
            'reuters.com',
            'economist.com',
            'ft.com',
            'dw.com',
            'euronews.com',
        ],
        searchKeywords: ['Europe', 'European Union', 'EU', 'UK', 'Britain', 'Germany', 'France'],
        stockSymbols: [
            'ASML', // ASML Holding
            'SAP', // SAP
            'NVO', // Novo Nordisk
            'SHEL', // Shell
            'UL', // Unilever
            'LVMUY', // LVMH
            'SIE.DE', // Siemens
            'AZN', // AstraZeneca
            'HSBC', // HSBC
            'RIO', // Rio Tinto
        ],
    },
    australia: {
        label: 'Australia',
        flag: '🇦🇺',
        sources: [],
        domains: [
            'abc.net.au',
            'smh.com.au',
            'theaustralian.com.au',
            'afr.com',
            'reuters.com',
        ],
        searchKeywords: ['Australia', 'Australian', 'Sydney', 'Melbourne', 'Canberra'],
        stockSymbols: [
            'BHP.AX', // BHP Group
            'CBA.AX', // Commonwealth Bank
            'CSL.AX', // CSL
            'NAB.AX', // National Australia Bank
            'WBC.AX', // Westpac
            'ANZ.AX', // ANZ Bank
            'WES.AX', // Wesfarmers
            'MQG.AX', // Macquarie Group
            'RIO.AX', // Rio Tinto
            'TLS.AX', // Telstra
        ],
    },
    global: {
        label: 'Global',
        flag: '🌍',
        sources: [
            'reuters',
            'associated-press',
            'bloomberg',
            'the-economist',
        ],
        domains: [
            'reuters.com',
            'apnews.com',
            'bloomberg.com',
            'economist.com',
            'bbc.com',
        ],
        searchKeywords: ['world', 'global', 'international', 'United Nations'],
        stockSymbols: [
            'GLD', // Gold ETF
            'USO', // Oil ETF
            'BTC-USD', // Bitcoin
            'ETH-USD', // Ethereum
            '^GSPC', // S&P 500
            '^DJI', // Dow Jones
            '^IXIC', // NASDAQ
            '^FTSE', // FTSE 100
            '^N225', // Nikkei 225
            '^HSI', // Hang Seng
        ],
    },
};
// ── CATEGORIES ────────────────────────────────────────────────────────────────
export const CATEGORIES = {
    'technology': {
        label: 'Technology',
        icon: '💻',
        newsApiQuery: 'technology innovation software hardware',
    },
    'artificial-intelligence': {
        label: 'Artificial Intelligence',
        icon: '🤖',
        newsApiQuery: 'artificial intelligence machine learning AI',
    },
    'business-markets': {
        label: 'Business & Markets',
        icon: '📈',
        newsApiQuery: 'business markets economy corporate earnings',
    },
    'real-estate': {
        label: 'Real Estate',
        icon: '🏢',
        newsApiQuery: 'real estate property housing market',
    },
    'science-research': {
        label: 'Science & Research',
        icon: '🔬',
        newsApiQuery: 'science research breakthrough discovery',
    },
    'climate-environment': {
        label: 'Climate & Environment',
        icon: '🌿',
        newsApiQuery: 'climate change environment sustainability',
    },
    'energy': {
        label: 'Energy',
        icon: '⚡',
        newsApiQuery: 'energy renewable solar wind oil gas',
    },
    'biotechnology': {
        label: 'Biotechnology',
        icon: '🧬',
        newsApiQuery: 'biotechnology biotech genetics pharmaceutical',
    },
    'finance-economics': {
        label: 'Finance & Economics',
        icon: '💰',
        newsApiQuery: 'finance economics monetary policy GDP inflation',
    },
    'politics-government': {
        label: 'Politics & Government',
        icon: '🏛️',
        newsApiQuery: 'politics government policy legislation',
    },
    'startups-entrepreneurship': {
        label: 'Startups & Entrepreneurship',
        icon: '🚀',
        newsApiQuery: 'startup entrepreneurship venture capital funding',
    },
};
export const REGION_ORDER = ['us', 'india', 'china', 'europe', 'australia', 'global'];
export const CATEGORY_ORDER = [
    'technology',
    'artificial-intelligence',
    'business-markets',
    'real-estate',
    'science-research',
    'climate-environment',
    'energy',
    'biotechnology',
    'finance-economics',
    'politics-government',
    'startups-entrepreneurship',
];
