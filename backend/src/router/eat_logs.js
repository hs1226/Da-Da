const express = require('express')

const query = require('../query')
const mw = require('../middleware')

const router = express.Router()

/**
 * @apiDefine eatlog
 */
router.use((req, res, next) => {
  next()
})

router.use(mw.jsonMiddleware)
router.use(mw.urlencodedMiddleware)
router.use(mw.expressJwtMiddleware)
router.use(mw.corsMiddleware)
router.options('*', mw.corsMiddleware)
/**
 * @api {post} /eat-logs Post Eat-logs
 * @apiDescription 사용자가 먹은 음식을 기록
 * @apiName Post EatLogs
 * @apiGroup eatlog
 *
 * @apiParam {Integer} food_id 입력 food등록
 * @apiParam {Integer} recipe_id 입력 recipe등록
 * @apiParam {Enum} meal_tag 아침,점심,저녁,간식인지 구분
 * @apiParam {Float} amount 먹은양 기록
 * @apiParam {String} picture 사진을 기록
 * @apiParam {Date} date 등록일
 *
 * @apiSuccess {Integer} eat_log_id eat_log에 남겨지는 id
 * @apiSuccess {Integer} eat_log_member_id 기록한 member의 id
 * @apiSuccess {Integer} eat_log_food_id food를 기록할시 food_id 입력
 * @apiSuccess {Integer} eat_log_recipe_id recipe를 기록할시 recipe_id 입력
 * @apiSuccess {Enum} eat_log_meal_tag 아침,점심,저녁,간식인지 구분
 * @apiSuccess {Float} eat_log_amount 먹은양 기록
 * @apiSuccess {String} eat_log_picture 사진을 기록
 * @apiSuccess {Date} eat_log_diary_date 등록일
 *
 * @apiSuccessExample {json} Success-Response:
 * http://localhost:5000/eat-logs
 * [
 *     {
 *         "eat_log_id": 31,
 *         "eat_log_member_id": 1,
 *         "eat_log_food_id": null,
 *         "eat_log_recipe_id": 1,
 *         "eat_log_meal_tag": "점심",
 *         "eat_log_amount": null,
 *         "eat_log_serve": 2,
 *         "eat_log_picture": null,
 *         "eat_log_diary_date": "2017-10-16T15:00:00.000Z",
 *         "eat_log_submit_time": "2017-10-20T08:12:06.000Z"
 *     }
 * ]
 */
router.post('/', (req, res) => {
  const food_id = req.body.food_id ? req.body.food_id : null
  const recipe_id = req.body.recipe_id ? req.body.recipe_id : null
  const picture = req.body.picture ? req.body.picture : null
  const amount = req.body.amount ? req.body.amount : null
  const serve = req.body.serve ? req.body.serve : null
  const eat_log_meal = {
    'eat_log_member_id': req.user.id,
    'eat_log_food_id': food_id,
    'eat_log_recipe_id': recipe_id,
    'eat_log_meal_tag': req.body.meal_tag,
    'eat_log_amount': amount,
    'eat_log_serve': serve,
    'eat_log_picture': picture,
    'eat_log_diary_date': req.body.date
  }

  query.postEatLogs(eat_log_meal)
    .then(eat_log => {
      if (eat_log) {
        res.send(eat_log)
      } else {
        console.log('Eat_logs POST Error')
      }
    })
})


/**
 * @api {get} /eat-logs/:id Get Eat-logs By Id
 * @apiDescription 사용자가 선택한 기록을 가져온다.
 * @apiName GET EatLogs By Id
 * @apiGroup eatlog
 *
 * @apiParam {Integer} eat-log-id 기록된 id
 *
 * @apiSuccess {Integer} eat_log_id eat_log에 남겨지는 id
 * @apiSuccess {Integer} eat_log_member_id 기록한 member의 id
 * @apiSuccess {Integer} eat_log_food_id food를 기록할시 food_id 입력
 * @apiSuccess {Integer} eat_log_recipe_id recipe를 기록할시 recipe_id 입력
 * @apiSuccess {Enum} eat_log_meal_tag 아침,점심,저녁,간식인지 구분
 * @apiSuccess {String} eat_log_picture 사진을 기록
 * @apiSuccess {Date} eat_log_diary_date 등록일
 *
 * @apiSuccessExample {json} Success-Response:
 * http://localhost:5000/eat-logs/10
 * {
 *     "eat_log_id": 3,
 *     "eat_log_picture": null,
 *     "eat_log_food_id": 1,
 *     "eat_log_amount": 322,
 *     "food_name_ko": "도토리묵밥",
 *     "food_name_en": "Doritomi rice",
 *     "food_unit": "g",
 *     "eat_log_meal_tag": "저녁",
 *     "food_kcal": 120.2,
 *     "food_carb": 21.6,
 *     "food_protein": 4.4,
 *     "food_fat": 1.8
 * }
 */

