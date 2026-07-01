"use client";

import { useActionState } from "react";
import { addJob, deleteJob, type JobFormState } from "./actions";
import type { Job } from "@/lib/supabase";
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const REGIONS = ["서울", "경기", "인천", "기타"];
const JOB_TYPES = ["경비", "청소", "조리", "돌봄", "기타"];

const initialState: JobFormState = { success: false, errors: {} };

export function JobsManager({ jobs }: { jobs: Job[] }) {
  const [state, formAction, pending] = useActionState(addJob, initialState);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">일자리 관리</h2>

      {state.success && (
        <Alert className="border-green-500 bg-green-50">
          <AlertDescription className="text-lg font-semibold text-green-800">
            일자리가 등록되었습니다
          </AlertDescription>
        </Alert>
      )}
      {state.errors.form && (
        <Alert variant="destructive">
          <AlertDescription className="text-lg font-semibold">
            {state.errors.form}
          </AlertDescription>
        </Alert>
      )}

      <form action={formAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-lg font-semibold text-gray-800">공고명</Label>
          {state.errors.title && (
            <Alert variant="destructive">
              <AlertDescription className="text-base font-semibold">
                {state.errors.title}
              </AlertDescription>
            </Alert>
          )}
          <Input id="title" name="title" placeholder="공고명을 입력하세요" className="h-12 text-lg" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="text-lg font-semibold text-gray-800">지역</Label>
          {state.errors.region && (
            <Alert variant="destructive">
              <AlertDescription className="text-base font-semibold">
                {state.errors.region}
              </AlertDescription>
            </Alert>
          )}
          <Select name="region">
            <SelectTrigger id="region" className="h-12 w-full text-lg">
              <SelectValue placeholder="지역을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r} className="text-lg">{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="job_type" className="text-lg font-semibold text-gray-800">직종</Label>
          {state.errors.job_type && (
            <Alert variant="destructive">
              <AlertDescription className="text-base font-semibold">
                {state.errors.job_type}
              </AlertDescription>
            </Alert>
          )}
          <Select name="job_type">
            <SelectTrigger id="job_type" className="h-12 w-full text-lg">
              <SelectValue placeholder="직종을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((j) => (
                <SelectItem key={j} value={j} className="text-lg">{j}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="required_career" className="text-lg font-semibold text-gray-800">요구 경력 (년)</Label>
          <Input
            id="required_career"
            name="required_career"
            type="number"
            min={0}
            defaultValue={0}
            className="h-12 text-lg"
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending} className="w-full h-14 text-xl font-bold rounded-xl">
            {pending ? "등록 중..." : "일자리 추가"}
          </Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base">공고명</TableHead>
              <TableHead className="text-base">지역</TableHead>
              <TableHead className="text-base">직종</TableHead>
              <TableHead className="text-base">요구 경력</TableHead>
              <TableHead className="text-base">삭제</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-6 text-lg">
                  등록된 일자리가 없습니다
                </TableCell>
              </TableRow>
            )}
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="text-base">{job.title}</TableCell>
                <TableCell className="text-base">{job.region}</TableCell>
                <TableCell className="text-base">{job.job_type}</TableCell>
                <TableCell className="text-base">{job.required_career}년</TableCell>
                <TableCell>
                  <form action={deleteJob}>
                    <input type="hidden" name="id" value={job.id} />
                    <Button type="submit" variant="destructive" className="h-10 text-base">
                      삭제
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
