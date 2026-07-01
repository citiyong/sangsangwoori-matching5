-- 시니어 1명 × 일자리 1개 조합당 매칭 결과는 하나만 존재해야 하므로,
-- 재계산 시 덮어쓰기(upsert)가 가능하도록 유니크 제약을 추가합니다.
alter table matches
  add constraint matches_senior_job_unique unique (senior_id, job_id);

-- 시니어 기준 재매칭: 해당 시니어 × 전체 일자리 점수 재계산
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
    (case when j.region = v_region then 3 else 0 end)
    + (case when j.job_type = v_desired_job then 2 else 0 end)
    + (case when v_career >= j.required_career then 1 else 0 end)
  from jobs j
  on conflict (senior_id, job_id)
  do update set score = excluded.score;
end;
$$;

-- 일자리 기준 재매칭: 해당 일자리 × 전체 시니어 점수 재계산
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
    (case when s.region = v_region then 3 else 0 end)
    + (case when s.desired_job = v_job_type then 2 else 0 end)
    + (case when s.career_years >= v_required_career then 1 else 0 end)
  from seniors s
  on conflict (senior_id, job_id)
  do update set score = excluded.score;
end;
$$;

grant execute on function recalc_matches_for_senior(uuid) to anon, authenticated;
grant execute on function recalc_matches_for_job(uuid) to anon, authenticated;
