const fs = require('fs')
const parser = require('iptv-playlist-parser')
const _ = require('lodash')

const playlist = fs.readFileSync('us.m3u', 'utf8')
const result = parser.parse(playlist)

const expandedItems = _.flatMap(result.items, (item) => {
    const groups = item.group.title.split(';')
    return groups.map((group) => ({
        ...item,
        group: group.trim()
    }))
})

const groupedItems = _.groupBy(expandedItems, 'group')
const finalData = Object.keys(groupedItems).map((key) => ({
    name: key,
    count: groupedItems[key].length
})).sort((a, b) => {
    if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
})

console.log(JSON.stringify([
    {
        name: 'All Channels',
        count: result.items.length
    },
    ...finalData
]))