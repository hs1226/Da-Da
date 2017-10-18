const express = require('express')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const cors = require('cors')

const query = require('../query')

const router = express.Router()

// const urlencodeParser = bodyParser.urlencoded({ 'extended': false })
/**
 * @apiDefine exercises
 */
router.use((req, res, next) => {
  next()
})

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 'extended': false }))
router.use(expressJwt({ 'secret': process.env.JWT_SECRET }))
router.use(cors({ 'origin': process.env.TARGET_ORIGIN }))

/**
 * @api {post} /exercises Post Exercises
 * @apiDescription 운동을 통한 열량소모를 등록하기 위한 액션
 * @apiName PostExercises
 * @apiGroup exercises
 *
 * @apiParam {Number} user.id userid
 * @apiParam {Number} exercise_id exercise pk
 * @apiParam {Date} date 등록하고자 하는 날짜
 * @apiParam {Number} burn_kcal 사용자가 입력한 정보로 계산된 소모된 열량
 * @apiParam {Number} burn_minute 사용자가 입력한 운동시간
 *
 * @apiSuccessExample {Json} Success-Response:
 *{
 *   "burn_id": 6,
 *   "burn_exercise_id": null,
 *   "date": "2017-01-09T15:00:00.000Z",
 *   "kcal": 1,
 *   "burn_minute": 30
 * }
 */
router.post('/', (req, res) => {
  const exercise_data = {
    'burn_member_id': req.user.id,
    'burn_exercise_id': req.body.exercise_id,
    'burn_date': req.body.date,
    'burn_kcal': req.body.kcal,
    'burn_minute': req.body.burn_minute
  }
  query.insertBurnById(exercise_data)
    .then(burn => {
      res.send({
        'burn_id': burn.burn_id,
        'burn_exercise_id': burn.burn_exercise_id,
        'burn_date': burn.burn_date,
        'burn_kcal': burn.burn_kcal,
        'burn_minute': burn.burn_minute
      })
    })
})

/**
 * @api {get} /exercises Get Exercises
 * @apiDescription 사용자가 운동별 1분당 소모열량 검색
 * @apiName GetExercises
 * @apiGroup exercises
 *
 * @apiParam {String} 사용자가 입력한 검색 글자
 *
 * @apiSuccess {Number} exercise_id exercise 번호
 * @apiSuccess {Number} exercise_burn_kcal 1분당 소모 열량
 * @apiSuccess {String} exercise_name 운동이름
 *
 * @apiSuccessExample {Json} Succes-Response:
 * http://localhost:5000/exercises?name=걷기
 * 걷기로 검색
 * [
 *    {
 *        "exercise_id": 1,
 *        "exercise_burn_kcal": 23,
 *        "exercise_name": "걷기"
 *    },
 *    {
 *        "exercise_id": 2,
 *        "exercise_burn_kcal": 40,
 *        "exercise_name": "빨리 걷기"
 *    }
 *]
 */
router.get('/', (req, res) => {
  const name = req.query.name

  query.getExercisesByName(name)
    .then(data => {
      if (!data) {
        res.status(404)
      } else {
        res.send(data)
      }
    })
})

module.exports = router