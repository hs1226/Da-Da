
exports.up = function(knex, Promise) {
  return knex.schema.createTable('recipe', t => {
    t.increments('recipe_id') // 일련번호(PK)
    t.string('recipe_name_ko').notNullable() // 레시피 제목(한글)
    t.string('recipe_name_en').notNullable() // 레시피 제목(영어)
    t.string('recipe_level').notNullable() // 난이도
    t.string('recipe_time').notNullable() // 소요시간
    t.float('recipe_carb', [8], [3]).notNullable() // 탄수화물
    t.float('recipe_protein', [8], [3]).notNullable() // 단백질
    t.float('recipe_fat', [8], [3]).notNullable() // 지방
    t.string('recipe_ingredient').notNullable() // 재료 [{"감자": "10g", "물": "10", "오이":"10g"}]
    t.string('recipe').notNullable() // 요리법 [{"1": "ㅁㄴㅇㅁㅇㅁㄴ", "2": "ㅁㄴㅇㅁㄴㄴㅁ", "3":"ㅁㄴㅇㅁㄴㅇㅁㄴㅇ"}]
    t.integer('recipe_serving').notNullable() // 요리법 인분
    t.string('recipe_from').notNullable() // 레시피 출처
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('recipe')
};
