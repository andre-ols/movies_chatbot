import { TmdbService } from '@/modules/tmdb/services/tmdb.service';
import { google } from '@google-cloud/dialogflow/build/protos/protos';

export class IntentService {
  constructor(private tmdb: TmdbService) {}

  public welcome(agent: google.cloud.dialogflow.v2.IDetectIntentResponse) {
    console.log(agent.queryResult.fulfillmentText);
  }

  fallback(agent: google.cloud.dialogflow.v2.IDetectIntentResponse) {
    console.log(agent.queryResult.fulfillmentText);
  }

  async searchMovie(agent: google.cloud.dialogflow.v2.IDetectIntentResponse) {
    const title = agent.queryResult.parameters.fields.movie.stringValue;
    const movie = await this.tmdb.searchMovie({ query: title });

    console.log({
      title: movie.results[0].title,
      overview: movie.results[0].overview,
    });
  }

  async movieProviders(agent: google.cloud.dialogflow.v2.IDetectIntentResponse) {
    const title = agent.queryResult.outputContexts[0].parameters.fields.movie.stringValue;

    const movie = await this.tmdb.searchMovie({ query: title });
    const providers = await this.tmdb.getProviders(movie.results[0].id);

    console.log({
      title: movie.results[0].title,
      providers: providers.results.BR.flatrate,
    });
  }

  async moviesInTheaters() {
    const movies = await this.tmdb.playingNow();

    console.log(movies);
  }

  async popularMovies() {
    const movies = await this.tmdb.popularMovies();

    console.log(movies);
  }
}
