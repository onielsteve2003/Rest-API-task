const express = require('express')
const app = express();

const cors = require('cors')
const { nanoid } = require('nanoid')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Array of URLS
Urls = [
	
]

// Add URls
const addUrl = (url, shortcode) => {
	Urls.push({ url, shortcode: shortcode.toLowerCase(), date: new Date, timesClicked: 0, lastAccessed: "" })
}

// GET URLS BY Shortcode
const getUrl = (shortcode) => Urls.filter(url => url.shortcode == shortcode)

// Get URL by URL string
const getUrlString = (urlValue) => urlToSend = Urls.filter(url => url.url == urlValue.toLowerCase());

// Update visited count
const updateTimesClick = (shortcode) => {
	const index = Urls.findIndex(element => {
		if (element.shortcode == shortcode.toLowerCase()) return true
		return false;
	});
	Urls[index].timesClicked = Urls[index].timesClicked + 1;
}

// update accessed time
const updateTImeAccessed = (shortcode) => {
	const index = Urls.findIndex(element => {
		if (element.shortcode == shortcode.toLowerCase()) return true;
		return false;
	});
	Urls[index].lastAccessed = new Date();
}

// Add NEW URL
app.post('/submit', (req, res) => {
	const { url } = req.body;
	if(req.body.shortcode) {
		if(getUrlString(url)[0] || getUrl(req.body.shortcode)[0]) {
			res.status(403).json({ error: "Shortcode or URL already exists" })
		} else {
			if(req.body.shortcode.length < 4) res.status(400).json({ msg: "Shortcode too short!" });
			else {	
				addUrl(url, req.body.shortcode)
				res.json({  msg: "Url addded!", shortcode: req.body.shortcode })		
			}
		}
	} else {
		if(getUrlString(url)[0]) {
			res.status(403).json({ error: "URL String already exists" })
		} else {
			// Generate a short code
			const shortcode = nanoid(6);
			addUrl(url, shortcode)
			res.json({url, shortcode})
		}
	}
})

// Redirect a user to the original URL route
app.get('/url/:shortcode', (req, res) => {
	if(getUrl(req.params.shortcode)[0]) {
		updateTimesClick(req.params.shortcode)
		updateTImeAccessed(req.params.shortcode)
		res.send(`/${getUrl(req.params.shortcode)[0].url}`);
	} else {
		res.status(400).json({ error: "Shortcode not found" })
	}
})

// GET STATS
app.get('/:shortcode/stats', (req, res) => {
	if(getUrl(req.params.shortcode)[0]) {
		const url = getUrl(req.params.shortcode)[0];
		const stats = {
			date: url.date,
			lastAccessed: url.lastAccessed,
			timeClicked: url.timesClicked,
		}

		res.status(200).json(stats)
	} else {
		res.status(400).json({ error: "Shortcode not found" })
	}
})

app.listen(5000, () => {
	console.log(`Server running on port 5000`)
})