"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { CheckCircle2, Home as HomeIcon, Ruler, Leaf, ShieldCheck, ThermometerSun, HousePlus } from "lucide-react";

export default function Home() {
  // Scarcity: simple countdown to nächster Besichtigungsslot
  const [secondsLeft, setSecondsLeft] = useState(60 * 60 * 24); // 24h
  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(id);
  }, []);
  const hhmmss = useMemo(() => {
    const h = Math.floor(secondsLeft / 3600).toString().padStart(2, "0");
    const m = Math.floor(secondsLeft % 3600 / 60).toString().padStart(2, "0");
    const s = Math.floor(secondsLeft % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [secondsLeft]);

  // Simple lead capture state
  const [form, setForm] = useState({ vorname: "", nachname: "", email: "", telefon: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function scrollToForm() {
    const el = document.getElementById("anfrage");
    if (!el) return;
    const header = document.querySelector('[data-sticky-header]') as HTMLElement | null;
    const offset = (header?.offsetHeight ?? 0) + 8;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vorname: form.vorname,
          nachname: form.nachname,
          email: form.email,
          telefon: form.telefon,
          projekt: "Wohnen in der Lohe – Schmidgaden"
        })
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
      setForm({ vorname: "", nachname: "", email: "", telefon: "" });
    } catch (err) {
      setError("Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-sans min-h-screen bg-background text-foreground">
      {/* Scarcity ribbon */}
      <div
        className="sticky top-0 z-50 w-full border-b bg-secondary/60 backdrop-blur supports-[backdrop-filter]:bg-secondary/40"
        data-sticky-header>

        <div className="mx-auto max-w-6xl px-4 py-2 text-center text-sm">
          Nur noch <span className="font-semibold">2 Wohnungen</span> verfügbar
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <Badge variant="secondary" className="rounded-full">Neubauprojekt · Energieeffizienz A+</Badge>
          <h1 className="text-4xl font-semibold tracking-tight md:!text-[46px] !w-[492px] !h-[153px]">
            Ihr 3 Zimmer Wohntraum in Schmidgaden
            <br />
            <span className="text-muted-foreground !text-[22px]">Nur noch 2 von 12 verfügbar</span>
          </h1>

          {/* Mobile-only: Big hero image directly after headline */}
          <div className="block md:hidden">
            <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
              <Image
                src="https://wohnen-in-der-lohe.de/wp-content/uploads/2024/10/Ansicht-Schmidgaden.webp"
                alt="Visualisierung: Moderne Mehrfamilienhäuser in Schmidgaden"
                fill
                className="object-cover"
                priority
                unoptimized />

            </div>
          </div>

          <p className="hidden md:block text-muted-foreground text-lg">
            Ideal für Paare, kleine Familien oder Kapitalanleger: ca. 88 m² mit Balkon, viel Licht & modernem Grundriss – Schulen, Kitas und Einkaufsmöglichkeiten nur wenige Minuten entfernt.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Leaf className="size-4" />Wärmepumpe & Fußbodenheizung</div>
            <div className="flex items-center gap-2"><ThermometerSun className="size-4" />Ausstattung auf Effizienz</div>
            <div className="flex items-center gap-2"><ShieldCheck className="size-4" />Videogegensprechanlage</div>
          </div>

          <Card className="border-foreground/10 scroll-mt-12 md:scroll-mt-16" id="anfrage">
            <CardHeader>
              <CardTitle>Exposé & Preisliste anfordern</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ?
              <div className="space-y-2">
                  <p className="text-green-700 dark:text-green-300 font-medium">Danke! Wir haben Ihre Anfrage erhalten.</p>
                  <p className="text-sm text-muted-foreground">Wir melden uns zeitnah mit allen Unterlagen und Terminvorschlägen zur Besichtigung.</p>
                </div> :

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {error && <div className="sm:col-span-2 text-sm text-red-600 dark:text-red-400">{error}</div>}
                  <div className="sm:col-span-1">
                    <Label htmlFor="vorname">Vorname</Label>
                    <Input id="vorname" name="vorname" value={form.vorname} onChange={handleChange} placeholder="Max" required />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="nachname">Nachname</Label>
                    <Input id="nachname" name="nachname" value={form.nachname} onChange={handleChange} placeholder="Mustermann" required />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="email">E‑Mail</Label>
                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="max@mail.de" required />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="telefon">Telefon</Label>
                    <Input id="telefon" name="telefon" type="tel" value={form.telefon} onChange={handleChange} placeholder="0151 2345678" required />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <p className="text-xs text-muted-foreground">Mit Absenden stimmen Sie der Kontaktaufnahme laut Datenschutz zu.</p>
                    <div className="sm:ml-auto" />
                    <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                      {loading ? "Wird gesendet…" : "Gratis Exposé anfordern"}
                    </Button>
                  </div>
                </form>
              }
            </CardContent>
          </Card>

          {/* Mobile-only: Trust badges directly after the form */}
          <div className="block md:hidden">
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 rounded-lg bg-secondary px-4 py-3">
              <Image
                src="https://rathay-immobilien.com/wp-content/uploads/2024/09/50-Google-Bewertung.webp"
                alt="Google Bewertungen: 5 Sterne – Rathay Immobilien"
                width={160}
                height={40}
                className="h-8 w-auto object-contain"
                unoptimized />

              <Image
                src="https://www.immobilienscout24.de/content/is24/deu/www/de/anbieten/gewerbliche-anbieter/lp/profis-leicht-erkennen/_jcr_content/par/tmlandingpage/parsys/flexigrid_370937528_/column2/image.img.png/1709029734718.png"
                alt="ImmoScout24 Gold Partner"
                width={180}
                height={40}
                className="h-8 w-auto object-contain"
                unoptimized />

            </div>
          </div>

          {/* Mobile-only: Three smaller highlight images after trust */}
          <div className="block md:hidden">
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src="https://wohnen-in-der-lohe.de/wp-content/uploads/2024/10/wohnen-in-der-lohe-balkone.webp"
                  alt="Balkone und Terrassen"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  unoptimized />

              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src="https://wohnen-in-der-lohe.de/wp-content/uploads/2024/10/wohnen-in-der-lohe-visualisierung.webp"
                  alt="Außenvisualisierung"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  unoptimized />

              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src="https://wohnen-in-der-lohe.de/wp-content/uploads/2024/10/wohnen-in-der-lohe-lage.webp"
                  alt="Lageplan"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  unoptimized />

              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Top: big main image */}
          <div className="hidden md:block relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[3/2]">
            <Image
              src="https://wohnen-in-der-lohe.de/wp-content/uploads/2024/10/Ansicht-Schmidgaden.webp"
              alt="Visualisierung der Gebäude – Wohnen in der Lohe"
              fill
              className="object-cover"
              priority
              unoptimized />

          </div>

          {/* Bottom: three smaller highlight images */}
          <div className="hidden md:grid mt-4 grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="https://wohnen-in-der-lohe.de/wp-content/uploads/2024/10/P-0166_INT2_240918-enhanced-scaled.webp"
                alt="Visualisierung Schlafzimmer"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized />

            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="https://wohnen-in-der-lohe.de/wp-content/uploads/2024/10/P-0166_INT4_2401026-enhanced-neues-bad-scaled.webp"
                alt="Visualisierung Badezimmer"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized />

            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="https://wohnen-in-der-lohe.de/wp-content/uploads/2024/10/P-0166_Ext1_240928-enhanced-scaled.webp"
                alt="Visualisierung Gebäuße & Parkplatz außen"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized />

            </div>
          </div>

          {/* Trust badges (desktop) */}
          <div className="hidden md:flex mt-4 flex-wrap items-center justify-center gap-6 rounded-lg bg-secondary px-4 py-3">
            <Image
              src="https://rathay-immobilien.com/wp-content/uploads/2024/09/50-Google-Bewertung.webp"
              alt="Google Bewertungen: 5 Sterne – Rathay Immobilien"
              width={160}
              height={40}
              className="h-10 lg:h-12 w-auto object-contain"
              unoptimized />

            <Image
              src="https://www.immobilienscout24.de/content/is24/deu/www/de/anbieten/gewerbliche-anbieter/lp/profis-leicht-erkennen/_jcr_content/par/tmlandingpage/parsys/flexigrid_370937528_/column2/image.img.png/1709029734718.png"
              alt="ImmoScout24 Gold Partner"
              width={180}
              height={40}
              className="h-10 lg:h-12 w-auto object-contain"
              unoptimized />

          </div>
        </div>
      </section>

      {/* Trust & Highlights */}
      <section className="border-t bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="rounded-2xl bg-card p-8 md:p-12 border">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              {/* Left: Heading, badges, ratings */}
              <div className="max-w-xl space-y-4">
                <h2 className="text-2xl font-semibold">Sicher wohnen & nachhaltig investieren</h2>
                <p className="text-muted-foreground">Energieeffiziente Bauweise (A+), langlebige Materialien, geringe Nebenkosten.</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge className="rounded-full" variant="secondary">Baubeginn: Q1/2025</Badge>
                  <Badge className="rounded-full" variant="secondary">3‑Zimmer · ca. 88 m²</Badge>
                  <Badge className="rounded-full" variant="secondary">Balkon / Terrasse</Badge>
                </div>
              </div>

              {/* Middle: Technical checklist */}
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 md:max-w-xl">
                {[
                "Energieeffizienzklasse A+",
                "Wärmepumpe & Fußbodenheizung",
                "Echtholz‑Parkett, bodengleiche Dusche",
                "Raffstores / Rollläden elektrisch",
                "Videogegensprechanlage",
                "Parkplätze direkt am Haus"].
                map((item) =>
                <div key={item} className="flex items-center gap-2 rounded-lg border border-transparent bg-secondary px-3 py-2 text-sm">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="opacity-90">{item}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: Key metrics */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
              { t: "2 verfügbare Einheiten", s: "2.4 (1. OG) · 2.6 (2. OG)", I: HousePlus },
              { t: "ca. 87,9 m² Wohnfläche", s: "3 Zimmer · Balkon/Terrasse", I: HomeIcon },
              { t: "Kaufpreis ab 308.000 €", s: "+ Stellplatz 7.500 €", I: Ruler },
              { t: "A+ & niedrige Nebenkosten", s: "Wärmepumpe · FB‑Heizung", I: Leaf }].
              map((f) =>
              <Card key={f.t} className="border-foreground/10 bg-card">
                  <CardHeader className="pb-1">
                    <div className="flex items-center gap-2">
                      <f.I className="size-5 text-muted-foreground" />
                      <CardTitle className="text-base">{f.t}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{f.s}</CardContent>
                </Card>
              )}
            </div>

            {/* CRO CTA */}
            <div className="mt-8 flex flex-col items-center gap-3 text-center">
              <div className="text-xs text-muted-foreground">Besichtigungstermine sind limitiert.</div>
              <Button size="lg" onClick={scrollToForm}>Exposé & Preisliste erhalten</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lage */}
      <section id="lage" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Top‑Lage in Schmidgaden – ruhig, zentral, gut angebunden</h2>
            <p className="text-muted-foreground">
              Sie wohnen angenehm ruhig am Ortsrand und sind trotzdem schnell überall: Einkauf, Kita/Schule, Ärzte und die A93 erreichen Sie in wenigen Minuten. Die genaue Adresse lautet: In der Lohe 1, 92546 Schmidgaden.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full">Einkauf & Schule nah</Badge>
              <Badge variant="secondary" className="rounded-full">Schnell auf der A93</Badge>
              <Badge variant="secondary" className="rounded-full">Grünlage am Ortsrand</Badge>
            </div>
            <div className="pt-2">
              <Button onClick={scrollToForm}>Adresse & Besichtigung anfragen</Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-card">
            <Image
              src="https://wohnen-in-der-lohe.de/wp-content/uploads/2024/10/Karte-Schmidgaden@2x-1-scaled.webp"
              alt="Karte: Lage in Schmidgaden – In der Lohe 1"
              fill
              className="object-cover"
              unoptimized />

          </div>
        </div>
      </section>

      {/* Units Focus */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-3xl font-semibold mb-6">Die letzten 2 Wohnungen</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[{ we: "WE 2.4", og: "1. OG", fl: "ca. 87,93 m²", preis: "308.000 €", features: ["3 Zimmer", "Balkon", "Abstellraum + Kellerersatz"], img: "https://rathay-immobilien.com/wp-content/uploads/2025/06/56be3ca6-6e8f-427a-a27d-ddce523903f2.jpg" },
          { we: "WE 2.6", og: "2. OG", fl: "ca. 87,93 m²", preis: "308.000 €", features: ["3 Zimmer", "Weitblick", "Raffstore elektrisch"], img: "https://rathay-immobilien.com/wp-content/uploads/2025/06/56be3ca6-6e8f-427a-a27d-ddce523903f2.jpg" }].map((u) =>
          <Card key={u.we} className="overflow-hidden border-foreground/10">
              <div className="relative aspect-[16/10]">
                <Image src={u.img} alt={`${u.we} – Visualisierung`} fill className="object-cover" unoptimized />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">{u.we}</Badge>
                  <Badge variant="secondary" className="rounded-full">{u.og}</Badge>
                </div>
                <CardTitle className="text-xl mt-2">3‑Zimmer‑Wohnung · {u.fl}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {u.features.map((f) =>
                <Badge key={f} variant="outline" className="rounded-full">{f}</Badge>
                )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-semibold">Kaufpreis {u.preis}</div>
                  <Button onClick={scrollToForm}>Exposé anfordern</Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">zzgl. Stellplatz 7.500 €</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <h2 className="text-3xl font-semibold mb-6">Häufige Fragen</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="unverbindlich">
              <AccordionTrigger>Ist meine Anfrage unverbindlich?</AccordionTrigger>
              <AccordionContent>
                Ja. Ihre Anfrage ist vollkommen unverbindlich. Sie erhalten das Exposé und wir stimmen auf Wunsch einen Besichtigungstermin mit Ihnen ab.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="preise">
              <AccordionTrigger>Was kosten die Wohnungen?</AccordionTrigger>
              <AccordionContent>
                Der Kaufpreis für die ca. 88 m²‑Einheiten beträgt 308.000 € je Wohnung. Ein Stellplatz kann für 7.500 € erworben werden.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="energie">
              <AccordionTrigger>Wie sind die Energiedaten?</AccordionTrigger>
              <AccordionContent>
                Energieeffiziente Bauweise mit Wärmepumpe und Fußbodenheizung. Geplante Energieeffizienzklasse A+ – damit profitieren Sie von niedrigen Betriebskosten.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="verfuegbarkeit">
              <AccordionTrigger>Welche Wohnungen sind noch verfügbar?</AccordionTrigger>
              <AccordionContent>
                Aktuell sind zwei 3‑Zimmer‑Wohnungen (WE 2.4 im 1. OG und WE 2.6 im 2. OG) verfügbar, jeweils ca. 88 m² mit Balkon/Terrasse.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Ansprechpartner */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-card">
            <Image
              src="https://rathay-immobilien.com/wp-content/uploads/2025/09/92EE366C-12A3-4A02-BEFE-A5FA0613DC02_1_201_a.jpeg"
              alt="Lukas Rathay – Ihr Ansprechpartner"
              fill
              className="object-cover"
              unoptimized />

          </div>
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-3xl font-semibold">Ihr Ansprechpartner</h2>
            <div>
              <div className="text-lg font-medium">Lukas Rathay</div>
              <p className="mt-1 text-muted-foreground">
                Fragen zum Projekt „Wohnen in der Lohe“? Wir begleiten Sie von der ersten Anfrage bis zur Schlüsselübergabe – inklusive Finanzierungs‑Sparring, Besichtigung und Kaufvertragsabwicklung.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={scrollToForm}>Beratung anfragen</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight !whitespace-pre-line">Sichern Sie sich eine der letzten Wohnungen</h3>
          <p className="mt-2 text-muted-foreground">
            Fordern Sie jetzt das Exposé an und erhalten Sie alle Unterlagen inkl. Preisliste und Grundrisse.
          </p>
          <div className="mt-6 flex justify-center">
            <Button size="lg" onClick={scrollToForm}>Jetzt Exposé erhalten</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold">Rathay Immobilien</div>
            <p className="mt-2 text-sm text-muted-foreground">Linzer Straße 13, 93055 Regensburg</p>
            <p className="text-sm text-muted-foreground">Telefon: +49 173 2786180 · E‑Mail: mail@rathay-immobilien.com</p>
          </div>
          <div>
            <div className="font-medium">Rechtliches</div>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li><a className="hover:underline" href="https://rathay-immobilien.com/impressum/">Impressum</a></li>
              <li><a className="hover:underline" href="https://rathay-immobilien.com/datenschutz/">Datenschutz</a></li>
            </ul>
          </div>
          <div>
            <div className="font-medium">Jetzt beraten lassen</div>
            <p className="mt-2 text-sm text-muted-foreground">Unser Team ist Mo–Sa von 9–19 Uhr für Sie erreichbar.</p>
            <Button className="mt-3 w-full md:w-auto" onClick={scrollToForm}>Beratung anfragen</Button>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Rathay Immobilien. Alle Rechte vorbehalten.</div>
      </footer>
    </div>);

}