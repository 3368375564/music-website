/**
 * Vercel Serverless 代理接口
 * 接收 ?url=<target> 参数，转发请求并返回 HTML
 * 解决 HTTPS 站点无法请求 HTTP 资源的混合内容问题
 */
export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("缺少 url 参数");
  }

  try {
    const response = await fetch(decodeURIComponent(targetUrl), {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send(`目标站点返回: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // 设置 CORS 头，允许任何来源调用
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send(`代理请求失败: ${err.message}`);
  }
}