router.get('/:id', (req, res) => {
  const eat_log_id = req.params.id

  query.getEatLogsId(eat_log_id)
    .then(result => {
      if (result.eat_log_food_id) {
        query.getEatLogsFoodFirst(result)
          .then(foodresult => {
            if (foodresult) {
              res.send(foodresult)
            } else {
              console.log('foodresult error')
            }
          })
      } else if (result.eat_log_recipe_id) {
        query.getEatLogsRecipeFirst(result)
          .then(reciperesult => {
            if (reciperesult) {
              res.send(reciperesult)
            } else {
              console.log('reciperesult error')
            }
          })
      } else {
        console.log('GET eatlogs/:id Error')
      }
    })
})

/**
 * @api {get} /eat-logs Get Eat-logs
 * @apiDescription 사용자가 지정한날에 먹은기록을 가져온다.
 * @apiName GET EatLogs
 * @apiGroup eatlog
 *
 * @apiParam {Date} date 등록일
 *
 * @apiSuccess {Integer} eat_log_id eat_log에 남겨지는 id
 * @apiSuccess {Integer} eat_log_member_id 기록한 member의 id
 * @apiSuccess {Integer} eat_log_food_id food를 기록할시 food_id 입력
 * @apiSuccess {Integer} eat_log_recipe_id recipe를 기록할시 recipe_id 입력
 * @apiSuccess {Enum} eat_log_meal_tag 아침,점심,저녁,간식인지 구분
 * @apiSuccess {String} eat_log_picture 사진을 기록
 * @apiSuccess {Date} eat_log_diary_date 등록일
 *
 * @apiSuccessExample {json} Success-Response:
 * http://localhost:5000/eat-logs?date=20171016
 * {
 *     "foodresult": [
 *         {
 *             "eat_log_id": 2,
 *             "eat_log_picture": null,
 *             "eat_log_food_id": 1,
 *             "eat_log_amount": 322,
 *             "food_name_ko": "도토리묵밥",
 *             "food_name_en": "Doritomi rice",
 *             "food_unit": "g",
 *             "eat_log_meal_tag": "저녁",
 *             "food_kcal": 193.522,
 *             "food_carb": 34.776,
 *             "food_protein": 7.084,
 *             "food_fat": 2.898
 *         },
 *         {
 *             "eat_log_id": 3,
 *             "eat_log_picture": null,
 *             "eat_log_food_id": 1,
 *             "eat_log_amount": 100,
 *             "food_name_ko": "도토리묵밥",
 *             "food_name_en": "Doritomi rice",
 *             "food_unit": "g",
 *             "eat_log_meal_tag": "저녁",
 *             "food_kcal": 60.1,
 *             "food_carb": 10.8,
 *             "food_protein": 2.2,
 *             "food_fat": 0.9
 *         }
 *     ],
 *     "reciperesult": [
 *         {
 *             "eat_log_id": 1,
 *             "eat_log_picture": null,
 *             "eat_log_recipe_id": 1,
 *             "eat_log_serve": 350,
 *             "recipe_name_ko": "피자",
 *             "recipe_name_en": "pizza",
 *             "eat_log_meal_tag": "저녁",
 *             "recipe_kcal": 595000,
 *             "recipe_carb": 35000,
 *             "recipe_protein": 35000,
 *             "recipe_fat": 35000
 *         }
 *     ]
 * }
 */
router.get('/', (req, res) => {
  const eat_log_meal = {
    'eat_log_member_id': req.user.id,
    'eat_log_diary_date': req.query.date
  }

  query.getEatLogsFood(eat_log_meal)
    .then(foodresult => {
      query.getEatLogsRecipe(eat_log_meal)
        .then(reciperesult => {
          res.send({ foodresult, reciperesult })
        })
    })
})


/**
 * @api {delete} /eat-logs/:id delete Eat-logs
 * @apiDescription 사용자가 선택한 기록을 지운다.
 * @apiName Delete EatLogs
 * @apiGroup eatlog
 *
 * @apiParam {Integer} eat_log_id 기록된것의 id
 *
 * @apiSuccess {Message} complete
 *
 * @apiSuccessExample {json} Success-Response:
 * http://localhost:5000/eat-logs/10
 * Message complete
 */

