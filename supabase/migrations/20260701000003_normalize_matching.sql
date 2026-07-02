-- 매칭 점수 계산 시 비교용으로만 쓰는 정규화 함수. seniors/jobs 원본 값은 그대로 둔다.
create or replace function normalize_region(p_region text)
returns text
language sql
immutable
as $$
  select case p_region
    when '서울특별시' then '서울'
    when '경기도' then '경기'
    when '인천광역시' then '인천'
    else p_region
  end;
$$;

create or replace function normalize_job_type(p_job_type text)
returns text
language sql
immutable
as $$
  select case p_job_type
    when '경비직' then '경비'
    when '청소직' then '청소'
    when '조리직' then '조리'
    when '돌봄직' then '돌봄'
    else p_job_type
  end;
$$;

-- 시니어 기준 재매칭: 정규화된 지역/직종으로 비교
create or replace function recalc_matches_for_senior(p_senior_id uuid)
returns void
language plpgsql
as $$
declare
  v_region text;
  v_desired_job text;
  v_career integer;
begin
  select region, desired_job, career_years
    into v_region, v_desired_job, v_career
    from seniors
    where id = p_senior_id;

  if not found then
    return;
  end if;

  insert into matches (senior_id, job_id, score)
  select
    p_senior_id,
    j.id,
    (case when normalize_region(j.region) = normalize_region(v_region) then 3 else 0 end)
    + (case when normalize_job_type(j.job_type) = normalize_job_type(v_desired_job) then 2 else 0 end)
    + (case when v_career >= j.required_career then 1 else 0 end)
  from jobs j
  on conflict (senior_id, job_id)
  do update set score = excluded.score;
end;
$$;

-- 일자리 기준 재매칭: 정규화된 지역/직종으로 비교
create or replace function recalc_matches_for_job(p_job_id uuid)
returns void
language plpgsql
as $$
declare
  v_region text;
  v_job_type text;
  v_required_career integer;
begin
  select region, job_type, required_career
    into v_region, v_job_type, v_required_career
    from jobs
    where id = p_job_id;

  if not found then
    return;
  end if;

  insert into matches (senior_id, job_id, score)
  select
    s.id,
    p_job_id,
    (case when normalize_region(s.region) = normalize_region(v_region) then 3 else 0 end)
    + (case when normalize_job_type(s.desired_job) = normalize_job_type(v_job_type) then 2 else 0 end)
    + (case when s.career_years >= v_required_career then 1 else 0 end)
  from seniors s
  on conflict (senior_id, job_id)
  do update set score = excluded.score;
end;
$$;

grant execute on function normalize_region(text) to anon, authenticated;
grant execute on function normalize_job_type(text) to anon, authenticated;
grant execute on function recalc_matches_for_senior(uuid) to anon, authenticated;
grant execute on function recalc_matches_for_job(uuid) to anon, authenticated;
