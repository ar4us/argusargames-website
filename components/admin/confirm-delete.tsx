"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteGameAction, deleteUpcomingGameAction, deleteVersionAction } from "@/lib/actions/admin";

export function DeleteGameButton({
  gameId,
  locale = "ar",
}: {
  gameId: string;
  locale?: string;
}) {
  const tc = useTranslations("common");
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Button
          size="sm"
          variant="danger"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await deleteGameAction(gameId, locale);
              setConfirming(false);
            })
          }
        >
          {tc("yes")}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setConfirming(false)}
        >
          {tc("cancel")}
        </Button>
      </span>
    );
  }

  return (
    <Button size="sm" variant="danger" onClick={() => setConfirming(true)}>
      {tc("delete")}
    </Button>
  );
}

export function DeleteVersionButton({
  versionId,
  locale = "ar",
}: {
  versionId: string;
  locale?: string;
}) {
  const tc = useTranslations("common");
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Button
          size="sm"
          variant="danger"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await deleteVersionAction(versionId, locale);
              setConfirming(false);
            })
          }
        >
          {tc("yes")}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setConfirming(false)}
        >
          {tc("cancel")}
        </Button>
      </span>
    );
  }

  return (
    <Button size="sm" variant="danger" onClick={() => setConfirming(true)}>
      {tc("delete")}
    </Button>
  );
}

export function ConfirmDelete({
  label,
  onConfirm,
  size = "sm",
}: {
  label: string;
  onConfirm: () => Promise<void>;
  size?: "sm" | "md";
}) {
  const tc = useTranslations("common");
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Button
          size={size}
          variant="danger"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await onConfirm();
              setConfirming(false);
            })
          }
        >
          {tc("yes")}
        </Button>
        <Button
          size={size}
          variant="ghost"
          onClick={() => setConfirming(false)}
        >
          {tc("cancel")}
        </Button>
      </span>
    );
  }

  return (
    <Button size={size} variant="danger" onClick={() => setConfirming(true)}>
      {label}
    </Button>
  );
}

export function DeleteUpcomingButton({
  id,
  locale = "ar",
}: {
  id: string;
  locale?: string;
}) {
  const tc = useTranslations("common");
  return (
    <ConfirmDelete
      label={tc("delete")}
      onConfirm={async () => {
        await deleteUpcomingGameAction(id, locale);
      }}
    />
  );
}