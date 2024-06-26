const axios = require("axios")
const fs = require("fs")

const dbFile = `${__dirname}/../docs/collectives.json`
const THRESHOLD = 10
const GRACE_TIME = 2000
let issueList = []

updateCollectiveDb()

async function updateCollectiveDb() {
  const fileContent = fs.readFileSync(dbFile, "utf-8")
  const collectives = JSON.parse(fileContent).sort((a, b) => a.issue - b.issue)
  let latestIssue = collectives[collectives.length - 1].issue

  // [[url, number]]
  issueList = await getIssueList()

  let pendingIssues = true
  while (pendingIssues) {
    const nextIssueUrl = nextUrl(++latestIssue)
    console.log(`Processing issue ${latestIssue}`)

    try {
      const { data } = await axios.get(nextIssueUrl)
      const issueElements = parseBody(data, latestIssue)

      console.log(`  Extracted ${issueElements.elements.length} elements`)
      collectives.push(issueElements)

      // Write all the time to avoid reprocessing on already processed data
      fs.writeFileSync(dbFile, JSON.stringify(collectives))
    } catch (error) {
      console.error("  No more issues until now")
      pendingIssues = false
    }
    await sleep(GRACE_TIME)
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function getIssueList() {
  return new Promise(async (resolve, reject) => {
    const { data } = await axios.get("https://tympanus.net/codrops/collective/#collective-archive")
    const regex = /article id="post.*?collective".*?href="(.*?)".*?Collective #(\d+)/gms;

    const elements = []

    let m;
    while ((m = regex.exec(data)) !== null) {
      if (m.index === regex.lastIndex) regex.lastIndex++

      const element = []
      m.forEach((match, groupIndex) => {
        if (groupIndex != 0) {
          element[groupIndex - 1] = match.trim()
        }
      })
      elements.push(element)
    }

    resolve(elements)
  })

}

// All URLs should follow the same pattern, but it seems it is not the case
function nextUrl(issueNo) {
  let url = `https://tympanus.net/codrops/collective/collective-${issueNo}/`
  if (issueNo === 1) {
    url = "https://tympanus.net/codrops/collective/collective1/"
  } else if (issueNo === 234) {
    url = "https://tympanus.net/codrops/collective/collective/"
  } if (issueNo >= 789) {
    const item = issueList.find(issue => parseInt(issue[1]) == issueNo)
    if (item != undefined) {
      url = item[0]
    }
  }
  return url
}

function parseBody(body, issueNo) {
  const regexData = getBodyRegex(issueNo)
  const elements = extractElements(regexData, body)

  if (elements.length < THRESHOLD) {
    console.error("Not enough elements found")
    process.exit(-1)
  }

  return {
    issue: issueNo,
    dateIssue: extractIssueDate(body),
    elements: elements
  }
}

function extractIssueDate(body) {
  const DATE_REGEX = /<time pubdate="pubdate">(.*?)<\/time>/ms
  const dateStr = DATE_REGEX.exec(body)
  if (dateStr == null) {
    return ""
  } else {
    return new Date(dateStr[1]).toISOString().substr(0, 10)
  }
}

function extractElements(regexData, body) {
  const regex = regexData.regex
  const elements = []

  while ((m = regex.exec(body)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex++
    if (m[0].includes("sponsor")) continue

    const element = {}
    m.forEach((match, groupIndex) => {
      if (groupIndex != 0) {
        const field = regexData.fields[groupIndex - 1]
        element[field] = match.trim()
      }
    })
    elements.push(element)
  }

  return elements
}

// The body for each collective changes over time, so different regex need to be applied through time
function getBodyRegex(issueNo) {
  if (issueNo <= 130) {
    return {
      regex: /<article>.*?<h2>(.*?)<\/h2>.*?<p>(.*?)<\/p>.*?class="ct-coll-link".*?href="(.*?)"/gms,
      fields: ["title", "description", "url"],
    }
  } else if (issueNo <= 564) {
    return {
      regex: /<article>.*?<h2><.*?>(.*?)<\/a>.*?<p>(.*?)<\/p>.*?<a.*?href="(.*?)"/gms,
      fields: ["title", "description", "url"],
    }
  } else if (issueNo <= 788) {
    return {
      regex: /<article>.*?<h2>.*?<a.*?href="(.*?)".*?>(.*?)<\/a>.*?<p.*?>(.*?)<\/p>.*?<a.*?href="(.*?)"/gms,
      fields: ["url", "title", "description"]
    }
  } else if (issueNo <= 792) {
    return {
      regex: /line-height: 2;.*?href="(.*?)".*?>(.*?)<.*?last-child.*?>(.*?)<\/p/gms,
      fields: ["url", "title", "description"]
    }
  } else if (issueNo < 832) {
    return {
      regex: /last-child.*?href="(.*?)".*?>(.*?)<.*?p class="last.*?>(.*?)<\/p/gms,
      fields: ["url", "title", "description"]
    }
  } else {
    return {
      regex: /<h3.*?>.*?<a href="(.*?)".*?>(.*?)<.*?<p.*?>(.*?)<\/p>/gms,
      fields: ["url", "title", "description"]
    }
  }
}