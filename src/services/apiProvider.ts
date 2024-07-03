export type UnsplashImage = {
  id: string
  small: string
  fullLink: string
  alt: string
}

const apiProvider = {
  async retrieveImages(query: string, page?: number) {
    const res = await fetch(`https://api.unsplash.com/search/photos?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&query=${query}&page=${page || 1}&per_page=30&lang=ru`)
    const data = await res.json();
    return data.results.map(res => ({
      id: res.id,
      small: res.urls.thumb,
      fullLink: res.urls.full,
      alt: res.alt_description
    }) as UnsplashImage[])
  }
}

export default apiProvider;