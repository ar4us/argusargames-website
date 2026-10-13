"use client";

import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { saveUpcomingGameAction } from "@/lib/actions/admin";
import { initialFormState } from "@/lib/action-types";
import type { UpcomingGame } from "@/lib/types";

interface UpcomingGameFormProps {
  game?: UpcomingGame | null;
  locale: string;
}

export function UpcomingGameForm({ game, locale }: UpcomingGameFormProps) {
  const [state, formAction, pending] = useActionState(
    saveUpcomingGameAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      {game?.id && <input type="hidden" name="id" value={game.id} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="title_ar">اسم اللعبة بالعربية *</Label>
          <Input
            id="title_ar"
            name="title_ar"
            defaultValue={game?.title_ar ?? ""}
            required
            placeholder="مثال: سايلنت هيل: تاونفول"
          />
        </div>

        <div>
          <Label htmlFor="title_en">English Title *</Label>
          <Input
            id="title_en"
            name="title_en"
            defaultValue={game?.title_en ?? ""}
            required
            dir="ltr"
            placeholder="e.g. Silent Hill: Townfall"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="slug">الرابط المخصص (Slug)</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={game?.slug ?? ""}
            dir="ltr"
            placeholder="silent-hill-townfall"
          />
          <p className="mt-1 text-xs text-muted">اتركه فارغاً للتوليد التلقائي من الاسم الإنجليزي</p>
        </div>

        <div>
          <Label htmlFor="cover_url">رابط صورة الغلاف (Cover Image URL)</Label>
          <Input
            id="cover_url"
            name="cover_url"
            defaultValue={game?.cover_url ?? ""}
            dir="ltr"
            placeholder="https://... أو /covers/game.jpg"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <Label htmlFor="progress_percentage">نسبة الإنجاز (0 - 100%)</Label>
          <div className="mt-1 flex items-center gap-3">
            <Input
              id="progress_percentage"
              name="progress_percentage"
              type="number"
              min={0}
              max={100}
              defaultValue={game?.progress_percentage ?? 0}
              className="w-24 tabular"
            />
            <span className="text-sm font-bold text-muted">%</span>
          </div>
        </div>

        <div>
          <Label htmlFor="status">حالة المشروع</Label>
          <select
            id="status"
            name="status"
            defaultValue={game?.status ?? "قيد التعريب"}
            className="mt-1 block w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-hidden"
          >
            <option value="قيد التعريب">قيد التعريب</option>
            <option value="قيد التدقيق والتجربة">قيد التدقيق والتجربة</option>
            <option value="قيد استخراج النصوص">قيد استخراج النصوص</option>
            <option value="قيد البرمجة">قيد البرمجة</option>
            <option value="قريباً">قريباً</option>
            <option value="مكتمل">مكتمل</option>
          </select>
        </div>

        <div>
          <Label htmlFor="expected_date">الموعد المتوقع للصدور</Label>
          <Input
            id="expected_date"
            name="expected_date"
            defaultValue={game?.expected_date ?? ""}
            placeholder="مثال: قريباً / الربع الأخير 2026"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="platforms">المنصات المدعومة</Label>
        <Input
          id="platforms"
          name="platforms"
          defaultValue={game?.platforms ?? "PC"}
          placeholder="مثال: PC أو PC / PS5"
        />
      </div>

      <div>
        <Label htmlFor="description">نبذة أو معلومات إضافية عن المشروع</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={game?.description ?? ""}
          rows={4}
          placeholder="تفاصيل حول حالة المشروع، هل تم الانتهاء من نصوص القصة، حالة الخط العربي، إلخ..."
        />
      </div>

      {state.error ? <FieldError>{state.error}</FieldError> : null}
      {state.ok ? (
        <p className="rounded-[var(--radius-control)] bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          تم حفظ مشروع التعريب القادم بنجاح!
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : null}
          {game?.id ? "تحديث المشروع" : "إضافة المشروع القادم"}
        </Button>
        <Link
          href="/admin/upcoming"
          className="rounded-[var(--radius-control)] px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
        >
          إلغاء
        </Link>
      </div>
    </form>
  );
}
