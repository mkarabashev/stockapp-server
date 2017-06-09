# This is the graphql backend for an app that shows historical stock data
## Results are taken from yahoo finance and are cached in redis for fast access

## Commands:

```gql
stocks(symbols: ["GOOGL", "AAPL"]) {
  symbol
  history {
    date
    close
  }
}
```
