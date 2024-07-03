export type UnsplashImage = {
  id: string
  small: string
  fullLink: string
  alt: string
}

const PER_PAGE = 30;

const apiProvider = {
  async retrieveImages(query: string, page?: number) {
    const res = await fetch(`https://api.unsplash.com/search/photos?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&query=${query}&page=${page || 1}&per_page=${PER_PAGE}&lang=ru`)
    const data = await res.json();
    return {
      images: data.results.map(res => ({
        id: res.id,
        small: res.urls.thumb,
        fullLink: res.urls.full,
        alt: res.alt_description
      }) as UnsplashImage[]),
      total: data.total,
      totalPages: data.total_pages,
      imgsPerPage: PER_PAGE,
      currentPage: page,
    }
  }
}

export default apiProvider;