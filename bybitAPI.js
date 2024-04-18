import axios from 'axios'
import _ from 'lodash'

export async function getRubUsdtRate() {
    const params = {
        "userId": "",
        "tokenId": "USDT",
        "currencyId": "RUB",
        "payment": ["582"],
        "side": "1",
        "size": "10",
        "page": "1",
        "amount": "250000",
        "authMaker": false,
        "canTrade": false
    }

    const data = await req(params)

    return _.take(data, 1)[0].price
}

export async function getKztUsdtRate() {
    const params = {
        "userId": "",
        "tokenId": "USDT",
        "currencyId": "KZT",
        "payment": ["150"],
        "side": "0",
        "size": "10",
        "page": "1",
        "amount": "1200000",
        "authMaker": false,
        "canTrade": false
    }

    const data = await req(params)
    return _.take(data, 1)[0].price
}


async function req(params) {
    const url = "https://api2.bybit.com/fiat/otc/item/online"
    const {data} = await axios.post(url, params)
    return data.result.items
}