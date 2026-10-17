import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export function AuthShell({
  title,
  subtitle,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Container className="py-16">
      <div
        className={`mx-auto ${wide ? "max-w-2xl" : "max-w-md"}`}
      >
        <Card className="p-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </Card>
      </div>
    </Container>
  );
}