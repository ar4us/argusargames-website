import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <Container className="flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-bold tracking-tight text-muted" aria-hidden>
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        {t("title")}
      </h1>
      <p className="mt-2 text-muted">{t("text")}</p>
      <Link href="/" className={`${buttonVariants()} mt-6`}>
        {t("back")}
      </Link>
    </Container>
  );
}