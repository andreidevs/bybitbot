import 'dotenv/config'
import {Bot, GrammyError, HttpError, InlineKeyboard} from 'grammy'
import {hydrate} from '@grammyjs/hydrate'
import {getKztUsdtRate, getRubUsdtRate} from './bybitAPI.js'


const bot = new Bot(process.env.BOT_API_KEY)

bot.use(hydrate());

const menuKeyboard = new InlineKeyboard()
    .text('P2P Курс покупки (USDT/RUB)', 'buy_rub_rate')
    .text('P2P Курс продажи (USDT/KZT)', 'sell_kzt_rate');

const backKeyboard = new InlineKeyboard().text('< Назад в меню', 'back');

bot.command('start', async (ctx) => {
    await ctx.reply('Выберите действие', {
        reply_markup: menuKeyboard,
    });
});


bot.callbackQuery('buy_rub_rate', async (ctx) => {
    const data = await getRubUsdtRate()
    await ctx.callbackQuery.message.editText(data, {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery('Загрузка...');
});

bot.callbackQuery('sell_kzt_rate', async (ctx) => {
    const data = await getKztUsdtRate()
    await ctx.callbackQuery.message.editText(data, {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery('Загрузка...');
});

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберите пункт меню', {
        reply_markup: menuKeyboard,
    });
    await ctx.answerCallbackQuery();
});


bot.catch(({ctx, error}) => {
    console.error(`Error while handing updtae ${ctx.update.update_id}`)
    console.log("=>(index.js:50) ", error);
    if (error instanceof GrammyError) {
        console.error("Error in request:", error.description)
    } else if (error instanceof HttpError) {
        console.error("Cloud not contct telegram:", error)
    }
})

bot.start()