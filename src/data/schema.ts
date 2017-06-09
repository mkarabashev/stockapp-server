const schema: string = `
  type Stock {
    symbol: String
    history: [StockHistory]
  }

  type StockHistory {
    date: String
    close: Int
  }

  type Query {
    stock(symbol: String): Stock
    stocks(symbols: [String]): [Stock]
  }

`

export default schema;
