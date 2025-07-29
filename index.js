import { initialTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsData = []

const storedTweetsData = localStorage.getItem('tweets')

if (storedTweetsData){
    tweetsData = JSON.parse(storedTweetsData)
} else {
    tweetsData = initialTweetsData
}



document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    localStorage.setItem('tweets', JSON.stringify(tweetsData))
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem('tweets', JSON.stringify(tweetsData))
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

    const targetTweetObj = tweetsData.filter(function(tweet) {
        return tweet.uuid === replyId
    })[0]

    if(targetTweetObj){
        targetTweetObj.isReplyVisible = !targetTweetObj.isReplyVisible
    }
    localStorage.setItem('tweets', JSON.stringify(tweetsData))
    render()
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        localStorage.setItem('tweets', JSON.stringify(tweetsData))
        render()
        tweetInput.value = ''
    }

}

function handleReplyBtnClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    const replyInput = document.getElementById(`reply-input-${targetTweetObj.uuid}`)
    
    if(replyInput.value){
        targetTweetObj.replies.push({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value,
        })
        targetTweetObj.isReplyVisible = true
        localStorage.setItem('tweets', JSON.stringify(tweetsData))
        render()
        replyInput.value = ''
    }

}



function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesDivClass = 'hidden'

        if(tweet.isReplyVisible){
            repliesDivClass = ''
        }

        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="${repliesDivClass}" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div class="reply-input-area">
			<img src="images/scrimbalogo.png" class="profile-pic">
			<textarea placeholder="Post your reply" class='reply-input' id="reply-input-${tweet.uuid}" data-reply-input="${tweet.uuid}"></textarea>
		</div>
		<button class='reply-btn' id="reply-btn-${tweet.uuid}" data-reply-btn="${tweet.uuid}">Reply</button>
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

