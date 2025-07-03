const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

async function getFeedManually() {
  try {
    // Get your user ID
    const user = await twitterClient.v2.me();
    const myUserId = user.data.id;

    // Get list of people you follow (up to 1000)
    const following = await twitterClient.v2.following(myUserId, { max_results: 1000 });

    const followedUserIds = following.data?.map(user => user.id);

    if (!followedUserIds || followedUserIds.length === 0) {
      console.log("You are not following anyone.");
      return;
    }

    // Fetch recent tweets from all followed users (batch by batch)
    // Note: Twitter API limits how many calls you can make — be mindful

    let allTweets = [];

    for (const followedUserId of followedUserIds) {
      // Get their latest 5 tweets (adjust as needed)
      const tweets = await twitterClient.v2.userTimeline(followedUserId, {
        max_results: 5,
        "tweet.fields": "id,text,author_id,created_at",
      });

      if (tweets.data?.data) {
        allTweets = allTweets.concat(tweets.data.data);
      }
    }

    if (allTweets.length === 0) {
      console.log("No tweets found from people you follow.");
      return;
    }

    // Sort allTweets by created_at descending to simulate feed order
    allTweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Pick the third tweet from this combined feed
    if (allTweets.length < 3) {
      console.log("Less than 3 tweets found in your manual feed.");
      return;
    }

    const thirdTweet = allTweets[2];

    // Check if it's not your tweet
    if (thirdTweet.author_id === myUserId) {
      console.log("The third tweet in your feed is yours, skipping reply.");
      return;
    }

    // Reply to it
    const comment = "🔥 Shoutout to the third tweet in my manual feed!";
    await twitterClient.v2.reply(comment, thirdTweet.id);
    console.log(`Replied to tweet ID ${thirdTweet.id} successfully.`);
  } catch (error) {
    console.error("Error fetching manual feed or replying:", error);
  }
}

getFeedManually();

/*
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

async function replyToFirstFeedTweet() {
  try {
    // Get the home timeline (your feed), default max 20 tweets
    const feedTweets = await twitterClient.v2.homeTimeline({
      max_results: 5,          // fetch 5 tweets to be safe
      "tweet.fields": "id,text,author_id",
    });

    const firstTweet = feedTweets.data?.data?.[2];

    if (!firstTweet) {
      console.log("No tweets found in your feed.");
      return;
    }

    const tweetId = firstTweet.id;
    const comment = "🔥 Nice post! Just dropping some love from the big guyyz.";

    // Reply to the tweet
    await twitterClient.v2.reply(comment, tweetId);
    console.log(`Replied to feed tweet ID ${tweetId} successfully.`);
  } catch (error) {
    console.error("Error replying to feed tweet:", error);
  }
}

replyToFirstFeedTweet();


/*
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

// Authenticate with Twitter API
const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

// Main function
async function replyToFirstTweet() {
  try {
    // Get your own tweets (latest 5 just in case)
    const user = await twitterClient.v2.me();
    const userId = user.data.id;

    const tweets = await twitterClient.v2.userTimeline(userId, {
      max_results: 5,
      "tweet.fields": "id,text",
    });

    const firstTweet = tweets.data?.data?.[0]; // First tweet in the timeline

    if (!firstTweet) {
      console.log("No tweets found on your timeline.");
      return;
    }

    const tweetId = firstTweet.id;
    const comment = "🔥 That's a banger! Had to comment! #devlife";

    // Reply to the tweet
    await twitterClient.v2.reply(comment, tweetId);
    console.log(`Replied to tweet ID ${tweetId} successfully.`);
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

replyToFirstTweet();

*/
/*
// By VishwaGauravIn (https://itsvg.in)

const GenAI = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

const generationConfig = {
  maxOutputTokens: 400,
};
const genAI = new GenAI.GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig,
  });

  // Write your prompt here
  const prompt =
    "generate a web development content, tips and tricks or something new or some rant or some advice as a tweet, it should not be vague and should be unique; under 280 characters and should be plain text, you can use emojis";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  sendTweet(text);
}

//run();

async function sendTweet(tweetText) {
  try {
    await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}
sendTweet("How are you X family.");

*/
