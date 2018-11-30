const request = require('sync-request');

class Player {
  static get VERSION() {
    return '0.1';
  }

  static async getRank(gameState) {
    let cards = gameState.community_cards.concat(gameState.players[gameState.in_action].hole_cards);
    console.log(cards);
    try {
      let res = request('GET', 'http://rainman.leanpoker.org/rank?cards='+JSON.stringify(cards));
      let a = JSON.parse(res.getBody('utf-8'));
      return 0 + a.rank;
    } catch (e) {
      console.error(e);
    }
    return 0;
  }

  static play(gameState) {
    if (gameState.community_cards.length < 6) {
      let player = gameState.players[gameState.in_action];
      let cards = player.hole_cards;
      if (this.toValue(cards[0]) > 10 || this.toValue(cards[1]) > 10) {
        return true;
      }
    }
    else {
      return this.getRank(gameState);
    }
    return false;
  }

  static toValue(card) {
    if (card.rank === "J") {
      return 11;
    }
    else if (card.rank === "Q") {
      return 12;
    }
    else if (card.rank === "K") {
      return 13;
    }
    else if (card.rank === "A") {
      return 14;
    }
    return 0 + card.rank;
  }

  static betRequest(gameState, bet) {
    if (this.play(gameState)) {
      bet(gameState.current_buy_in);
    } else {
      bet(0);
    }
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
