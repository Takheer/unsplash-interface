export type UnsplashImage = {
  id: string
  small: string
  fullLink: string
  alt: string
}

type UnsplashResult = {
  id: string,
  urls: {
    thumb: string,
    full: string,
  }
  alt_description: string
}

type UnsplashResponse = {
  results: UnsplashResult[],
  total: number,
  total_pages: number
}

const PER_PAGE = 30;

const apiProvider = {
  async retrieveImages(query: string, page?: number) {
    const req = `https://api.unsplash.com/search/photos?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&query=${query}&page=${page || 1}&per_page=${PER_PAGE}&lang=ru`;
    console.log(req)
    const res = await fetch(req);
    const data = await res.json() as UnsplashResponse;
    return {
      images: data.results.map((res: UnsplashResult) => ({
        id: res.id,
        small: res.urls.thumb,
        fullLink: res.urls.full,
        alt: res.alt_description
      }) as UnsplashImage),
      total: data.total,
      totalPages: data.total_pages,
      imgsPerPage: PER_PAGE,
      currentPage: page,
    }
  }
}

export default apiProvider;