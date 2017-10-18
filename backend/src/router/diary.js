const express = require('express')
const bodyParser = require('body-parser')
const expressJwt = require('express-jwt')
const cors = require('cors')

const query = require('../query')

const router = express.Router()

/**
 * @apiDefine diary
 */
router.use((req, res, next) => {
  next()
})

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 'extended': false }))
router.use(expressJwt({ 'secret': process.env.JWT_SECRET }))
router.use(cors({ 'origin': process.env.TARGET_ORIGIN }))

/**
 * @api {post} /diary/regret Post Regret
 * @apiDescription 오늘의 반성일기 작성 후 저장
 * @apiName PostRegret
 * @apiGroup diary
 *
 * @apiSuccess {Integer} id 반성일기의 id
 * @apiSuccess {Integer} member_id  반성일기를 작성한 유저의 id
 * @apiSuccess {String} regret 작성한 반성일기
 * @apiSuccess {Date} date 페이지의 표시되어 있는 다이어리의 날짜
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "day_log_id": 1,
 *    "day_log_member_id": 2,
 *    "day_log_regret": "나의 14일 반성일기이다.",
 *    "day_log_diary_date": "2017-10-13T15:00:00.000Z"
 * }
 */

router.post('/regret', (req, res) => {
  const day_log_regret = {
    'day_log_member_id': req.user.id,
    'day_log_regret': req.body.regret,
    'day_log_diary_date': req.body.date
  }

  query.postDayLogRegret(day_log_regret)
    .then(() => {
      query.getSelectDayLog(day_log_regret)
        .then(day_log => {
          if (day_log) {
            res.send({
              'day_log_id': day_log.day_log_id,
              'day_log_member_id': day_log.day_log_member_id,
              'day_log_regret': day_log.day_log_regret,
              'day_log_diary_date': day_log.day_log_diary_date
            })
          } else {
            console.log('Regret POST error')
          }
        })
    })
})

/**
 * @api {get} /diary/regret?date Get Regret
 * @apiDescription 원하는 날의 반성일기 가져오기
 * @apiName GetRegret
 * @apiGroup diary
 *
 * @apiSuccess {Integer} id 반성일기의 id
 * @apiSuccess {Integer} member_id  반성일기를 작성한 유저의 id
 * @apiSuccess {String} regret 가져온 반성일기
 * @apiSuccess {Date} date 페이지의 표시되어 있는 다이어리의 날짜
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "day_log_id": 1,
 *    "day_log_member_id": 2,
 *    "day_log_regret": "나의 14일 반성일기이다.",
 *    "day_log_diary_date": "2017-10-13T15:00:00.000Z"
 * }
 */

router.get('/regret', (req, res) => {
  const day_log_regret = {
    'day_log_member_id': req.user.id,
    'day_log_diary_date': req.query.date
  }

  query.getSelectDayLog(day_log_regret)
    .then(day_log => {
      if (day_log) {
        res.send({
          'day_log_id': day_log.day_log_id,
          'day_log_member_id': day_log.day_log_member_id,
          'day_log_regret': day_log.day_log_regret,
          'day_log_diary_date': day_log.day_log_diary_date
        })
      } else {
        console.log('Regret GET error')
      }
    })
})

/**
 * @api {post} /diary/comment Post Comment
 * @apiDescription 오늘의 일기 작성 후 저장
 * @apiName PostComment
 * @apiGroup diary
 *
 * @apiSuccess {Integer} id 반성일기의 id
 * @apiSuccess {Integer} member_id  반성일기를 작성한 유저의 id
 * @apiSuccess {String} comment 작성한 일기
 * @apiSuccess {Date} date 페이지의 표시되어 있는 다이어리의 날짜

 * @apiSuccessExample {json} Success-Response:
 * {
 *    "day_log_id": 2,
 *    "day_log_member_id": 2,
 *    "day_log_comment": "나의 14일 일기이다.",
 *    "day_log_diary_date": "2017-10-13T15:00:00.000Z"
 * }
 */

router.post('/comment', (req, res) => {
  const day_log_comment = {
    'day_log_member_id': req.user.id,
    'day_log_comment': req.body.comment,
    'day_log_diary_date': req.body.date
  }

  query.postDayLogComment(day_log_comment)
    .then(() => {
      query.getSelectDayLog(day_log_comment)
        .then(day_log => {
          if (day_log) {
            res.send({
              'day_log_id': day_log.day_log_id,
              'day_log_member_id': day_log.day_log_member_id,
              'day_log_comment': day_log.day_log_comment,
              'day_log_diary_date': day_log.day_log_diary_date
            })
          } else {
            console.log('Comment POST error')
          }
        })
    })
})

