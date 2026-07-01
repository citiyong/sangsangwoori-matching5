"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerSenior, type RegisterState } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const REGIONS = ["서울", "경기", "인천", "기타"];
const JOB_TYPES = ["경비", "청소", "조리", "돌봄", "기타"];

const initialState: RegisterState = { success: false, errors: {} };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerSenior, initialState);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 space-y-8">

        {/* 제목 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">프로필 등록</h1>
          <p className="text-xl text-gray-600">일자리 매칭을 위한 정보를 입력해 주세요</p>
        </div>

        {state.success && (
          <Alert className="border-green-500 bg-green-50 space-y-2">
            <AlertDescription className="text-lg font-semibold text-green-800">
              등록이 완료되었습니다
            </AlertDescription>
            {state.seniorId && (
              <Link
                href={`/recommendations?senior_id=${state.seniorId}`}
                className="inline-block text-green-800 underline font-semibold"
              >
                내 추천 일자리 보기
              </Link>
            )}
          </Alert>
        )}

        {state.errors.form && (
          <Alert variant="destructive">
            <AlertDescription className="text-lg font-semibold">
              {state.errors.form}
            </AlertDescription>
          </Alert>
        )}

        <form action={formAction} className="space-y-6">

          <div className="space-y-2">
            <Label htmlFor="name" className="text-xl font-semibold text-gray-800">이름</Label>
            {state.errors.name && (
              <Alert variant="destructive">
                <AlertDescription className="text-base font-semibold">
                  {state.errors.name}
                </AlertDescription>
              </Alert>
            )}
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="이름을 입력하세요"
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="text-xl font-semibold text-gray-800">지역</Label>
            {state.errors.region && (
              <Alert variant="destructive">
                <AlertDescription className="text-base font-semibold">
                  {state.errors.region}
                </AlertDescription>
              </Alert>
            )}
            <Select name="region">
              <SelectTrigger id="region" className="h-14 w-full text-lg">
                <SelectValue placeholder="거주 지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r} className="text-lg">{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desired_job" className="text-xl font-semibold text-gray-800">희망 직종</Label>
            {state.errors.desired_job && (
              <Alert variant="destructive">
                <AlertDescription className="text-base font-semibold">
                  {state.errors.desired_job}
                </AlertDescription>
              </Alert>
            )}
            <Select name="desired_job">
              <SelectTrigger id="desired_job" className="h-14 w-full text-lg">
                <SelectValue placeholder="희망하는 직종을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((j) => (
                  <SelectItem key={j} value={j} className="text-lg">{j}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="career_years" className="text-xl font-semibold text-gray-800">경력 (년)</Label>
            <Input
              id="career_years"
              name="career_years"
              type="number"
              min={0}
              defaultValue={0}
              className="h-14 text-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full h-16 text-2xl font-bold rounded-xl"
          >
            {pending ? "저장 중..." : "등록하기"}
          </Button>

        </form>
      </div>
    </main>
  );
}
