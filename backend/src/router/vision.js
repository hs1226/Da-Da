const express = require('express')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const cors = require('cors')
const query = require('../query')
const fs = require('fs')
const util = require('util')
const mime = require('mime')
const multer = require('multer')
const aws = require('aws-sdk')
const uuid = require('uuid')
const sharp = require('sharp')
const fileType = require('file-type')

/**
 * Google Vision
 */
const gcloud = require('google-cloud')({
  'keyFilename': 'gkey.json',
  'projectId': 'my-project-1470459490848'
})
const vision = gcloud.vision()

/**
 * AWS S3
 */
const upload = multer({ 'storage': multer.memoryStorage() })
const s3 = new aws.S3({ 'apiVersion': '2006-03-01' })

const supportImageExt = ['png', 'jpg']
const maxFileSize = 1024 * 1024 * 3

const router = express.Router()

/**
 * 도메인 CORS 제약조건 해제
 * 실서버 적용시 적용
 */
// router.use(cors({ 'origin': process.env.TARGET_ORIGIN }))

router.use((req, res, next) => {
  next()
})

router.use(bodyParser.json())

/**
 * 토큰유효성 검사 해제
 * 실서버 적용시 적용
 */
// router.use(expressJwt({ 'secret': process.env.JWT_SECRET }))

function googleVision(fileBuffer) {
  return new Promise((resolve, reject) => {
    // faces, landmarks, labels, logos, properties, safeSearch, texts
    const types = ['labels']

    vision.detect(fileBuffer, types, (err, detections, apiResponse) => {
      if (err) {
        reject(err)
      } else {
        const apiData = []

        apiResponse.responses[0].labelAnnotations.map(val => {
          apiData.push({
            'description': val.description,
            'score': val.score
          })
        })
        resolve(apiData)
      }
    })
  })
}

function s3upload(buffer, fileName, fileMime) {
  return new Promise((resolve, reject) => {
    s3.upload({
      'ACL': 'public-read', // 익명의 사용자도 파일 경로만 알면 읽기 가능하도록 설정
      'Body': buffer,
      'Bucket': process.env.S3_BUCKET_NAME,
      'Key': fileName, // 파일이름
      'ContentDisposition': 'inline', // Content-Disposition 헤더
      'ContentType': fileMime // Content-Type 헤더
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

router.get('/debug', (req, res) => {
  res.render('vision-debug.pug')
})

router.post('/', upload.single('upload_img'), (req, res) => {
  // jpg image/jpeg << [ ext, mime ]
  const { ext, mime } = fileType(req.file.buffer)
  if (!supportImageExt.includes(ext)) {
    res.status(400)
    res.send('지원하지 않는 파일입니다.')
  } else if (req.file.size > maxFileSize) {
    res.status(400)
    res.send('파일 용량은 3mb 까지 입니다.')
  }

  const fileName = `${uuid.v4()}.${ext}`

  Promise.all([googleVision(req.file.buffer), s3upload(req.file.buffer, fileName, mime)])
    .then(result => {
      const regexr = /^((?!junk)(?!dish)(?!food)(?!snack)(?!cookie)(?!finger food)(?!cuisine)(?!asian food)(?!chinese)(?!baking)(?!baked goods)(?!dessert)(?!american food)(?!cook)(?!side dish)(?!vegetarian food)).*$/
      const out = result[0].filter(item => {
        return item.description.match(regexr)
      })
      res.render('vision.pug', {
        'visionAnalysis': JSON.stringify(out),
        'imgUrl': result[1].Location
      })
    })
    .then(() => {
      sharp(req.file.buffer)
        .resize(200, 200)
        .crop(sharp.gravity.center)
        .toBuffer()
        .then(resizeFile => {
          s3upload(resizeFile, `thumb/${fileName}`)
        })
    })
    .catch(err => {
      res.status(400)
      res.send(err)
    })
})

module.exports = router