import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { PageIntro } from "@/components/PageIntro";
import { career } from "@/lib/content";
import { company } from "@/lib/format";

export const metadata: Metadata = { title: "Karrier" };

export default function CareerPage() {
  return (
    <>
      <PageIntro kicker="Állás" title={career.title} lede={career.body} />
      <section className="wrap contact">
        <div>
          <p>{career.contact}</p>
          <p>
            <a href={company.jobPhoneHref}>{company.jobPhone}</a>
          </p>
          <p>
            <a href={company.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </p>
          <InquiryForm kind="karrier" />
        </div>
        <img src="/studio/makro.jpg" alt="Acél felület közelről" />
      </section>
    </>
  );
}
