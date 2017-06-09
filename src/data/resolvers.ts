import * as yahooFinance from 'yahoo-finance';
import { RedisClient } from 'redis';

import { IContext } from './context';

export interface IStock {
  symbol: string
}

export interface IStockHistory {
  date: string,
  close: number
}

export interface IStockFullHistory extends IStockHistory {
  open: number,
  high: number,
  low: number,
  volume: number,
  adjClose: number,
  symbol: string
}

function makeYahooDate(offset: number = 0): string {
  const currentDate: Date = new Date;
  const year: number = currentDate.getFullYear() - offset;
  const month: number = currentDate.getMonth();
  const day: number = currentDate.getDate();

  return `${year}-${month}-${day}`
}

function redisGet(client: RedisClient, key: string): Promise<string> {
  return new Promise<string>((resolve, reject) => client.get(
    key,
    (err, res) => err ? reject(err) : resolve(res)
  ))
}

export default {
  Query: {
    stock: (_, { symbol }: IStock): IStock => ({ symbol }),
    stocks: (_, { symbols }: { symbols: string[] }): IStock[] => symbols.map(
      symbol => ({ symbol })
    )
  },
  Stock: {
    history: async ({ symbol }: IStock, _: {},
      context: Promise<IContext>): Promise<IStockHistory[]> => {
      const { client } = await context;

      const cachedHistory: string = await redisGet(client, symbol);
      if (cachedHistory) return JSON.parse(cachedHistory);

      const history = await new Promise<IStockFullHistory[]>((resolve, reject) =>
        yahooFinance.historical({
          symbol,
          from: makeYahooDate(1),
          to: makeYahooDate()
        }, function(err: Error, quotes: IStockFullHistory[]): void {
          if (err) reject(err);
          resolve(quotes)
        })
      );

      const parsedHistory = history.map(
        ({ date, close }): IStockHistory => ({ date, close })
      )

      client.set(symbol, JSON.stringify(parsedHistory), 'EX', 60);

      return parsedHistory;
    }
  }
};
