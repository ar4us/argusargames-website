"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useActionState } from "react";
import { Gamepad2, RefreshCw, AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { createRequestAction } from "@/lib/actions/requests";
import { initialFormState } from "@/lib/action-types";
import { Button, Spinner } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { Link } from "@/i18n/navigation";
import type { GameWithLatest } from "@/lib/types";

interface RequestFormProps {
  games?: GameWithLatest[];
}

export function RequestForm({ games = [] }: RequestFormProps) {
  const locale = useLocale();
  const [requestType, setRequestType] = useState<"new_translation" | "update_request" | "bug_report">("new_translation");
  const [selectedGameName, setSelectedGameName] = useState("");

  const [state, formAction, pending] = useActionState(
    createRequestAction,
    initialFormState,
  );

  return (
    <div className="space-y-6">
      {/* Type Selector Tabs */}
      <div>
        <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
          اختر نوع الطلب:
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setRequestType("new_translation");
              setSelectedGameName("");
            }}
            className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all border ${
              requestType === "new_translation"
                ? "border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400 shadow-xs"
                : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
            }`}
          >
            <Gamepad2 className="h-4 w-4" />
            <span>طلب تعريب جديد</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRequestType("update_request");
              setSelectedGameName("");
            }}
            className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all border ${
              requestType === "update_request"
                ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs"
                : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>طلب تحديث تعريب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRequestType("bug_report");
              setSelectedGameName("");
            }}
            className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all border ${
              requestType === "bug_report"
                ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-xs"
                : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>إبلاغ عن خطأ</span>
          </button>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="request_type" value={requestType} />

        {/* 1. NEW TRANSLATION MODE */}
        {requestType === "new_translation" && (
          <>
            <div>
              <Label htmlFor="game_name">اسم اللعبة المطلوب تعريبها *</Label>
              <Input
                id="game_name"
                name="game_name"
                required
                placeholder="مثال: Alan Wake 2 أو Resident Evil 4"
              />
            </div>

            <div>
              <Label htmlFor="game_url">رابط اللعبة في متجر Steam أو Epic (اختياري)</Label>
              <Input
                id="game_url"
                name="game_url"
                type="url"
                dir="ltr"
                className="text-left"
                placeholder="https://store.steampowered.com/app/..."
              />
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات أو نبذة عن اللعبة (اختياري)</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="اذكر نوع اللعبة، محركها إن كنت تعرفه، أو سبب رغبتك في رؤيتها بالعربية..."
              />
            </div>
          </>
        )}

        {/* 2. UPDATE REQUEST MODE */}
        {requestType === "update_request" && (
          <>
            <div>
              <Label htmlFor="game_select">اختر اللعبة المتوفرة في الموقع *</Label>
              {games.length > 0 ? (
                <div className="space-y-2">
                  <select
                    id="game_select"
                    className="block w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-blue-500 focus:outline-hidden"
                    value={selectedGameName}
                    onChange={(e) => setSelectedGameName(e.target.value)}
                  >
                    <option value="">-- اختر اللعبة من القائمة --</option>
                    {games.map((g) => (
                      <option key={g.id} value={g.title_ar}>
                        {g.title_ar} ({g.title_en})
                      </option>
                    ))}
                    <option value="other">لعبة أخرى (كتابة الاسم يدوياً)</option>
                  </select>

                  {(!selectedGameName || selectedGameName === "other") && (
                    <Input
                      id="game_name"
                      name="game_name"
                      required
                      placeholder="اكتب اسم اللعبة هنا..."
                    />
                  )}
                  {selectedGameName && selectedGameName !== "other" && (
                    <input type="hidden" name="game_name" value={selectedGameName} />
                  )}
                </div>
              ) : (
                <Input
                  id="game_name"
                  name="game_name"
                  required
                  placeholder="اسم اللعبة التي نزل لها تحديث..."
                />
              )}
            </div>

            <div>
              <Label htmlFor="update_version">رقم التحديث الجديد أو تاريخه</Label>
              <Input
                id="update_version"
                name="update_version"
                placeholder="مثال: Patch v1.5 أو تحديث شهر أكتوبر على Steam"
              />
            </div>

            <div>
              <Label htmlFor="game_url">رابط خبر التحديث أو ملاحظات المطور (اختياري)</Label>
              <Input
                id="game_url"
                name="game_url"
                type="url"
                dir="ltr"
                className="text-left"
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="notes">تفاصيل المشكلة الناتجة عن التحديث *</Label>
              <Textarea
                id="notes"
                name="notes"
                required
                rows={3}
                placeholder="اشرح ماذا حدث بعد التحديث: هل اللعبة لم تعد تقبل الباتش، أم تظهر نصوص إنجليزية، أم كراش عند التشغيل؟"
              />
            </div>
          </>
        )}

        {/* 3. BUG REPORT MODE */}
        {requestType === "bug_report" && (
          <>
            <div>
              <Label htmlFor="game_select_bug">اللعبة التي تحتوي على الخطأ *</Label>
              {games.length > 0 ? (
                <div className="space-y-2">
                  <select
                    id="game_select_bug"
                    className="block w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-rose-500 focus:outline-hidden"
                    value={selectedGameName}
                    onChange={(e) => setSelectedGameName(e.target.value)}
                  >
                    <option value="">-- اختر اللعبة من القائمة --</option>
                    {games.map((g) => (
                      <option key={g.id} value={g.title_ar}>
                        {g.title_ar} ({g.title_en})
                      </option>
                    ))}
                    <option value="other">لعبة أخرى (كتابة الاسم يدوياً)</option>
                  </select>

                  {(!selectedGameName || selectedGameName === "other") && (
                    <Input
                      id="game_name"
                      name="game_name"
                      required
                      placeholder="اكتب اسم اللعبة..."
                    />
                  )}
                  {selectedGameName && selectedGameName !== "other" && (
                    <input type="hidden" name="game_name" value={selectedGameName} />
                  )}
                </div>
              ) : (
                <Input
                  id="game_name"
                  name="game_name"
                  required
                  placeholder="اكتب اسم اللعبة..."
                />
              )}
            </div>

            <div>
              <Label htmlFor="bug_type">تصنيف المشكلة أو الخطأ *</Label>
              <select
                id="bug_type"
                name="bug_type"
                required
                className="block w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-rose-500 focus:outline-hidden"
              >
                <option value="نص مقلوب أو حروف متقطعة">نص مقلوب أو حروف متقطعة (RTL / Shaping Issue)</option>
                <option value="كلمات أو جمل غير مترجمة">كلمات أو جمل باقية بالإنجليزية</option>
                <option value="خطأ لغوي أو نحوي أو سياقي">خطأ لغوي أو نحوي أو سياقي</option>
                <option value="كراش أو خروج مفاجئ من اللعبة">كراش أو خروج مفاجئ من اللعبة عند نقطة معينة</option>
                <option value="مشكلة في برنامج التثبيت">مشكلة في برنامج التثبيت (Installer Error)</option>
                <option value="أخرى">أخرى (سأشرحها في الوصف)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="game_url">رابط لقطة شاشة للخطأ (Imgur / Discord / Drive - اختياري)</Label>
              <Input
                id="game_url"
                name="game_url"
                type="url"
                dir="ltr"
                className="text-left"
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="notes">وصف دقيق للمشكلة وسياق حدوثها *</Label>
              <Textarea
                id="notes"
                name="notes"
                required
                rows={3}
                placeholder="أين ظهر الخطأ بالضبط؟ (في القائمة الرئيسية، في حوار شخصية معينة، في الفصل الثاني، إلخ...)"
              />
            </div>
          </>
        )}

        {state.ok ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-sm font-bold">
              {requestType === "bug_report"
                ? "تم استلام تقرير الخطأ بنجاح! شكراً لمساعدتك في تحسين جودة التعريب."
                : requestType === "update_request"
                ? "تم استلام طلب التحديث بنجاح! سنقوم بفحص التوافق وتجهيز الباتش الجديد."
                : "تم إرسال طلب التعريب بنجاح وسيتم إدراجه للتصويت والمراجعة!"}
            </span>
          </div>
        ) : (
          <>
            {state.error ? <FieldError>{state.error}</FieldError> : null}
            <Button
              type="submit"
              disabled={pending}
              className={`w-full py-3 ${
                requestType === "bug_report"
                  ? "bg-rose-600 hover:bg-rose-500"
                  : requestType === "update_request"
                  ? "bg-amber-600 hover:bg-amber-500"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {pending ? <Spinner /> : <Send className="h-4 w-4" />}
              <span>
                {requestType === "bug_report"
                  ? "إرسال تقرير الخطأ"
                  : requestType === "update_request"
                  ? "إرسال طلب التحديث"
                  : "إرسال طلب التعريب"}
              </span>
            </Button>
          </>
        )}
      </form>
    </div>
  );
}