router.delete('/:id', (req, res) => {
  const eat_log_id = req.params.id
  query.deleteEatLogs(eat_log_id)
    .then(result => {
      if (result) {
        res.status(200)
        res.end('complete')
      } else {
        console.log('delete eat-log error')
      }
    })
})

/**
 * @api {put} /eat-logs/:id Put Eat-logs
 * @apiDescription 사용자가 먹은 음식의 기록을 치환
 * @apiName Put EatLogs
 * @apiGroup eatlog
 *
 * @apiParam {Float} amount 먹은양 기록
 * @apiParam {Integer} serve 인분 기록
 *
 *
 * @apiSuccess {Enum} eat_log_meal_tag 아침,점심,저녁,간식인지 구분
 * @apiSuccess {Float} eat_log_amount 먹은양 기록
 * @apiSuccess {String} eat_log_picture 사진을 기록
 * @apiSuccess {Date} eat_log_diary_date 등록일
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * http://localhost:5000/eat-logs/2
 * {
 *     "eat_log_id": 2,
 *     "eat_log_member_id": 1,
 *     "eat_log_food_id": 1,
 *     "eat_log_recipe_id": null,
 *     "eat_log_meal_tag": "저녁",
 *     "eat_log_amount": 322,
 *     "eat_log_serve": null,
 *     "eat_log_picture": null,
 *     "eat_log_diary_date": "2017-10-15T15:00:00.000Z",
 *     "eat_log_submit_time": "2017-10-16T12:30:37.000Z"
 * }
 */

router.put('/:id', (req, res) => {
  const amount = req.body.amount ? req.body.amount : null
  const serve = req.body.serve ? req.body.serve : null

  const update_eat_log = {
    'eat_log_id': req.params.id,
    'eat_log_amount': amount,
    'eat_log_serve': serve
  }

  query.putEatLogs(update_eat_log)
    .then(result => {
      if (result) {
        res.send(result)
      } else {
        console.log('EatLogs update Error!!')
      }
    })
})

/**
 * @api {get} /eat-logs/summary/day Get EatSummary
 * @apiDescription 우측의 사용자 칼로리 요약
 * @apiName eatSummary Day
 * @apiGroup eatlog
 *
 * @apiParam {String} date 요약할 날짜 ("YYYYMMDD")
 *
 * @apiSuccess {Integer} member_id 사용자 id
 * @apiSuccess {String} date summary의 날짜
 * @apiSuccess {Integer} day_log_kcal 목표 칼로리
 * @apiSuccess {Integer} today_kcal 하루 섭취 칼로리
 * @apiSuccess {Enum} today_burn_kcal 하루 소모 칼로리
 * @apiSuccess {Float} today_carb 하루 섭취 탄수화물
 * @apiSuccess {String} today_protein 하루 섭취 단백질
 * @apiSuccess {Date} today_fat 하루 섭취 지방
 *
 * @apiSuccessExample {json} Success-Response:
 * /eat-logs/summary/day?date=20171010
 *
 * {
 *     "member_id": 1,
 *     "date": "20171015",
 *     "day_log_kcal": 1200,
 *     "today_kcal": 260,
 *     "today_burn_kcal": 340,
 *     "today_carb": 132,
 *     "today_protein": 56,
 *     "today_fat": 72
 * }
 */

router.get('/summary/day', (req, res) => {
  const param = {
    'day_log_member_id': req.user.id,
    'day_log_diary_date': req.query.date,
    'eat_log_member_id': req.user.id,
    'eat_log_diary_date': req.query.date,
    'burn_member_id': req.user.id,
    'burn_date': req.query.date
  }

  const out = {
    'member_id': req.user.id,
    'date': req.query.date,
    'day_log_kcal': 0,
    'today_kcal': 0,
    'today_burn_kcal': 0,
    'today_carb': 0,
    'today_protein': 0,
    'today_fat': 0
  }

  query.getSelectDayLog(param)
    .then(result => {
      if (result) {
        out.day_log_kcal = result.day_log_kcal
      } else {
        return query.getLastDaylog(param)
          .then(result => {
            if (result && result.burn_kcal !== null) {
              out.day_log_kcal = result.day_log_kcal
            }
          })
      }
    })
    .then(() => {
      return query.getEatKcalByDate(param)
        .then(result => {
          if (result) {
            out.today_kcal = result.today_kcal
            out.today_carb = result.today_carb
            out.today_protein = result.today_protein
            out.today_fat = result.today_fat
          }
        })
    })
    .then(() => {
      return query.getBurnKcalByDate(param)
        .then(result => {
          if (result && result.burn_kcal !== null) {
            out.today_burn_kcal = result.burn_kcal
          }
        })
    })
    .then(() => {
      res.send(out)
    })
})

module.exports = router
