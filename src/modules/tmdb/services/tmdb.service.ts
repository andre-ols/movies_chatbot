export class TmdbService {
  private readonly apiBaseUrl: string;

  constructor(private readonly apiKey: string, private readonly language: string = 'pt-BR') {}

  private async get<T>(
    path: string,
    params: Record<string, string | number | boolean> = {},
  ): Promise<T> {
    const url = new URL(`${this.apiBaseUrl}${path}`);
    url.searchParams.append('language', this.language);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, String(value));
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    const result = await response.json();
    return result;
  }

  async searchMovie(
    params: Tmdb.MovieSearch.MovieSearchParams,
  ): Promise<Tmdb.MovieSearch.MovieSearchResult> {
    return this.get('/search/movie', {
      ...params,
    });
  }

  async getMovie(id: number): Promise<Tmdb.Movie> {
    return this.get(`/movie/${id}`);
  }

  async getProviders(id: number): Promise<Tmdb.MovieProviders.Root> {
    return this.get(`/movie/${id}/watch/providers`);
  }

  async playingNow(): Promise<Tmdb.PlayingNow> {
    return this.get('/movie/now_playing');
  }

  async popularMovies(): Promise<Tmdb.PopularMovies> {
    return this.get('/movie/popular');
  }

  async getMovieImages(id: number): Promise<Tmdb.MovieImages.Root> {
    return this.get(`/movie/${id}/images`);
  }

  async getUrlImage(path: string): Promise<string> {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  async discoverMovie(
    params: Tmdb.DiscoverMovie.DiscoverMovieParams,
  ): Promise<Tmdb.DiscoverMovie.DiscoverMovieResult> {
    return this.get('/discover/movie', {
      ...params,
      'release_date.gte': params.release_date_gte,
      'release_date.lte': params.release_date_lte,
    });
  }
}