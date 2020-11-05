const express = require('express')
// will use this later to send requests
const http = require('http')
// import env variables
require('dotenv').config()

const app = express()
const port = process.env.PORT || 8200

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.status(200).send('Server is working.')
})

app.listen(port, () => {
	console.log(`🌏 Server is running at http://localhost:${port}`)
})

/** various function called by the swicth case come here **/

function buzzWordHandler(req, res, next) {
	
	console.log('inside buzzword handler function');
	
	
	
	const reqUrl = encodeURI(
		`http://corporatebs-generator.sameerkumar.website/`
	)
	
	console.log(reqUrl);
	
	let dataToSend ='Welcome to buzz word!';

return res.json({
					fulfillmentText: dataToSend,
					source: 'getmovie'
				})
    

/*
	http.get(
		reqUrl,
		responseFromAPI => {
			let completeResponse = ''
			responseFromAPI.on('data', chunk => {
				completeResponse += chunk
			})
			responseFromAPI.on('end', () => {
				
				console.log('response come here!');
				console.log(completeResponse);		
				
				let dataToSend = movieToSearch
				dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${
					movie.Director
				} and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}.
                }`

				return res.json({
					fulfillmentText: dataToSend,
					source: 'getmovie'
				})

				
			
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'buzzword'
			})
		}
	)
	
	*/

}

function addNewIdeaWithName(req, res, next) {
	console.log('inside Add New Idea With Name');
    var payloadSlack = {
        "payload": {
            "slack": {
                "text": "Note: Idea has changed...",
                "attachments": [{
                    "text": "Idea has been replaced with a slash command and is accessable by typing\n/idea",
                    "fallback": "Idea has been replaced with a slash command and is accessable by typing\n/idea",
                    "color": "#3AA3E3",
                    "attachment_type": "default",

                }]
            },
            "outputContexts": [{
                "name": "projects/${PROJECT_ID}/agt/sessions/${SESSION_ID}/contexts/JIRA-NewIdea"
            }]
        }
    };
    res.send(payloadSlack);
}



app.post('/',(req, res,next) => {
	//console.log('post called!');
	var intentName = req.body.queryResult.intent.displayName;
	//console.log('ideas called');
	
	console.log(intentName);
	console.log(req.body);
	
	/*
	try {
        logRequests(req.body.queryResult.queryText, req.body.originalDetectIntentRequest.payload.data.event.user, req.body.originalDetectIntentRequest.payload.data.event.ts, intentName, req.body.originalDetectIntentRequest.payload.data.event.channel);
    } catch (logError) {
        console.log("error saving request: " + logError);
    }
	*/
	
	try {
		  switch (intentName) {
		     case "JIRA-NewIdea":
                // add new JIRA idea to Intake sprint
                //addNewIdeaWithOutName(req, res, next);
                addNewIdeaWithName(req, res, next);
                break;
    		 case "getmovie":
                getmovie(req,res,next);
				break;
			case "BuzzWord":
                // corporate buzz word generator
                buzzWordHandler(req, res, next);
                break;				
			default:
                logError("Unable to match intent. Received: " + intentName, req.body.originalDetectIntentRequest.payload.data.event.user, 'UNKNOWN', 'IDEA POST CALL');

                res.send("Your request wasn't found and has been logged. Thank you!");
                break;
		  }
	} catch (err) {
        console.log(err);
        res.send(err);
    }
	
	
});


function getmovie(req,res,next){
	const movieToSearch =req.body.queryResult.parameters.movie;
	console.log('movie name come here!');
	console.log(movieToSearch);	

	const reqUrl = encodeURI(
		`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${process.env.API_KEY}`
	)
	
	console.log(reqUrl);
	
	http.get(
		reqUrl,
		responseFromAPI => {
			let completeResponse = ''
			responseFromAPI.on('data', chunk => {
				completeResponse += chunk
			})
			responseFromAPI.on('end', () => {
				const movie = JSON.parse(completeResponse)

				let dataToSend = movieToSearch
				dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${
					movie.Director
				} and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}.
                }`

				return res.json({
					fulfillmentText: dataToSend,
					source: 'getmovie'
				})
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'getmovie'
			})
		}
	)
	
}

/** call to the movie api call to get the movie information 


app.post('/getmovie', (req, res) => {
	
	console.log(req.body);
	
	/*
	const movieToSearch =
		req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie
			? req.body.result.parameters.movie
			: ''; 
		
		
	const movieToSearch =req.body.queryResult.parameters.movie;
	console.log('movie name come here!');
	console.log(movieToSearch);	

	const reqUrl = encodeURI(
		`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${process.env.API_KEY}`
	)
	
	console.log(reqUrl);
	
	http.get(
		reqUrl,
		responseFromAPI => {
			let completeResponse = ''
			responseFromAPI.on('data', chunk => {
				completeResponse += chunk
			})
			responseFromAPI.on('end', () => {
				const movie = JSON.parse(completeResponse)

				let dataToSend = movieToSearch
				dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${
					movie.Director
				} and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}.
                }`

				return res.json({
					fulfillmentText: dataToSend,
					source: 'getmovie'
				})
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'getmovie'
			})
		}
	)
});
*/
