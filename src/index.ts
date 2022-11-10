import WAWebJS, { Buttons } from 'whatsapp-web.js';
import { handleDialogflow } from './modules/dialogflow';
import client from './modules/whastapp/setup';
import { messageService, tmdbService } from './service';

client.initialize();

const validationMessage = async (msg: WAWebJS.Message): Promise<boolean> => {
  if (msg.hasMedia) return false;

  const chat = await msg.getChat();

  if (chat.isGroup) return false;

  const [phoneNumber] = msg.from.split('@');

  if (phoneNumber !== '557391628444') return false;

  return true;
};

const handleList = async (msg: WAWebJS.Message) => {
  if (!msg.selectedRowId) return;

  const movie = await tmdbService.getMovie(+msg.selectedRowId);

  const message = `*${movie.title}*\n\n${movie.overview}\n\nNota: ${movie.vote_average}`;

  await messageService.sendMediaMessage(
    tmdbService.getUrlImage(movie.poster_path),
    message,
    msg.from,
  );

  let button = new Buttons('*Ações*', [{ body: 'Onde assitir', id: movie.id.toString() }]);
  await client.sendMessage(msg.from, button);
};

const handleButton = async (msg: WAWebJS.Message) => {
  if (!msg.selectedButtonId) return;

  const movie = await tmdbService.getProviders(+msg.selectedButtonId);

  if (!movie.results || !movie.results.BR) {
    await client.sendMessage(
      msg.from,
      'Este filme não está disponível em nenhum serviço de streaming ou alugel',
    );
    return;
  }

  const flatrate = movie.results.BR.flatrate?.map((provider) => `${provider.provider_name} `);

  const buy = movie.results.BR.buy?.map((provider) => `${provider.provider_name} `);

  const rent = movie.results.BR.rent?.map((provider) => `${provider.provider_name} `);

  let message = '';

  if (flatrate)
    message = `
  *Disponível para streaming em:* 
  \n${flatrate}
  `;

  if (buy)
    message = `
    \n\n
  *Disponível para compra em:*
  \n${buy}
  `;

  if (rent)
    message = `
    \n\n
  *Disponível para aluguel em:*
  \n${rent}
  `;

  client.sendMessage(msg.from, message);
};

client.on('message', async (msg) => {
  console.log(msg);

  // check if message is media
  const validation = await validationMessage(msg);

  if (!validation) return;

  if (msg.selectedRowId) {
    await handleList(msg);
    return;
  }

  if (msg.selectedButtonId) {
    await handleButton(msg);
    return;
  }

  await handleDialogflow({
    message: msg.body,
    phone: msg.from,
  });
});
