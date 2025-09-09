import type { APIRoute } from "astro";
export const prerender = false;
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    results: [
      { id: 1, title: "Market overview: BTC & ETH", url: "https://www.coindesk.com/markets/", domain: "CoinDesk" }
    ]
  }), { headers: { "content-type": "application/json" } });
};
