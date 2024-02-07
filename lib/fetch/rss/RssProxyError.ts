class RssProxyError extends Error {
  public url: string;

  constructor(message: string, url: string) {
    super(message);
    this.name = 'RssProxyError';
    this.message = message;
    this.url = url;
  }
}

export default RssProxyError;