/**
 * @api {get} /diary/comment Get Comment
 * @apiDescription 원하는 날의 comment(일기)를 가져온다.
 * @apiName GetComment
 * @apiGroup diary
 *
 * @apiSuccess {Integer} id 반성일기의 id
 * @apiSuccess {Integer} member_id  반성일기를 작성한 유저의 id
 * @apiSuccess {String} comment 가져온 일기
 * @apiSuccess {Date} date 페이지의 표시되어 있는 다이어리의 날짜
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "day_log_id": 2,
 *    "day_log_member_id": 2,
 *    "day_log_comment": "나의 14일 일기이다.",
 *    "day_log_diary_date": "2017-10-13T15:00:00.000Z"
 * }
 */

router.get('/comment', (req, res) => {
  const day_log_comment = {
    'day_log_member_id': req.user.id,
    'day_log_diary_date': req.query.date
  }

  query.getSelectDayLog(day_log_comment)
    .then(day_log => {
      if (day_log) {
        res.send({
          'day_log_id': day_log.day_log_id,
          'day_log_member_id': day_log.day_log_member_id,
          'day_log_comment': day_log.day_log_comment,
          'day_log_diary_date': day_log.day_log_diary_date
        })
      } else {
        console.log('Comment GET error')
      }
    })
})


/**
 * @api {post} diary/kg Post Kg
 * @apiDescription 오늘 체중을 입력 후 저장
 * @apiName PostKg
 * @apiGroup diary
 *
 * @apiParam {Number} user.id 사용자 id
 * @apiParam {Date} date 오늘날짜
 * @apiParam {Number} kg 사용자가 입력한 몸무게
 *
 * @apiSuccesExample {json} Success-Response:
 * http://localhost:5000/diary/kg
 * [
 *     {
 *         "day_log_kg": null,
 *         "day_log_member_id": 1,
 *         "day_log_diary_date": "2017-10-10T15:00:00.000Z"
 *     },
 *     {
 *         "day_log_kg": 50,
 *         "day_log_member_id": 1,
 *         "day_log_diary_date": "2017-10-10T15:00:00.000Z"
 *     },
 *     {
 *         "day_log_kg": 47.6,
 *         "day_log_member_id": 1,
 *         "day_log_diary_date": "2017-10-09T15:00:00.000Z"
 *     },
 *     {
 *         "day_log_kg": 46,
 *         "day_log_member_id": 1,
 *         "day_log_diary_date": "2016-12-31T15:00:00.000Z"
 *     }
 * ]
 */
router.post('/kg', (req, res) => {
  const day_log_kg = {
    'day_log_member_id': req.user.id,
    'day_log_kg': req.body.kg,
    'day_log_diary_date': req.body.date
  }

  query.postDayKgbyUser(day_log_kg)
    .then(() => {
      query.getKgByDate(day_log_kg)
        .then(day_kg => {
          res.send(day_kg)
        })
    })
})

/**
 * @api {get} diary/kg Get Kg
 * @apiDescription 최근 입력한 체중 4개만 출력
 * @apiName GetKg
 * @apiGroup diary
 *
 * @apiParam {Number} user.id 사용자 id
 * @apiParam {Date} date '오늘'을 기준
 *
 * @apiSuccess {Number} day_log_kg 사용자가 입력했던 몸무게
 * @apiSuccess {Number} day_log_member_id 사용자id
 * @apiSuccess {Number} day_log_diary_date 사용자가 입력했던 date
 *
 * @apiSuccesExample {json} Success-Response:
 * http://localhost:5000/diary/kg?date=20170101
 *  [
 *    {
 *        "day_log_kg": 47.6,
 *        "day_log_member_id": 1,
 *        "day_log_diary_date": "2017-10-09T15:00:00.000Z"
 *    },
 *    {
 *        "day_log_kg": 42,
 *        "day_log_member_id": 1,
 *        "day_log_diary_date": "2017-10-08T15:00:00.000Z"
 *    },
 *    {
 *        "day_log_kg": 41,
 *        "day_log_member_id": 1,
 *        "day_log_diary_date": "2017-10-07T15:00:00.000Z"
 *    },
 *    {
 *        "day_log_kg": 40,
 *        "day_log_member_id": 1,
 *        "day_log_diary_date": "2017-10-06T15:00:00.000Z"
 *    },
 *    {
 *        "day_log_kg": 39,
 *        "day_log_member_id": 1,
 *        "day_log_diary_date": "2017-10-05T15:00:00.000Z"
 *    }
 * ]
 */
router.get('/kg', (req, res) => {
  const date = req.query.date
  const user = req.user.id

  query.getKgByDate(date, user)
    .then(data => {
      if (!data) {
        res.status(404)
      } else {
        res.send(data)
      }
    })
})

module.exports = router
