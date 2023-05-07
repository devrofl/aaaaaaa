const router = require('express').Router()

const fs = require('fs')
const path = require('path')
const imgSize = require('image-size')
const placeholder = require('string-placeholder')
const isLoggedIn = require('../utils/isLoggedIn')

router.get('/:file', (req, res) => {
    const { file } = req.params
    const extension = require('../utils/checkExtension.js')
    const color = require('../utils/color')
    const getSize = require('../utils/getSize')

    if (extension(file) === 'image') {
        const imagePath = `${path.dirname(require.main.filename)}/uploads/images/${file}`

        if (fs.existsSync(imagePath)) {
            const dimensions = imgSize(imagePath)
            const imageData = require(`../uploads/data/${file}.json`)

            const header = placeholder(process.env.IMAGE_HEADER, {
                name: file,
                size: getSize(imagePath),
                width: dimensions.width,
                height: dimensions.height
            })

            const embedTitle = placeholder(process.env.IMAGE_EMBED_TITLE, {
                name: file,
                size: getSize(imagePath),
                width: dimensions.width,
                height: dimensions.height
            })

            const embedDescription = placeholder(process.env.IMAGE_EMBED_DESCRIPTION, {
                uploadedAt: imageData.date
            })

            res.render('view', {
                image: true,
                text: false,
                video: false,
                header: header,
                embedTitle: embedTitle,
                embedDescription: embedDescription,
                appName: process.env.APP_NAME,
                name: file,
                color: `${color()}`,
                uploadedAt: imageData.date,
                url: process.env.URL,
                loggedIn: isLoggedIn(req),
                delKey: imageData.key
            })
        } else res.status(404).render('404')

    } else if (extension(file) === 'text') {
        const filePath = `${path.dirname(require.main.filename)}/uploads/text/${file}`

        if (fs.existsSync(filePath)) {
            const filter = require('../utils/filterTags')
            const fileData = require(`../uploads/data/${file}.json`)
            const fileContent = fs.readFileSync(`./uploads/text/${file}`, 'utf-8')
            const words = fileContent.length

            const header = placeholder(process.env.TEXT_HEADER, {
                name: file,
                size: getSize(filePath),
                words: words
            })

            const embedTitle = placeholder(process.env.TEXT_EMBED_TITLE, {
                name: file,
                size: getSize(filePath),
                words: words
            })

            const embedDescription = placeholder(process.env.TEXT_EMBED_DESCRIPTION, {
                uploadedAt: fileData.date
            })

            res.render('view', {
                text: true,
                image: false,
                video: false,
                header: header,
                embedTitle: embedTitle,
                embedDescription: embedDescription,
                appName: process.env.APP_NAME,
                name: file,
                size: getSize(filePath),
                color: `${color()}`,
                uploadedAt: fileData.date,
                content: filter(fileContent),
                url: process.env.URL,
                delKey: fileData.key,
                loggedIn: isLoggedIn(req)
            })
        } else res.status(404).render('404')
    } else {
        const filePath = extension(file) === 'video' ? `${path.dirname(require.main.filename)}/uploads/videos/${file}` : `${path.dirname(require.main.filename)}/uploads/uncategorized/${file}`

        if (fs.existsSync(filePath)) {
            const fileData = require(`../uploads/data/${file}.json`)
            const header = placeholder(process.env.UNCATEGORIZED_HEADER, {
                name: file,
                size: getSize(filePath)
            })

            const embedTitle = placeholder(process.env.UNCATEGORIZED_EMBED_TITLE, {
                name: file,
                size: getSize(filePath)
            })

            const embedDescription = placeholder(process.env.UNCATEGORIZED_EMBED_DESCRIPTION, {
                uploadedAt: fileData.date
            })

            res.render('view', {
                text: false,
                image: false,
                video: extension(file) === 'video' ? true : false,
                header: header,
                embedTitle: embedTitle,
                embedDescription: embedDescription,
                appName: process.env.APP_NAME,
                name: file,
                size: getSize(filePath),
                color: `${color()}`,
                uploadedAt: fileData.date,
                url: process.env.URL,
                delKey: fileData.key,
                loggedIn: isLoggedIn(req)
            })
        } else res.status(404).render('404')
    }
})

module.exports = router