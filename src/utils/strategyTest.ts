
enum NETERRORS {ABORTERROR, OTHERERROR}
export type ResultType = {host: string; status: undefined | number};

enum Discord {
  Main = "https://discord.com",
  Gateway = "https://gateway.discord.gg",
  CDN = "https://cdn.discordapp.com",
  Updates = "https://updates.discord.com"
}
enum YT {
  Web = "https://www.youtube.com",
  Short = "https://youtu.be",
  Image = "https://i.ytimg.com",
  VideoRedirect = "https://redirector.googlevideo.com"
}
enum Google {Main = "https://www.google.com", Gstatic = "https://www.gstatic.com"}
enum Cloudflare {Web = "https://www.cloudflare.com", CDN = "https://cdnjs.cloudflare.com"}

export {NETERRORS, Discord, YT, Google, Cloudflare}

export const strategyTest = async () => {
  const createFetch = async (host: string) => {
    const requestController = new AbortController();
    const signal = requestController.signal;
    const result: ResultType = {host, status: undefined};
    const timeoutId = setTimeout(() => requestController.abort(), 7000);
    try {
      const response = await fetch(host, {signal, method: "HEAD"});
      result.status = response.status;
    } catch (ex) {
      if ((ex as {name: string}).name == "AbortError") result.status = NETERRORS.ABORTERROR;
      else result.status = NETERRORS.OTHERERROR;
    }
    clearTimeout(timeoutId);
    return result;
  }
  return await Promise.all([
    Discord.Main,
    Discord.Gateway,
    Discord.CDN,
    Discord.Updates,
    YT.Web,
    YT.Short,
    YT.Image,
    YT.VideoRedirect,
    Google.Main,
    Google.Gstatic,
    Cloudflare.Web,
    Cloudflare.CDN
  ].map(host => createFetch(host)));
}