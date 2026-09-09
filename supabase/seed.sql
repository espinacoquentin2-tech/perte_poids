-- Données de démonstration rattachées au premier compte Auth du projet.
do $$
declare
  uid uuid; chicken uuid; chili uuid; oats uuid; ingredient_id uuid;
  workout_id uuid; monday date; tuesday date; thursday date; saturday date;
begin
  select id into uid from auth.users order by created_at limit 1;
  if uid is null then raise exception 'Créez d’abord un utilisateur dans Supabase Auth'; end if;

  insert into public.profiles (user_id, first_name, initial_weight_kg, height_cm, target_weight_kg, daily_step_goal)
  values (uid, 'Alex', 88, 181, 79.9, 10000)
  on conflict (user_id) do update set initial_weight_kg=88, height_cm=181, target_weight_kg=79.9, daily_step_goal=10000;

  insert into public.recipes (user_id,name,description,portions,prep_minutes,calories_per_portion,protein_g,carbs_g,fat_g,instructions)
  values (uid,'Poulet citron & riz','Poulet tendre, riz et légumes',2,30,565,48,58,14,'Cuire le riz. Dorer le poulet. Ajouter citron et légumes.') returning id into chicken;
  insert into public.recipes (user_id,name,description,portions,prep_minutes,calories_per_portion,protein_g,carbs_g,fat_g,instructions)
  values (uid,'Chili de dinde','Chili léger riche en protéines',4,40,520,44,46,16,'Faire revenir la dinde. Ajouter haricots et tomate. Mijoter 25 minutes.') returning id into chili;
  insert into public.recipes (user_id,name,description,portions,prep_minutes,calories_per_portion,protein_g,carbs_g,fat_g,instructions)
  values (uid,'Porridge protéiné','Avoine, skyr et fruits rouges',1,8,410,30,52,9,'Cuire les flocons puis ajouter le skyr et les fruits.') returning id into oats;

  insert into public.ingredients(user_id,name,category) values(uid,'Blanc de poulet','Viandes') returning id into ingredient_id;
  insert into public.recipe_ingredients(user_id,recipe_id,ingredient_id,quantity,unit) values(uid,chicken,ingredient_id,300,'g');
  insert into public.ingredients(user_id,name,category) values(uid,'Riz basmati','Féculents') returning id into ingredient_id;
  insert into public.recipe_ingredients(user_id,recipe_id,ingredient_id,quantity,unit) values(uid,chicken,ingredient_id,160,'g');
  insert into public.ingredients(user_id,name,category) values(uid,'Dinde hachée','Viandes') returning id into ingredient_id;
  insert into public.recipe_ingredients(user_id,recipe_id,ingredient_id,quantity,unit) values(uid,chili,ingredient_id,500,'g');
  insert into public.ingredients(user_id,name,category) values(uid,'Haricots rouges','Épicerie') returning id into ingredient_id;
  insert into public.recipe_ingredients(user_id,recipe_id,ingredient_id,quantity,unit) values(uid,chili,ingredient_id,400,'g');

  -- Le dîner d’aujourd’hui fournit aussi le déjeuner de demain.
  insert into public.meal_plan(user_id,recipe_id,planned_for,meal_type,portions) values
    (uid,chicken,current_date,'lunch',1), (uid,chili,current_date,'dinner',1), (uid,chili,current_date + 1,'lunch',1);
  insert into public.weight_logs(user_id,logged_on,weight_kg)
  select uid, current_date - offset_day, 86.4 + (offset_day * 0.13) from generate_series(0,6) as offset_day;
  insert into public.daily_logs(user_id,logged_on,steps) values(uid,current_date,6420);

  monday := current_date + ((8 - extract(isodow from current_date)::int) % 7);
  tuesday := monday + 1; thursday := monday + 3; saturday := monday + 5;
  insert into public.workouts(user_id,name,workout_type,scheduled_for,duration_minutes) values(uid,'Course facile','run',monday,35);
  insert into public.workouts(user_id,name,workout_type,scheduled_for,duration_minutes) values(uid,'Haut du corps','strength',tuesday,45) returning id into workout_id;
  insert into public.workout_exercises(user_id,workout_id,exercise_name,sets,reps,weight_kg,rest_seconds,position) values
    (uid,workout_id,'Développé incliné haltères',4,10,8,90,1), (uid,workout_id,'Rowing unilatéral',4,12,8,75,2), (uid,workout_id,'Élévations latérales',3,15,4,60,3);
  insert into public.workouts(user_id,name,workout_type,scheduled_for,duration_minutes) values(uid,'Jambes & gainage','strength',thursday,45),(uid,'Full body haltères','strength',saturday,50);
end $$;
