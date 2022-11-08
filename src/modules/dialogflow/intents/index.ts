import { TmdbService } from '@/modules/tmdb/services/tmdb.service';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { IntentService } from '../services/intent.service';
import { config } from 'dotenv';
config();

const tmdb = new TmdbService(process.env.TMDB_API_KEY);

export const intentService = new IntentService(tmdb);

export const intentMap = new Map<
  string,
  (agent: google.cloud.dialogflow.v2.IDetectIntentResponse) => Promise<void> | void
>([
  ['Default Welcome Intent', (agent) => intentService.welcome(agent)],
  ['Default Fallback Intent', (agent) => intentService.fallback(agent)],
  ['Movie Providers', (agent) => intentService.movieProviders(agent)],
  ['Search Movie', (agent) => intentService.searchMovie(agent)],
  ['Movies in Theaters', () => intentService.moviesInTheaters()],
  ['Popular Movies', () => intentService.popularMovies()],
]);
