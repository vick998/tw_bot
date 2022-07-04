
import dotenv from 'dotenv'
dotenv.config()
// import { query } from 'express'
import express from 'express'
import request from 'request-promise'
import {TwitterApi} from 'twitter-api-v2'



let client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const query_tags1 = ['#USAUSAUSA','#thursdaymotivation','#cocacola','#kelloggs','#subway','#imlovinit']

const app = express()
// const server = app.listen(3000)



const tweety = () => {
  client.v1.userTimeline()
  .then(res => {
    const arrid = []
    res.tweets.forEach(r => {
      if(r.retweeted === true){
        arrid.push(r.retweeted_status.user.id_str)
      };
    });
    return arrid
  })
  .then(arr => {
    return client.v2.users(arr)
  })
  .then(users => {
    users.data.forEach(user => {
      console.log(`You are now following ${user.name}.`)
      return client.v2.follow(process.env.USER_ID,user.id)
      })
    })
  .then(()=>{
    console.log('Operation completed.')
  })
  .catch(err => {
    console.log(err)
  })
}

const twunfollow = () => {
  client.v2.following(process.env.USER_ID)
  .then(res => {
    res.data.forEach(user => {
      console.log(`User with id no:${user.id} has been unfollowed`)
      return client.v2.unfollow(process.env.USER_ID,user.id)
    })
  })
  .then(()=>{
    console.log('Operation completed.')
    return
  })
  .catch(err => {
    console.log(err)
  })
}

const deltweety = () => {
  client.v1.userTimeline()
  .then(res => {
    res.tweets.forEach(tweet => {
      console.log(`Tweet id no:${tweet.id_str} has been deleted`)
      return client.v2.deleteTweet(tweet.id_str)
      })
  })
  .then(()=>{
      console.log('Operation completed.')
      return
  })
  .catch(err => {
      console.log(err)
  })
}

const RTtagtweets = (query_tags) => {
  const rand = (max) => {
    return Math.floor(Math.random() * max);
  }
  query_tags.forEach(qtag => {
    return client.v2.search(qtag)
    .then(res => {
      const qtagids = []
      res.tweets.forEach(tweet => {
        qtagids.push(tweet.id)
      })
      return qtagids
    })
    .then(tagids => {
      const twid = tagids[rand(5)]
      console.log(`Retweeted tweet id no:${twid}`)
      return client.v2.retweet(String(process.env.USER_ID),String(twid))
    })
    .catch(err => {
      console.log(err)
    })
  })
}

const welcomeMsgSet = () => {
  return client.v1.newWelcomeDm('welcome1',{
    text:'Welcome, friend. I am a bot, and this is an automated message. Have a nice day, and keep your wits about you!'
  })
  .then(res => {
    return client.v1.newWelcomeDmRule(res.welcome_message.id)
  })
  .then(res => {
    console.log(res)
    return res
  })
  .catch(err => {
    console.log(err)
  })
}

const ShowWelcomeDM = () => {
  return client.v1.listWelcomeDmRules()
  .then(res => {
    return client.v1.getWelcomeDm(res.welcome_message_rules[0].welcome_message_id)
  })
  .then(res => {
    console.log(res.welcome_message.message_data.text)
    return res
  })
  .catch(err => {
    console.log(err)
  })
}

const getActAPIurl = () => {
  const details = {
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET,
    token: process.env.ACCESS_TOKEN,
    token_secret: process.env.ACCESS_TOKEN_SECRET
  }  
  let request_options = {
    url: 'https://api.twitter.com/1.1/account_activity/webhooks.json',
    oauth: details,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      url: process.env.REDIRECT_URL
    }
    }
  return request.post(request_options)
  .then(res => {
    console.log(res)
    return res
  })
  .catch(err => {
    console.log(err)
  })
}



// RTtagtweets(query_tags1)
// deltweety()
// tweety()
// twunfollow()
// welcomeMsgSet()
// ShowWelcomeDM()
getActAPIurl() 



